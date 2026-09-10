import { useEffect, useState } from 'react';
import { productService } from '../../services/productService.js';
import type { Product } from '../../services/types.js';
import { ProductGrid } from './ProductGrid.js';

export function RelatedProducts({ productId }: { productId: number }) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    productService.getRelated(productId).then(setProducts).catch(() => {});
  }, [productId]);

  if (!products.length) return null;

  return (
    <div className="mt-12">
      <h2 className="text-lg font-bold text-[#1B3A57] font-heading mb-5">
        Vous pourriez aussi aimer
      </h2>
      <ProductGrid products={products} />
    </div>
  );
}
