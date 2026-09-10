import type { OrderStatus } from '../../services/types.js';

const statusConfig: Record<OrderStatus, { label: string; classes: string }> = {
  pending: { label: 'En attente', classes: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: 'Confirmée', classes: 'bg-blue-100 text-[#1B3A57]' },
  shipped: { label: 'Expédiée', classes: 'bg-indigo-100 text-indigo-800' },
  delivered: { label: 'Livrée', classes: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Annulée', classes: 'bg-red-100 text-[#E0212B]' },
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  const config = statusConfig[status];
  return (
    <span
      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${config.classes}`}
    >
      {config.label}
    </span>
  );
}
