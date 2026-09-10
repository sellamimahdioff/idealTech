import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../../../services/orderService.js';
import type { Order, OrderStatus } from '../../../services/types.js';
import { formatPrice } from '../../../utils/formatPrice.js';
import { Button } from '../../../components/ui/Button.js';

const statusOptions: OrderStatus[] = [
  'pending',
  'confirmed',
  'shipped',
  'delivered',
  'cancelled',
];

export function OrderList({ type }: { type: 'order' | 'quote' }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const reload = () => {
    setLoading(true);
    orderService.getAll({ type }).then((data) => {
      setOrders(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    orderService.getAll({ type }).then((data) => {
      setOrders(data);
      setLoading(false);
    });
  }, [type]);

  const handleStatusChange = async (id: number, status: OrderStatus) => {
    await orderService.updateStatus(id, status);
    reload();
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await orderService.exportCsv();
    } finally {
      setExporting(false);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-3 mb-8">
        <h1 className="text-2xl font-bold text-[#1B3A57] font-heading">
          {type === 'order' ? 'Commandes' : 'Demandes de devis'}
        </h1>
        <Button variant="secondary" onClick={handleExport} disabled={exporting}>
          {exporting ? 'Export...' : '⬇ Exporter CSV'}
        </Button>
      </div>

      {loading ? (
        <p className="text-sm text-[#A6A6A6]">Chargement...</p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead className="bg-gray-50 text-left text-[#A6A6A6]">
              <tr>
                <th className="px-5 py-3 font-medium">N°</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Client</th>
                <th className="px-5 py-3 font-medium">Total</th>
                <th className="px-5 py-3 font-medium">Statut</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-gray-100">
                  <td className="px-5 py-3 font-medium text-[#2E2E2E]">
                    {order.order_number}
                  </td>
                  <td className="px-5 py-3 text-[#A6A6A6] whitespace-nowrap">
                    {new Date(order.created_at).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                    <div className="text-xs">
                      {new Date(order.created_at).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    {order.customer_name}
                    {order.customer_company && (
                      <div className="text-xs text-[#A6A6A6]">
                        {order.customer_company}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    {formatPrice(order.total_amount)}
                  </td>
                  <td className="px-5 py-3">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(
                          order.id,
                          e.target.value as OrderStatus,
                        )
                      }
                      className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs"
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link
                      to={`/admin/${type === 'order' ? 'commandes' : 'devis'}/${order.id}`}
                      className="text-[#5FA8D3] font-semibold"
                    >
                      Voir détail
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
