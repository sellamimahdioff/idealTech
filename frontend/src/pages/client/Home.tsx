import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { productService } from '../../services/productService.js';
import { categoryService } from '../../services/categoryService.js';
import { ProductGrid } from '../../components/product/ProductGrid.js';
import type { Product, Category } from '../../services/types.js';

export function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    productService.getAll({ limit: 8 }).then((res) => setProducts(res.items));
    categoryService.getTree().then(setCategories);
  }, []);

  return (
    <div>
      <section className="bg-[#1B3A57] text-white">
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-[#5FA8D3] font-semibold text-sm mb-3">
              Grossiste & détaillant en matériel informatique
            </div>
            <h1 className="text-4xl font-bold leading-tight mb-5 max-w-[9ch] font-heading">
              Le choix <span className="text-[#5FA8D3]">idéal</span> pour
              votre informatique
            </h1>
            <p className="text-[#C9D6E2] max-w-md mb-7 leading-relaxed">
              Des composants aux postes complets, pour les particuliers comme
              pour les professionnels. Commandez sans créer de compte, ou
              demandez un devis pour vos achats en volume.
            </p>
            <div className="flex gap-3.5">
              <Link
                to="/catalogue"
                className="bg-[#E0212B] px-6 py-3.5 rounded-lg font-semibold text-sm"
              >
                Voir le catalogue
              </Link>
              <Link
                to="/devis"
                className="border border-white/40 px-6 py-3.5 rounded-lg font-semibold text-sm"
              >
                Demander un devis pro
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-2xl font-bold text-[#1B3A57] font-heading">
            Nos catégories
          </h2>
          <Link to="/catalogue" className="text-[#5FA8D3] text-sm font-semibold">
            Voir tout le catalogue →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/catalogue?categoryId=${cat.id}`}
              className="bg-white border border-gray-200 rounded-xl p-5 hover:border-[#5FA8D3]"
            >
              <h3 className="text-sm font-semibold text-[#2E2E2E]">
                {cat.name}
              </h3>
              {cat.children && (
                <span className="text-xs text-[#A6A6A6]">
                  {cat.children.length} sous-catégories
                </span>
              )}
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-2xl font-bold text-[#1B3A57] font-heading">
            Produits populaires
          </h2>
          <Link to="/catalogue" className="text-[#5FA8D3] text-sm font-semibold">
            Voir plus →
          </Link>
        </div>
        <ProductGrid products={products} />
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="bg-[#EAF3FA] rounded-2xl p-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h3 className="text-xl font-bold text-[#1B3A57] mb-2 font-heading">
              Besoin d'un devis pour votre entreprise ?
            </h3>
            <p className="text-sm text-[#2E2E2E] max-w-md">
              Achats en volume, équipement de bureaux, projets réseau —
              obtenez un devis personnalisé sous 24h.
            </p>
          </div>
          <Link
            to="/devis"
            className="bg-[#E0212B] text-white px-6 py-3 rounded-lg font-semibold text-sm whitespace-nowrap"
          >
            Demander un devis
          </Link>
        </div>
      </section>
    </div>
  );
}
