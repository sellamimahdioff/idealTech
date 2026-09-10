import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockAlert } from './entities/stock-alert.entity.js';
import { Product } from '../product/entities/product.entity.js';
import { MailService } from '../mail/mail.service.js';

@Injectable()
export class StockAlertService {
  constructor(
    @InjectRepository(StockAlert)
    private readonly alertRepo: Repository<StockAlert>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private readonly mailService: MailService,
  ) {}

  // Client demande à être prévenu quand le produit revient en stock
  async subscribe(productId: number, email: string): Promise<StockAlert> {
    const product = await this.productRepo.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException(`Produit #${productId} introuvable.`);
    }

    const existing = await this.alertRepo.findOne({
      where: { product: { id: productId }, email },
    });
    if (existing) {
      throw new ConflictException(
        'Vous êtes déjà inscrit pour être averti sur ce produit.',
      );
    }

    const alert = this.alertRepo.create({ product, email });
    return this.alertRepo.save(alert);
  }

  // Appelé automatiquement quand le stock d'un produit repasse de 0 à positif
  async notifyAndClear(productId: number): Promise<void> {
    const alerts = await this.alertRepo.find({
      where: { product: { id: productId } },
      relations: { product: true },
    });
    if (!alerts.length) return;

    for (const alert of alerts) {
      this.mailService
        .sendStockAlert(alert.email, alert.product)
        .catch((err) =>
          console.error('Erreur envoi alerte stock:', err.message),
        );
    }

    await this.alertRepo.remove(alerts);
  }
}
