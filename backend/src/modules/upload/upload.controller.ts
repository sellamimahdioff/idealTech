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
import { memoryStorage } from 'multer';
import cloudinary from '../../config/cloudinary.config.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 Mo

const multerMemoryConfig = {
  storage: memoryStorage(),
  fileFilter: (_req: any, file: any, callback: any) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return callback(
        new BadRequestException(
          'Format non autorisé. Utilisez JPEG, PNG ou WebP.',
        ),
        false,
      );
    }
    callback(null, true);
  },
  limits: { fileSize: MAX_FILE_SIZE },
};

function uploadBufferToCloudinary(
  buffer: Buffer,
  folder: string,
): Promise<{ secure_url: string; public_id: string }> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        quality: 'auto',
        fetch_format: 'auto',
        transformation: [{ width: 1600, crop: 'limit' }],
      },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve(result as { secure_url: string; public_id: string });
      },
    );
    stream.end(buffer);
  });
}

@Controller('upload')
export class UploadController {
  @Post('image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', multerMemoryConfig))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Aucun fichier reçu.');
    }
    const result = await uploadBufferToCloudinary(
      file.buffer,
      'ideal-tech/categories',
    );
    return {
      url: result.secure_url,
      publicId: result.public_id,
      originalName: file.originalname,
      size: file.size,
    };
  }

  @Post('images')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('files', 6, multerMemoryConfig))
  async uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files?.length) {
      throw new BadRequestException('Aucun fichier reçu.');
    }
    const results = await Promise.all(
      files.map((file) =>
        uploadBufferToCloudinary(file.buffer, 'ideal-tech/products'),
      ),
    );
    return results.map((r, i) => ({
      url: r.secure_url,
      publicId: r.public_id,
      originalName: files[i].originalname,
      size: files[i].size,
    }));
  }
}