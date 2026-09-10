import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockAlert } from './entities/stock-alert.entity.js';
import { Product } from '../product/entities/product.entity.js';
import { StockAlertService } from './stock-alert.service.js';
import { StockAlertController } from './stock-alert.controller.js';
import { MailModule } from '../mail/mail.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([StockAlert, Product]), MailModule],
  controllers: [StockAlertController],
  providers: [StockAlertService],
  exports: [StockAlertService],
})
export class StockAlertModule {}
