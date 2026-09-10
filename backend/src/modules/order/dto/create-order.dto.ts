import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  IsArray,
  ValidateNested,
  IsInt,
  Min,
  MinLength,
  ArrayMinSize,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderType } from '../entities/order.entity.js';

class OrderItemInputDto {
  @IsInt()
  productId: number;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @IsEnum(OrderType)
  type: OrderType;

  @IsString()
  @MinLength(2)
  customer_name: string;

  @IsEmail()
  customer_email: string;

  @IsString()
  @MinLength(6)
  customer_phone: string;

  @IsOptional()
  @IsString()
  customer_company?: string;

  @IsOptional()
  @IsString()
  customer_country?: string;

  @IsOptional()
  @IsString()
  customer_region?: string;

  @IsOptional()
  @IsString()
  shipping_address?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemInputDto)
  @ValidateIf((o) => o.type === OrderType.ORDER)
  @ArrayMinSize(1)
  items: OrderItemInputDto[];
}
