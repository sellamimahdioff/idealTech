import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { mkdirSync } from 'fs';
import { join } from 'path';
import { Invoice } from './entities/invoice.entity.js';
import { Order, OrderStatus } from '../order/entities/order.entity.js';
import { generateInvoicePdf } from './invoice-pdf.generator.js';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepo: Repository<Invoice>,
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}

  private async generateInvoiceNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.invoiceRepo.count();
    const sequence = String(count + 1).padStart(5, '0');
    return `FAC-${year}-${sequence}`;
  }

  async generateFromOrder(orderId: number): Promise<Invoice> {
    const order = await this.orderRepo.findOne({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException(`Commande #${orderId} introuvable.`);
    }
    if (order.status !== OrderStatus.CONFIRMED &&
        order.status !== OrderStatus.SHIPPED &&
        order.status !== OrderStatus.DELIVERED) {
      throw new BadRequestException(
        'Seule une commande confirmée peut être facturée.',
      );
    }

    const existing = await this.invoiceRepo.findOne({
      where: { order: { id: orderId } },
    });
    if (existing) {
      throw new ConflictException(
        `Une facture existe déjà pour cette commande (${existing.invoice_number}).`,
      );
    }

    // S'assure que le dossier de destination existe
    mkdirSync(join(process.cwd(), 'uploads', 'invoices'), {
      recursive: true,
    });

    const invoiceNumber = await this.generateInvoiceNumber();
    const pdfUrl = await generateInvoicePdf(invoiceNumber, order);

    const invoice = this.invoiceRepo.create({
      invoice_number: invoiceNumber,
      order,
      pdf_url: pdfUrl,
      total_amount: order.total_amount,
    });

    return this.invoiceRepo.save(invoice);
  }

  async findAll(): Promise<Invoice[]> {
    return this.invoiceRepo.find({ order: { issued_at: 'DESC' } });
  }

  async findOne(id: number): Promise<Invoice> {
    const invoice = await this.invoiceRepo.findOne({ where: { id } });
    if (!invoice) {
      throw new NotFoundException(`Facture #${id} introuvable.`);
    }
    return invoice;
  }
}
