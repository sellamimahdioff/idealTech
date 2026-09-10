import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity.js';
import { Product } from '../product/entities/product.entity.js';
import { CreateReviewDto } from './dto/create-review.dto.js';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepo: Repository<Review>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  // Public : soumet un avis, non publié tant qu'un admin ne l'approuve pas
  async create(productId: number, dto: CreateReviewDto): Promise<Review> {
    const product = await this.productRepo.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException(`Produit #${productId} introuvable.`);
    }

    const review = this.reviewRepo.create({
      product,
      author_name: dto.author_name,
      author_email: dto.author_email,
      rating: dto.rating,
      comment: dto.comment,
      approved: false,
    });
    return this.reviewRepo.save(review);
  }

  // Public : uniquement les avis approuvés pour un produit donné
  async findApprovedByProduct(productId: number): Promise<Review[]> {
    return this.reviewRepo.find({
      where: { product: { id: productId }, approved: true },
      order: { created_at: 'DESC' },
    });
  }

  async getAverageRating(
    productId: number,
  ): Promise<{ average: number; count: number }> {
    const reviews = await this.findApprovedByProduct(productId);
    if (!reviews.length) return { average: 0, count: 0 };
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return { average: Math.round((sum / reviews.length) * 10) / 10, count: reviews.length };
  }

  // Admin : tous les avis, y compris non approuvés (pour modération)
  async findAllForAdmin(): Promise<Review[]> {
    return this.reviewRepo.find({
      relations: { product: true },
      order: { created_at: 'DESC' },
    });
  }

  async approve(id: number): Promise<Review> {
    const review = await this.reviewRepo.findOne({ where: { id } });
    if (!review) throw new NotFoundException(`Avis #${id} introuvable.`);
    review.approved = true;
    return this.reviewRepo.save(review);
  }

  async remove(id: number): Promise<void> {
    const review = await this.reviewRepo.findOne({ where: { id } });
    if (!review) throw new NotFoundException(`Avis #${id} introuvable.`);
    await this.reviewRepo.remove(review);
  }
}
