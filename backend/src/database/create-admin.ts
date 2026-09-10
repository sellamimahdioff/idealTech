// Exécution : npm run seed:admin -- admin@idealtech.tn monMotDePasse123
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module.js';
import { AuthService } from '../modules/auth/auth.service.js';

async function run() {
  const [, , email, password] = process.argv;
  if (!email || !password) {
    console.error(
      'Usage: npm run seed:admin -- admin@idealtech.tn monMotDePasse123',
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