import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Product } from './entities/product.entity.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { QueryProductDto } from './dto/query-product.dto.js';
import { Category } from '../category/entities/category.entity.js';
import { StockAlertService } from '../stock-alert/stock-alert.service.js';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    private readonly stockAlertService: StockAlertService,
  ) {}

  async create(dto: CreateProductDto): Promise<Product> {
    const existing = await this.productRepo.findOne({
      where: { sku: dto.sku },
    });
    if (existing) {
      throw new ConflictException('Cette référence (SKU) existe déjà.');
    }

    const product = this.productRepo.create({
      sku: dto.sku,
      name: dto.name,
      brand: dto.brand,
      description: dto.description,
      retail_price: dto.retail_price,
      wholesale_price: dto.wholesale_price,
      wholesale_min_qty: dto.wholesale_min_qty ?? 10,
      stock_quantity: dto.stock_quantity ?? 0,
      images: dto.images ?? [],
    });

    if (dto.categoryId) {
      const category = await this.categoryRepo.findOne({
        where: { id: dto.categoryId },
      });
      if (!category) {
        throw new NotFoundException('Catégorie introuvable.');
      }
      product.category = category;
    }

    return this.productRepo.save(product);
  }

  async findAll(query: QueryProductDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const qb = this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category');

    if (query.categoryId) {
      qb.andWhere('category.id = :categoryId', {
        categoryId: query.categoryId,
      });
    }

    if (query.search) {
      qb.andWhere(
        '(product.name ILIKE :search OR product.sku ILIKE :search)',
        { search: `%${query.search}%` },
      );
    }

    if (query.brand) {
      qb.andWhere('product.brand ILIKE :brand', { brand: `%${query.brand}%` });
    }

    if (query.minPrice !== undefined) {
      qb.andWhere('product.retail_price >= :minPrice', {
        minPrice: query.minPrice,
      });
    }

    if (query.maxPrice !== undefined) {
      qb.andWhere('product.retail_price <= :maxPrice', {
        maxPrice: query.maxPrice,
      });
    }

    if (query.inStock) {
      qb.andWhere('product.stock_quantity > 0');
    }

    qb.orderBy('product.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [items, total] = await qb.getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Liste des marques distinctes présentes au catalogue (pour peupler le filtre)
  async findDistinctBrands(): Promise<string[]> {
    const rows = await this.productRepo
      .createQueryBuilder('product')
      .select('DISTINCT product.brand', 'brand')
      .where('product.brand IS NOT NULL')
      .orderBy('product.brand', 'ASC')
      .getRawMany();
    return rows.map((r) => r.brand).filter(Boolean);
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: { category: true },
    });
    if (!product) {
      throw new NotFoundException(`Produit #${id} introuvable.`);
    }
    return product;
  }

  // Produits de la même catégorie, hors le produit courant
  async findRelated(id: number, limit = 4): Promise<Product[]> {
    const product = await this.findOne(id);
    if (!product.category) return [];

    return this.productRepo.find({
      where: {
        category: { id: product.category.id },
        id: Not(id),
      },
      take: limit,
      order: { created_at: 'DESC' },
    });
  }

  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    const wasOutOfStock = product.stock_quantity <= 0;

    if (dto.sku && dto.sku !== product.sku) {
      const existing = await this.productRepo.findOne({
        where: { sku: dto.sku },
      });
      if (existing) {
        throw new ConflictException('Cette référence (SKU) existe déjà.');
      }
    }

    if (dto.categoryId !== undefined) {
      const category = dto.categoryId
        ? await this.categoryRepo.findOne({ where: { id: dto.categoryId } })
        : null;
      if (dto.categoryId && !category) {
        throw new NotFoundException('Catégorie introuvable.');
      }
      product.category = category;
    }

    Object.assign(product, {
      sku: dto.sku ?? product.sku,
      name: dto.name ?? product.name,
      brand: dto.brand ?? product.brand,
      description: dto.description ?? product.description,
      retail_price: dto.retail_price ?? product.retail_price,
      wholesale_price: dto.wholesale_price ?? product.wholesale_price,
      wholesale_min_qty: dto.wholesale_min_qty ?? product.wholesale_min_qty,
      stock_quantity: dto.stock_quantity ?? product.stock_quantity,
      images: dto.images ?? product.images,
    });

    const saved = await this.productRepo.save(product);

    // Le stock vient de repasser de 0 à positif : on prévient les inscrits
    if (wasOutOfStock && saved.stock_quantity > 0) {
      this.stockAlertService
        .notifyAndClear(saved.id)
        .catch((err) =>
          console.error('Erreur notification stock:', err.message),
        );
    }

    return saved;
  }

  async addImages(id: number, imageUrls: string[]): Promise<Product> {
    const product = await this.findOne(id);
    product.images = [...(product.images ?? []), ...imageUrls];
    return this.productRepo.save(product);
  }

  async removeImage(id: number, imageUrl: string): Promise<Product> {
    const product = await this.findOne(id);
    product.images = (product.images ?? []).filter(
      (url) => url !== imageUrl,
    );
    return this.productRepo.save(product);
  }

  // Réordonne les images (drag & drop côté admin)
  async reorderImages(id: number, orderedUrls: string[]): Promise<Product> {
    const product = await this.findOne(id);
    product.images = orderedUrls;
    return this.productRepo.save(product);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepo.remove(product);
  }

  // ---- Export CSV ----
  async exportToCsv(): Promise<string> {
    const products = await this.productRepo.find({
      relations: { category: true },
      order: { name: 'ASC' },
    });
    const header = [
      'SKU',
      'Nom',
      'Marque',
      'Catégorie',
      'Prix détail (TND)',
      'Prix gros (TND)',
      'Stock',
    ].join(',');

    const rows = products.map((p) =>
      [
        p.sku,
        `"${p.name}"`,
        p.brand ?? '',
        p.category?.name ?? '',
        Number(p.retail_price).toFixed(2),
        p.wholesale_price ? Number(p.wholesale_price).toFixed(2) : '',
        p.stock_quantity,
      ].join(','),
    );

    return [header, ...rows].join('\n');
  }
}
