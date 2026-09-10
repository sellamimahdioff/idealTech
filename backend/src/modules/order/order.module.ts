import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import {
  Order,
  OrderItem,
  OrderStatusHistory,
} from './entities/order.entity.js';
import { Product } from '../product/entities/product.entity.js';
import { OrderService } from './order.service.js';
import { OrderController } from './order.controller.js';
import { MailModule } from '../mail/mail.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, OrderStatusHistory, Product]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MailModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
