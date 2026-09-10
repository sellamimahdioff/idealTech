import { useState } from 'react';
import { orderService } from '../../services/orderService.js';
import { Field } from '../../components/ui/Field.js';
import { Button } from '../../components/ui/Button.js';
import { StatusBadge } from '../../components/ui/StatusBadge.js';
import { formatPrice } from '../../utils/formatPrice.js';
import type { Order } from '../../services/types.js';

export function OrderTracking() {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await orderService.track(orderNumber, email);
      setOrder(result);
    } catch {
      setError('Aucune commande trouvée avec ces informations.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-[#1B3A57] mb-8 font-heading">
        Suivre ma commande
      </h1>

      <form
        onSubmit={handleSearch}
        className="bg-white border border-gray-200 rounded-xl p-6 space-y-4 mb-6"
      >
        <Field
          label="Numéro de commande"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          placeholder="CMD-2026-00123"
          required
        />
        <Field
          label="Email utilisé lors de la commande"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {error && <p className="text-sm text-[#E0212B]">{error}</p>}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Recherche...' : 'Rechercher'}
        </Button>
      </form>

      {order && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold text-[#1B3A57]">
              {order.order_number}
            </span>
            <StatusBadge status={order.status} />
          </div>
          <div className="space-y-2 mb-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>
                  {item.product.name} × {item.quantity}
                </span>
                <span>{formatPrice(item.subtotal)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between pt-3 border-t border-gray-100 font-semibold text-[#1B3A57]">
            <span>Total</span>
            <span>{formatPrice(order.total_amount)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
