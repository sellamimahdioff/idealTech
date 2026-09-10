import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import {
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { multerConfig } from './multer.config.js';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('upload')
export class UploadController {
  // Upload d'une seule image (ex: image de catégorie)
  @Post('image')
  // @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', multerConfig))
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Aucun fichier reçu.');
    }
    return {
      url: `/uploads/${file.filename}`,
      originalName: file.originalname,
      size: file.size,
    };
  }

  // Upload de plusieurs images (ex: galerie produit), max 6 fichiers
  @Post('images')
  // @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('files', 6, multerConfig))
  uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files?.length) {
      throw new BadRequestException('Aucun fichier reçu.');
    }
    return files.map((file) => ({
      url: `/uploads/${file.filename}`,
      originalName: file.originalname,
      size: file.size,
    }));
  }
}
