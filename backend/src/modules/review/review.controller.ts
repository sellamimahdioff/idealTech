import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from './review.service.js';
import { CreateReviewDto } from './dto/create-review.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller()
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  // ---- Public ----
  @Post('products/:productId/reviews')
  create(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() dto: CreateReviewDto,
  ) {
    return this.reviewService.create(productId, dto);
  }

  @Get('products/:productId/reviews')
  findByProduct(@Param('productId', ParseIntPipe) productId: number) {
    return this.reviewService.findApprovedByProduct(productId);
  }

  @Get('products/:productId/reviews/summary')
  getSummary(@Param('productId', ParseIntPipe) productId: number) {
    return this.reviewService.getAverageRating(productId);
  }

  // ---- Admin (modération) ----
  @Get('reviews')
  @UseGuards(JwtAuthGuard)
  findAllForAdmin() {
    return this.reviewService.findAllForAdmin();
  }

  @Patch('reviews/:id/approve')
  @UseGuards(JwtAuthGuard)
  approve(@Param('id', ParseIntPipe) id: number) {
    return this.reviewService.approve(id);
  }

  @Delete('reviews/:id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.reviewService.remove(id);
  }
}
