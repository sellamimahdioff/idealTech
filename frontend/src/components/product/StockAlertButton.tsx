import { useState } from 'react';
import { productService } from '../../services/productService.js';

export function StockAlertButton({ productId }: { productId: number }) {
  const [email, setEmail] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await productService.subscribeStockAlert(productId, email);
      setDone(true);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ?? "Impossible de vous inscrire, réessayez.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="bg-[#EAF3FA] text-[#1B3A57] text-sm rounded-lg px-4 py-3">
        Vous serez averti par email dès que ce produit sera de nouveau disponible.
      </div>
    );
  }

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="border border-[#1B3A57] text-[#1B3A57] px-6 py-3 rounded-lg font-semibold text-sm"
      >
        M'avertir quand disponible
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="email"
        required
        placeholder="Votre email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#5FA8D3] flex-1"
      />
      <button
        type="submit"
        disabled={submitting}
        className="bg-[#1B3A57] text-white px-5 py-2.5 rounded-lg font-semibold text-sm whitespace-nowrap"
      >
        {submitting ? '...' : "M'avertir"}
      </button>
      {error && <p className="text-xs text-[#E0212B] mt-1">{error}</p>}
    </form>
  );
}
