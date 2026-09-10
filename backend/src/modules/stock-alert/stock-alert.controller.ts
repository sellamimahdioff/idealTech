import { Controller, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { IsEmail } from 'class-validator';
import { StockAlertService } from './stock-alert.service.js';

class SubscribeDto {
  @IsEmail()
  email: string;
}

@Controller('products')
export class StockAlertController {
  constructor(private readonly stockAlertService: StockAlertService) {}

  @Post(':id/notify-me')
  subscribe(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: SubscribeDto,
  ) {
    return this.stockAlertService.subscribe(id, dto.email);
  }
}
