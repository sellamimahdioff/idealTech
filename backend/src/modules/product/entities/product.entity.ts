import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from '../../category/entities/category.entity.js';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  sku: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  brand: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  retail_price: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  wholesale_price: number;

  @Column({ type: 'int', nullable: true, default: 10 })
  wholesale_min_qty: number;

  @Column({ type: 'int', default: 0 })
  stock_quantity: number;

  @ManyToOne(() => Category, { onDelete: 'SET NULL', nullable: true })
  category: Category | null;

  @Column('jsonb', { default: () => "'[]'" })
  images: string[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
