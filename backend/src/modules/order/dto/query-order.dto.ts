import { IsOptional, IsEnum } from 'class-validator';
import { OrderType, OrderStatus } from '../entities/order.entity.js';

export class QueryOrderDto {
  @IsOptional()
  @IsEnum(OrderType)
  type?: OrderType;

  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}
