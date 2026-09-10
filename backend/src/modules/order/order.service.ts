import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Order,
  OrderItem,
  OrderStatus,
  OrderStatusHistory,
  OrderType,
} from './entities/order.entity.js';
import { Product } from '../product/entities/product.entity.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { QueryOrderDto } from './dto/query-order.dto.js';
import { MailService } from '../mail/mail.service.js';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,
    @InjectRepository(OrderStatusHistory)
    private readonly statusHistoryRepo: Repository<OrderStatusHistory>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private readonly mailService: MailService,
  ) {}

  private async generateOrderNumber(type: OrderType): Promise<string> {
    const prefix = type === OrderType.QUOTE ? 'DEV' : 'CMD';
    const year = new Date().getFullYear();
    const count = await this.orderRepo.count({ where: { type } });
    const sequence = String(count + 1).padStart(5, '0');
    return `${prefix}-${year}-${sequence}`;
  }

  async create(dto: CreateOrderDto): Promise<Order> {
    const orderItems: OrderItem[] = [];
    let total = 0;

    for (const itemInput of dto.items ?? []) {
      const product = await this.productRepo.findOne({
        where: { id: itemInput.productId },
      });
      if (!product) {
        throw new NotFoundException(
          `Produit #${itemInput.productId} introuvable.`,
        );
      }
      if (
        dto.type === OrderType.ORDER &&
        product.stock_quantity < itemInput.quantity
      ) {
        throw new BadRequestException(
          `Stock insuffisant pour "${product.name}" (disponible: ${product.stock_quantity}).`,
        );
      }

      const isWholesale =
        product.wholesale_price &&
        product.wholesale_min_qty &&
        itemInput.quantity >= product.wholesale_min_qty;
      const unitPrice = isWholesale
        ? Number(product.wholesale_price)
        : Number(product.retail_price);
      const subtotal = unitPrice * itemInput.quantity;
      total += subtotal;

      orderItems.push(
        this.orderItemRepo.create({
          product,
          quantity: itemInput.quantity,
          unit_price: unitPrice,
          subtotal,
        }),
      );
    }

    const order = this.orderRepo.create({
      order_number: await this.generateOrderNumber(dto.type),
      type: dto.type,
      status: OrderStatus.PENDING,
      customer_name: dto.customer_name,
      customer_email: dto.customer_email,
      customer_phone: dto.customer_phone,
      customer_company: dto.customer_company,
      customer_country: dto.customer_country,
      customer_region: dto.customer_region,
      shipping_address: dto.shipping_address,
      total_amount: total,
      items: orderItems,
      status_history: [
        this.statusHistoryRepo.create({ status: OrderStatus.PENDING }),
      ],
    });

    const saved = await this.orderRepo.save(order);

    if (dto.type === OrderType.ORDER) {
      for (const item of orderItems) {
        await this.productRepo.decrement(
          { id: item.product.id },
          'stock_quantity',
          item.quantity,
        );
      }
    }

    this.mailService
      .sendOrderConfirmation(saved)
      .catch((err) => console.error('Erreur envoi email:', err.message));
    this.mailService
      .sendAdminNotification(saved)
      .catch((err) =>
        console.error('Erreur notification admin:', err.message),
      );

    return saved;
  }

  async findAll(query: QueryOrderDto): Promise<Order[]> {
    return this.orderRepo.find({
      where: {
        ...(query.type ? { type: query.type } : {}),
        ...(query.status ? { status: query.status } : {}),
      },
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepo.findOne({
      where: { id },
      order: { status_history: { changed_at: 'ASC' } },
    });
    if (!order) {
      throw new NotFoundException(`Commande #${id} introuvable.`);
    }
    return order;
  }

  async track(orderNumber: string, email: string): Promise<Order> {
    const order = await this.orderRepo.findOne({
      where: { order_number: orderNumber },
    });
    if (!order || order.customer_email.toLowerCase() !== email.toLowerCase()) {
      throw new UnauthorizedException(
        'Aucune commande trouvée avec ces informations.',
      );
    }
    return order;
  }

  async updateStatus(id: number, status: OrderStatus): Promise<Order> {
    const order = await this.findOne(id);
    order.status = status;
    await this.statusHistoryRepo.save(
      this.statusHistoryRepo.create({ order, status }),
    );
    return this.orderRepo.save(order);
  }

  async convertQuoteToOrder(id: number): Promise<Order> {
    const order = await this.findOne(id);
    if (order.type !== OrderType.QUOTE) {
      throw new BadRequestException("Cette entrée n'est pas un devis.");
    }

    for (const item of order.items) {
      const product = await this.productRepo.findOne({
        where: { id: item.product.id },
      });
      if (product && product.stock_quantity < item.quantity) {
        throw new BadRequestException(
          `Stock insuffisant pour "${product.name}" au moment de la conversion.`,
        );
      }
    }

    order.type = OrderType.ORDER;
    order.order_number = await this.generateOrderNumber(OrderType.ORDER);
    const saved = await this.orderRepo.save(order);

    for (const item of order.items) {
      await this.productRepo.decrement(
        { id: item.product.id },
        'stock_quantity',
        item.quantity,
      );
    }

    return saved;
  }

  // ---- Export CSV ----
  async exportToCsv(): Promise<string> {
    const orders = await this.orderRepo.find({ order: { created_at: 'DESC' } });
    const header = [
      'Numéro',
      'Type',
      'Statut',
      'Client',
      'Société',
      'Email',
      'Téléphone',
      'Total (TND)',
      'Date',
    ].join(',');

    const rows = orders.map((o) =>
      [
        o.order_number,
        o.type,
        o.status,
        `"${o.customer_name}"`,
        `"${o.customer_company ?? ''}"`,
        o.customer_email,
        o.customer_phone,
        Number(o.total_amount).toFixed(2),
        new Date(o.created_at).toLocaleDateString('fr-FR'),
      ].join(','),
    );

    return [header, ...rows].join('\n');
  }
}
