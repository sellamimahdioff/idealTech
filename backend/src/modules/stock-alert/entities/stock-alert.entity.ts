import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Product } from '../../product/entities/product.entity.js';

@Entity('stock_alerts')
export class StockAlert {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  product: Product;

  @Column()
  email: string;

  @CreateDateColumn()
  created_at: Date;
}
