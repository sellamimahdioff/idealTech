import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Admin } from './entities/admin.entity.js';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepo: Repository<Admin>,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const admin = await this.adminRepo.findOne({
      where: { email: dto.email },
    });
    if (!admin) {
      throw new UnauthorizedException('Identifiants invalides.');
    }

    const passwordMatches = await bcrypt.compare(
      dto.password,
      admin.password_hash,
    );
    if (!passwordMatches) {
      throw new UnauthorizedException('Identifiants invalides.');
    }

    const payload = { sub: admin.id, email: admin.email, role: admin.role };
    return {
      access_token: this.jwtService.sign(payload),
      admin: { id: admin.id, email: admin.email, role: admin.role },
    };
  }

  // Utilisé par un script de seed pour créer le premier compte admin
  async createAdmin(email: string, password: string): Promise<Admin> {
    const password_hash = await bcrypt.hash(password, 10);
    const admin = this.adminRepo.create({ email, password_hash });
    return this.adminRepo.save(admin);
  }
}
