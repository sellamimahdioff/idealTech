import { Link } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore.js';
import { formatPrice } from '../../utils/formatPrice.js';

export function Cart() {
  const { items, updateQuantity, removeItem, totalAmount } = useCartStore();

  if (!items.length) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        <p className="text-[#2E2E2E] mb-5">Votre panier est vide.</p>
        <Link
          to="/catalogue"
          className="bg-[#1B3A57] text-white px-6 py-3 rounded-lg font-semibold text-sm"
        >
          Voir le catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-[#1B3A57] mb-8 font-heading">
        Mon panier
      </h1>

      <div className="space-y-4 mb-8">
        {items.map(({ product, quantity }) => (
          <div
            key={product.id}
            className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
              {product.images?.[0] && (
                <img
                  src={product.images[0]}
                  alt=""
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-[#2E2E2E]">
                {product.name}
              </div>
              <div className="text-xs text-[#A6A6A6]">REF. {product.sku}</div>
            </div>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) =>
                updateQuantity(product.id, Number(e.target.value))
              }
              className="w-16 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-center"
            />
            <div className="w-24 text-right text-sm font-semibold text-[#1B3A57]">
              {formatPrice(product.retail_price * quantity)}
            </div>
            <button
              onClick={() => removeItem(product.id)}
              className="text-[#E0212B] text-xs font-semibold"
            >
              Retirer
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center bg-[#EAF3FA] rounded-xl p-5">
        <span className="font-semibold text-[#1B3A57]">Total</span>
        <span className="text-xl font-extrabold text-[#1B3A57] font-heading">
          {formatPrice(totalAmount())}
        </span>
      </div>

      <div className="flex justify-end mt-6">
        <Link
          to="/commande"
          className="bg-[#E0212B] text-white px-8 py-3.5 rounded-lg font-semibold text-sm"
        >
          Passer la commande
        </Link>
      </div>
    </div>
  );
}
