import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Category } from './entities/category.entity.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async create(dto: CreateCategoryDto): Promise<Category> {
    const existing = await this.categoryRepo.findOne({
      where: { slug: dto.slug },
    });
    if (existing) {
      throw new ConflictException('Ce slug est déjà utilisé.');
    }

    const category = this.categoryRepo.create({
      name: dto.name,
      slug: dto.slug,
      image_url: dto.image_url,
    });

    if (dto.parentId) {
      const parent = await this.categoryRepo.findOne({
        where: { id: dto.parentId },
      });
      if (!parent) {
        throw new NotFoundException('Catégorie parente introuvable.');
      }
      category.parent = parent;
    }

    return this.categoryRepo.save(category);
  }

  // Retourne uniquement les catégories racines, avec leurs sous-catégories sur 2 niveaux
  async findAllTree(): Promise<Category[]> {
    return this.categoryRepo.find({
      where: { parent: IsNull() },
      relations: { children: { children: true } },
      order: { name: 'ASC' },
    });
  }

  async findAllFlat(): Promise<Category[]> {
    return this.categoryRepo.find({
// dans findAllFlat()
relations: { parent: true },      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepo.findOne({
      where: { id },
      // dans findOne()
relations: { parent: true, children: true },
    });
    if (!category) {
      throw new NotFoundException(`Catégorie #${id} introuvable.`);
    }
    return category;
  }

  async update(id: number, dto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);

    if (dto.slug && dto.slug !== category.slug) {
      const existing = await this.categoryRepo.findOne({
        where: { slug: dto.slug },
      });
      if (existing) {
        throw new ConflictException('Ce slug est déjà utilisé.');
      }
    }

    if (dto.parentId !== undefined) {
      if (dto.parentId === id) {
        throw new ConflictException(
          'Une catégorie ne peut pas être sa propre catégorie parente.',
        );
      }
      const parent = dto.parentId
        ? await this.categoryRepo.findOne({ where: { id: dto.parentId } })
        : null;
      if (dto.parentId && !parent) {
        throw new NotFoundException('Catégorie parente introuvable.');
      }
      category.parent = parent;
    }

    Object.assign(category, {
      name: dto.name ?? category.name,
      slug: dto.slug ?? category.slug,
      image_url: dto.image_url ?? category.image_url,
    });

    return this.categoryRepo.save(category);
  }

  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);
    if (category.children?.length) {
      throw new ConflictException(
        'Impossible de supprimer une catégorie qui a des sous-catégories. Supprimez-les ou déplacez-les avant.',
      );
    }
    await this.categoryRepo.remove(category);
  }
}
