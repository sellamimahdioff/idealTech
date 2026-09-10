import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { ProductService } from './product.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { QueryProductDto } from './dto/query-product.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // ---- Routes publiques ----
  @Get()
  findAll(@Query() query: QueryProductDto) {
    return this.productService.findAll(query);
  }

  @Get('brands')
  findBrands() {
    return this.productService.findDistinctBrands();
  }

  @Get('export')
  @UseGuards(JwtAuthGuard)
  async exportCsv(@Res() res: Response) {
    const csv = await this.productService.exportToCsv();
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="produits-${Date.now()}.csv"`,
    );
    res.send('\uFEFF' + csv);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }

  @Get(':id/related')
  findRelated(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findRelated(id);
  }

  // ---- Routes admin ----
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateProductDto) {
    return this.productService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productService.remove(id);
  }

  @Delete(':id/images')
  @UseGuards(JwtAuthGuard)
  removeImage(
    @Param('id', ParseIntPipe) id: number,
    @Body('imageUrl') imageUrl: string,
  ) {
    return this.productService.removeImage(id, imageUrl);
  }

  @Patch(':id/images/reorder')
  @UseGuards(JwtAuthGuard)
  reorderImages(
    @Param('id', ParseIntPipe) id: number,
    @Body('images') images: string[],
  ) {
    return this.productService.reorderImages(id, images);
  }
}
