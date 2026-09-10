import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { OrderService } from './order.service.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto.js';
import { QueryOrderDto } from './dto/query-order.dto.js';
import { TrackOrderDto } from './dto/track-order.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() dto: CreateOrderDto) {
    return this.orderService.create(dto);
  }

  @Get('track')
  track(@Query() dto: TrackOrderDto) {
    return this.orderService.track(dto.orderNumber, dto.email);
  }

  @Get('export')
  @UseGuards(JwtAuthGuard)
  async exportCsv(@Res() res: Response) {
    const csv = await this.orderService.exportToCsv();
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="commandes-${Date.now()}.csv"`,
    );
    res.send('\uFEFF' + csv); // BOM pour un affichage correct des accents dans Excel
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query() query: QueryOrderDto) {
    return this.orderService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.findOne(id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.orderService.updateStatus(id, dto.status);
  }

  @Patch(':id/convert')
  @UseGuards(JwtAuthGuard)
  convertToOrder(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.convertQuoteToOrder(id);
  }
}
