import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Product } from '../../product/entities/product.entity.js';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  product: Product;

  @Column()
  author_name: string;

  @Column()
  author_email: string;

  @Column('int')
  rating: number; // 1 à 5

  @Column('text')
  comment: string;

  @Column({ default: false })
  approved: boolean;

  @CreateDateColumn()
  created_at: Date;
}
