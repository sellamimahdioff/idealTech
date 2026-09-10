import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { CategoryModule } from './modules/category/category.module.js';
import { ProductModule } from './modules/product/product.module.js';
import { OrderModule } from './modules/order/order.module.js';
import { InvoiceModule } from './modules/invoice/invoice.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { MailModule } from './modules/mail/mail.module.js';
import { UploadModule } from './modules/upload/upload.module.js';
import { ReviewModule } from './modules/review/review.module.js';
import { StockAlertModule } from './modules/stock-alert/stock-alert.module.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: false,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
}),
    CategoryModule,
    ProductModule,
    OrderModule,
    InvoiceModule,
    AuthModule,
    MailModule,
    UploadModule,
    ReviewModule,
    StockAlertModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  
})
export class AppModule {}
