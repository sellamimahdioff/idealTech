import type { Product } from '../../services/types.js';
import { ProductCard } from './ProductCard.js';

export function ProductGrid({ products }: { products: Product[] }) {
  if (!products.length) {
    return (
      <p className="text-sm text-[#A6A6A6] py-10 text-center">
        Aucun produit trouvé.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
