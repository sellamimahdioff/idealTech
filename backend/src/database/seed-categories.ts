import 'dotenv/config';
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module.js';
import { CategoryService } from '../modules/category/category.service.js';

interface CategoryNode {
  name: string;
  slug: string;
  children?: CategoryNode[];
}

// Arborescence à 3 niveaux : Catégorie > Groupe > Sous-catégorie
const tree: CategoryNode[] = [
  {
    name: 'Informatique',
    slug: 'informatique',
    children: [
      {
        name: 'Ordinateurs',
        slug: 'ordinateurs',
        children: [
          { name: 'Ordinateurs portables', slug: 'ordinateurs-portables' },
          { name: 'PC de bureau', slug: 'pc-de-bureau' },
          { name: 'Workstations', slug: 'workstations' },
          { name: 'Mini PC', slug: 'mini-pc' },
        ],
      },
      {
        name: 'Composants',
        slug: 'composants',
        children: [
          { name: 'Processeurs', slug: 'processeurs' },
          { name: 'Cartes mères', slug: 'cartes-meres' },
          { name: 'Mémoire RAM', slug: 'memoire-ram' },
          { name: 'Cartes graphiques', slug: 'cartes-graphiques' },
          { name: 'Alimentations', slug: 'alimentations' },
          { name: 'Boîtiers', slug: 'boitiers' },
        ],
      },
    ],
  },
  {
    name: 'Réseau & Sécurité',
    slug: 'reseau-securite',
    children: [
      {
        name: 'Réseau',
        slug: 'reseau',
        children: [
          { name: 'Switchs', slug: 'switchs' },
          { name: 'Routeurs', slug: 'routeurs' },
          { name: 'Points d\'accès Wi-Fi', slug: 'points-acces-wifi' },
          { name: 'Câblage réseau', slug: 'cablage-reseau' },
        ],
      },
      {
        name: 'Sécurité',
        slug: 'securite',
        children: [
          { name: 'Caméras de surveillance', slug: 'cameras-surveillance' },
          { name: 'Enregistreurs NVR/DVR', slug: 'nvr-dvr' },
          { name: 'Contrôle d\'accès', slug: 'controle-acces' },
        ],
      },
    ],
  },
  {
    name: 'Impression',
    slug: 'impression',
    children: [
      {
        name: 'Imprimantes',
        slug: 'imprimantes',
        children: [
          { name: 'Imprimante à réservoir intégré', slug: 'imprimante-reservoir-integre' },
          { name: 'Imprimante et multifonction jet d\'encre', slug: 'imprimante-jet-encre' },
          { name: 'Imprimante et multifonction laser', slug: 'imprimante-laser' },
          { name: 'Imprimante professionnelle', slug: 'imprimante-professionnelle' },
          { name: 'Imprimante point de vente', slug: 'imprimante-point-de-vente' },
          { name: 'Accessoires imprimantes', slug: 'accessoires-imprimantes' },
        ],
      },
      {
        name: 'Photocopieurs',
        slug: 'photocopieurs',
        children: [
          { name: 'Photocopieurs A4 / A3', slug: 'photocopieurs-a4-a3' },
          { name: 'Accessoires photocopieurs', slug: 'accessoires-photocopieurs' },
        ],
      },
      {
        name: 'Consommables',
        slug: 'consommables',
        children: [
          { name: 'Cartouches originales', slug: 'cartouches-originales' },
          { name: 'Cartouches adaptables', slug: 'cartouches-adaptables' },
          { name: 'Papier A4 / A3', slug: 'papier-a4-a3' },
        ],
      },
    ],
  },
  {
    name: 'Stockage',
    slug: 'stockage',
    children: [
      {
        name: 'Disques',
        slug: 'disques',
        children: [
          { name: 'Disques durs (HDD)', slug: 'disques-durs-hdd' },
          { name: 'SSD', slug: 'ssd' },
          { name: 'Stockage réseau (NAS)', slug: 'nas' },
          { name: 'Clés USB', slug: 'cles-usb' },
        ],
      },
    ],
  },
  {
    name: 'Périphériques',
    slug: 'peripheriques',
    children: [
      {
        name: 'Accessoires bureau',
        slug: 'accessoires-bureau',
        children: [
          { name: 'Clavier & souris', slug: 'clavier-souris' },
          { name: 'Écrans', slug: 'ecrans' },
          { name: 'Webcams', slug: 'webcams' },
          { name: 'Casques & micros', slug: 'casques-micros' },
        ],
      },
    ],
  },
];

async function seedNode(
  categoryService: CategoryService,
  node: CategoryNode,
  parentId?: number,
) {
  const created = await categoryService.create({
    name: node.name,
    slug: node.slug,
    parentId,
  });
  console.log(`  ${'  '.repeat(parentId ? 1 : 0)}✓ ${node.name}`);

  if (node.children) {
    for (const child of node.children) {
      await seedNode(categoryService, child, created.id);
    }
  }
}

async function run() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const categoryService = app.get(CategoryService);

  console.log('Création de l\'arborescence de catégories...\n');

  for (const rootNode of tree) {
    console.log(`${rootNode.name}`);
    await seedNode(categoryService, rootNode);
  }

  console.log('\nTerminé.');
  await app.close();
}

run().catch((err) => {
  console.error('Erreur lors du seed :', err.message);
  process.exit(1);
});
