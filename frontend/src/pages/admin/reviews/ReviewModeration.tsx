import { useEffect, useState } from 'react';
import { reviewService } from '../../../services/ReviewService.js';
import type { Review } from '../../../services/types.js';

export function ReviewModeration() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Utilisée par les actions (approuver/supprimer) après le montage initial —
  // ici l'appel setState synchrone est dans un event handler, pas dans un effet, donc OK.
  const reload = () => {
    setLoading(true);
    reviewService.getAllForAdmin().then((data) => {
      setReviews(data);
      setLoading(false);
    });
  };

  // Chargement initial : on ne passe pas par reload() pour éviter l'appel
  // setState synchrone directement dans le corps de l'effet.
  useEffect(() => {
    reviewService.getAllForAdmin().then((data) => {
      setReviews(data);
      setLoading(false);
    });
  }, []);

  const handleApprove = async (id: number) => {
    await reviewService.approve(id);
    reload();
  };

  const handleRemove = async (id: number) => {
    if (!confirm('Supprimer cet avis ?')) return;
    await reviewService.remove(id);
    reload();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1B3A57] mb-8 font-heading">
        Modération des avis
      </h1>

      {loading ? (
        <p className="text-sm text-[#A6A6A6]">Chargement...</p>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-[#A6A6A6]">Aucun avis pour le moment.</p>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="bg-white border border-gray-200 rounded-xl p-5"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="text-sm font-semibold text-[#2E2E2E]">
                    {r.author_name}{' '}
                    <span className="text-[#E0212B]">
                      {'★'.repeat(r.rating)}
                      <span className="text-gray-300">
                        {'★'.repeat(5 - r.rating)}
                      </span>
                    </span>
                  </div>
                  <div className="text-xs text-[#A6A6A6]">
                    {r.product?.name} · {r.author_email}
                  </div>
                </div>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    r.approved
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {r.approved ? 'Publié' : 'En attente'}
                </span>
              </div>
              <p className="text-sm text-[#2E2E2E] mb-3">{r.comment}</p>
              <div className="flex gap-3">
                {!r.approved && (
                  <button
                    onClick={() => handleApprove(r.id)}
                    className="text-xs font-semibold text-[#5FA8D3]"
                  >
                    Approuver
                  </button>
                )}
                <button
                  onClick={() => handleRemove(r.id)}
                  className="text-xs font-semibold text-[#E0212B]"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}