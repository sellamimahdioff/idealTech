import { Link } from 'react-router-dom';
import type { Product } from '../../services/types.js';
import { formatPrice } from '../../utils/formatPrice.js';
import { useCartStore } from '../../store/cartStore.js';

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col relative">
      {product.wholesale_price && (
        <span className="absolute top-2.5 left-2.5 z-10 bg-[#5FA8D3] text-white text-[10.5px] font-bold px-2 py-1 rounded-full">
          Prix gros dispo
        </span>
      )}

      <Link to={`/produit/${product.id}`}>
        <div className="h-36 bg-gradient-to-br from-[#EAF3FA] to-gray-100 flex items-center justify-center text-xs text-[#A6A6A6]">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            'Photo produit'
          )}
        </div>
      </Link>
      <div className="p-4 flex flex-col flex-1">
        {product.brand && (
          <div className="text-[10.5px] font-semibold text-[#5FA8D3] uppercase tracking-wide mb-1">
            {product.brand}
          </div>
        )}
        <div className="text-[11px] text-[#A6A6A6] mb-1">
          REF. {product.sku}
        </div>
        <Link
          to={`/produit/${product.id}`}
          className="text-sm font-semibold text-[#2E2E2E] mb-2.5 leading-snug flex-1"
        >
          {product.name}
        </Link>
        <div className="flex justify-between items-baseline mb-3">
          <span className="text-lg font-extrabold text-[#1B3A57] font-heading">
            {formatPrice(product.retail_price)}
          </span>
        </div>
        <button
          onClick={() => addItem(product, 1)}
          disabled={product.stock_quantity <= 0}
          className="w-full bg-[#1B3A57] text-white py-2.5 rounded-lg font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {product.stock_quantity > 0 ? 'Ajouter au panier' : 'Rupture de stock'}
        </button>
      </div>
    </div>
  );
}
