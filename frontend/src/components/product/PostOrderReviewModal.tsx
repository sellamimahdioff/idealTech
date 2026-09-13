import { useState } from 'react';
import { reviewService } from '../../services/ReviewService.js';
import type { Order } from '../../services/types.js';

export function PostOrderReviewModal({
  order,
  onClose,
}: {
  order: Order;
  onClose: () => void;
}) {
  const [selectedProductId, setSelectedProductId] = useState(
    order.items[0]?.product.id ?? 0,
  );
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async () => {
    if (!rating || !selectedProductId) return;
    setSubmitting(true);
    try {
      await reviewService.create(selectedProductId, {
        author_name: order.customer_name,
        author_email: order.customer_email,
        rating,
        comment: comment || 'Avis laissé après commande.',
      });
      setDone(true);
      setTimeout(onClose, 1800);
    } finally {
      setSubmitting(false);
    }
  };

  if (!order.items.length) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-[#A6A6A6] text-lg"
          aria-label="Fermer"
        >
          ✕
        </button>

        {done ? (
          <div className="text-center py-6">
            <div className="text-3xl mb-2">🎉</div>
            <p className="text-sm font-semibold text-[#1B3A57]">
              Merci pour votre avis !
            </p>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-bold text-[#1B3A57] font-heading mb-1 text-center">
              Comment s'est passée votre commande ?
            </h3>
            <p className="text-xs text-[#A6A6A6] text-center mb-5">
              Votre avis aide les autres clients à faire leur choix.
            </p>

            {order.items.length > 1 && (
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(Number(e.target.value))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-4 outline-none focus:border-[#5FA8D3]"
              >
                {order.items.map((item) => (
                  <option key={item.product.id} value={item.product.id}>
                    {item.product.name}
                  </option>
                ))}
              </select>
            )}
            {order.items.length === 1 && (
              <p className="text-sm text-center font-medium text-[#2E2E2E] mb-4">
                {order.items[0].product.name}
              </p>
            )}

            <div className="flex justify-center gap-1.5 mb-5">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => setRating(n)}
                  onMouseEnter={() => setHoverRating(n)}
                  onMouseLeave={() => setHoverRating(0)}
                  className={`text-3xl transition-colors ${
                    n <= (hoverRating || rating)
                      ? 'text-[#E0212B]'
                      : 'text-gray-200'
                  }`}
                  aria-label={`${n} étoiles`}
                >
                  ★
                </button>
              ))}
            </div>

            <textarea
              rows={2}
              placeholder="Un commentaire ? (optionnel)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-4 outline-none focus:border-[#5FA8D3]"
            />

            <div className="flex gap-2">
              <button
                onClick={handleSubmit}
                disabled={!rating || submitting}
                className="flex-1 bg-[#E0212B] text-white py-2.5 rounded-lg text-sm font-semibold disabled:opacity-40"
              >
                {submitting ? 'Envoi...' : 'Envoyer mon avis'}
              </button>
              <button
                onClick={onClose}
                className="px-4 text-sm text-[#A6A6A6]"
              >
                Plus tard
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
