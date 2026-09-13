import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UploadController } from './upload.controller.js';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [UploadController],
})
export class UploadModule {}
