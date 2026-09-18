// Exécution : node dist/database/create-admin.js email password
import 'dotenv/config';
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module.js';
import { AuthService } from '../modules/auth/auth.service.js';

async function run() {
  const [, , email, password] = process.argv;
  if (!email || !password) {
    console.error(
      'Usage: node dist/database/create-admin.js email password',
    );
    process.exit(1);
  }

  const app = await NestFactory.createApplicationContext(AppModule);
  const authService = app.get(AuthService);
  const admin = await authService.createAdmin(email, password);
  console.log(`Compte admin créé : ${admin.email} (id: ${admin.id})`);
  await app.close();
}

run();