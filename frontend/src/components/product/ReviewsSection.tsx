import { useEffect, useState } from 'react';
import { reviewService } from '../../services/reviewService.js';
import type { Review } from '../../services/types.js';

function Stars({ rating, size = 'text-base' }: { rating: number; size?: string }) {
  return (
    <span className={`text-[#E0212B] ${size}`}>
      {'★'.repeat(Math.round(rating))}
      <span className="text-gray-300">{'★'.repeat(5 - Math.round(rating))}</span>
    </span>
  );
}

export function ReviewsSection({ productId }: { productId: number }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState({ average: 0, count: 0 });
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    author_name: '',
    author_email: '',
    rating: 5,
    comment: '',
  });

  const load = () => {
    reviewService.getByProduct(productId).then(setReviews);
    reviewService.getSummary(productId).then(setSummary);
  };

  useEffect(() => {
    load();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await reviewService.create(productId, form);
      setSubmitted(true);
      setShowForm(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-[#1B3A57] font-heading mb-1">
            Avis clients
          </h2>
          {summary.count > 0 ? (
            <div className="flex items-center gap-2">
              <Stars rating={summary.average} />
              <span className="text-sm text-[#A6A6A6]">
                {summary.average}/5 · {summary.count} avis
              </span>
            </div>
          ) : (
            <span className="text-sm text-[#A6A6A6]">Aucun avis pour le moment</span>
          )}
        </div>
        {!showForm && !submitted && (
          <button
            onClick={() => setShowForm(true)}
            className="border border-[#1B3A57] text-[#1B3A57] px-4 py-2 rounded-lg text-sm font-semibold"
          >
            Laisser un avis
          </button>
        )}
      </div>

      {submitted && (
        <div className="bg-[#EAF3FA] text-[#1B3A57] text-sm rounded-lg px-4 py-3 mb-5">
          Merci ! Votre avis sera visible après validation par notre équipe.
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-xl p-5 mb-6 space-y-3"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              required
              placeholder="Votre nom"
              value={form.author_name}
              onChange={(e) =>
                setForm((f) => ({ ...f, author_name: e.target.value }))
              }
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#5FA8D3]"
            />
            <input
              required
              type="email"
              placeholder="Votre email"
              value={form.author_email}
              onChange={(e) =>
                setForm((f) => ({ ...f, author_email: e.target.value }))
              }
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#5FA8D3]"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-[#2E2E2E]">Note :</span>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                type="button"
                key={n}
                onClick={() => setForm((f) => ({ ...f, rating: n }))}
                className={`text-lg ${n <= form.rating ? 'text-[#E0212B]' : 'text-gray-300'}`}
              >
                ★
              </button>
            ))}
          </div>

          <textarea
            required
            rows={3}
            placeholder="Votre avis..."
            value={form.comment}
            onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#5FA8D3]"
          />

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="bg-[#E0212B] text-white px-5 py-2 rounded-lg text-sm font-semibold"
            >
              {submitting ? 'Envoi...' : 'Envoyer'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-sm text-[#A6A6A6]"
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {reviews.map((r) => (
          <div key={r.id} className="border-b border-gray-100 pb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold text-[#2E2E2E]">
                {r.author_name}
              </span>
              <Stars rating={r.rating} size="text-sm" />
            </div>
            <p className="text-sm text-[#2E2E2E] leading-relaxed">{r.comment}</p>
            <span className="text-xs text-[#A6A6A6]">
              {new Date(r.created_at).toLocaleDateString('fr-FR')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
