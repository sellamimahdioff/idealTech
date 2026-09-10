import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Order } from '../../order/entities/order.entity.js';

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  invoice_number: string;

  @ManyToOne(() => Order, { eager: true, onDelete: 'CASCADE' })
  order: Order;

  @Column()
  pdf_url: string;

  @Column('decimal', { precision: 10, scale: 2 })
  total_amount: number;

  @CreateDateColumn()
  issued_at: Date;
}
