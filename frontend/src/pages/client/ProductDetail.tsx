import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { productService } from '../../services/productService.js';
import type { Product } from '../../services/types.js';
import { formatPrice } from '../../utils/formatPrice.js';
import { useCartStore } from '../../store/cartStore.js';

export function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    if (id) productService.getOne(Number(id)).then(setProduct);
  }, [id]);

  if (!product) {
    return <p className="max-w-7xl mx-auto px-6 py-10 text-sm">Chargement...</p>;
  }

  const isWholesale =
    product.wholesale_price &&
    product.wholesale_min_qty &&
    quantity >= product.wholesale_min_qty;
  const unitPrice = isWholesale
    ? product.wholesale_price!
    : product.retail_price;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-12">
      <div>
        <div className="h-80 bg-gray-100 rounded-xl flex items-center justify-center mb-3 overflow-hidden">
          {product.images?.[activeImage] ? (
            <img
              src={product.images[activeImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-sm text-[#A6A6A6]">Pas d'image</span>
          )}
        </div>
        {product.images?.length > 1 && (
          <div className="flex gap-2">
            {product.images.map((img, i) => (
              <button
                key={img}
                onClick={() => setActiveImage(i)}
                className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                  i === activeImage ? 'border-[#5FA8D3]' : 'border-transparent'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="text-xs text-[#A6A6A6] mb-2">REF. {product.sku}</div>
        <h1 className="text-2xl font-bold text-[#2E2E2E] mb-4 font-heading">
          {product.name}
        </h1>

        <div className="text-3xl font-extrabold text-[#1B3A57] mb-1 font-heading">
          {formatPrice(unitPrice)}
        </div>
        {isWholesale && (
          <div className="text-xs text-[#5FA8D3] font-semibold mb-4">
            Tarif gros appliqué (à partir de {product.wholesale_min_qty} unités)
          </div>
        )}

        <p className="text-sm text-[#2E2E2E] leading-relaxed my-5">
          {product.description}
        </p>

        <div
          className={`text-xs font-semibold mb-5 ${
            product.stock_quantity > 0 ? 'text-green-700' : 'text-[#E0212B]'
          }`}
        >
          {product.stock_quantity > 0
            ? `En stock (${product.stock_quantity} disponibles)`
            : 'Rupture de stock'}
        </div>

        <div className="flex items-center gap-3 mb-5">
          <label className="text-sm font-medium">Quantité</label>
          <input
            type="number"
            min={1}
            max={product.stock_quantity}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
            className="w-20 border border-gray-200 rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <button
          onClick={() => addItem(product, quantity)}
          disabled={product.stock_quantity <= 0}
          className="bg-[#E0212B] text-white px-6 py-3 rounded-lg font-semibold text-sm disabled:opacity-40"
        >
          Ajouter au panier
        </button>

        {product.wholesale_price && (
          <div className="mt-8 bg-[#EAF3FA] rounded-xl p-5">
            <div className="text-xs font-semibold text-[#1B3A57] mb-3">
              Tarifs par quantité
            </div>
            <div className="flex justify-between text-sm py-1.5 border-b border-white">
              <span className="text-[#2E2E2E]">
                1 – {product.wholesale_min_qty! - 1} unités
              </span>
              <span className="font-semibold">
                {formatPrice(product.retail_price)}
              </span>
            </div>
            <div className="flex justify-between text-sm py-1.5">
              <span className="text-[#2E2E2E]">
                {product.wholesale_min_qty}+ unités
              </span>
              <span className="font-semibold text-[#5FA8D3]">
                {formatPrice(product.wholesale_price)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
