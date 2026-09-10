import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { Invoice } from './entities/invoice.entity.js';
import { Order } from '../order/entities/order.entity.js';
import { InvoiceService } from './invoice.service.js';
import { InvoiceController } from './invoice.controller.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Invoice, Order]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [InvoiceController],
  providers: [InvoiceService],
  exports: [InvoiceService],
})
export class InvoiceModule {}