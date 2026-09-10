import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { Review } from './entities/review.entity.js';
import { Product } from '../product/entities/product.entity.js';
import { ReviewService } from './review.service.js';
import { ReviewController } from './review.controller.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Review, Product]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
