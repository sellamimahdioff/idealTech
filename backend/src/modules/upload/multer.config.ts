import { diskStorage } from 'multer';
import { extname } from 'path';
import { BadRequestException } from '@nestjs/common';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 Mo

export const multerConfig = {
  storage: diskStorage({
    destination: './uploads',
    filename: (_req: any, file: any, callback: any) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const ext = extname(file.originalname);
      callback(null, `${uniqueSuffix}${ext}`);
    },
  }),
  fileFilter: (
    _req: any,
    file: any,
    callback: (error: Error | null, acceptFile: boolean) => void,
  ) => {
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