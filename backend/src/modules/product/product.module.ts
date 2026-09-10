import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { Product } from './entities/product.entity.js';
import { Category } from '../category/entities/category.entity.js';
import { ProductService } from './product.service.js';
import { ProductController } from './product.controller.js';
import { StockAlertModule } from '../stock-alert/stock-alert.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    StockAlertModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
