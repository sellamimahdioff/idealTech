import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderService, invoiceService } from '../../../services/orderService.js';
import type { Order, OrderStatus } from '../../../services/types.js';
import { formatPrice } from '../../../utils/formatPrice.js';
import { StatusBadge } from '../../../components/ui/StatusBadge.js';
import { Button } from '../../../components/ui/Button.js';

const statusLabels: Record<OrderStatus, string> = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  shipped: 'Expédiée',
  delivered: 'Livrée',
  cancelled: 'Annulée',
};

export function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [generating, setGenerating] = useState(false);

  const load = () => {
    if (id) orderService.getOne(Number(id)).then(setOrder);
  };

  useEffect(() => {
    load();
  }, [id]);

  const handleConfirm = async () => {
    if (!order) return;
    await orderService.updateStatus(order.id, 'confirmed');
    load();
  };

  const handleConvertToOrder = async () => {
    if (!order) return;
    await orderService.convertQuoteToOrder(order.id);
    load();
  };

  const handleGenerateInvoice = async () => {
    if (!order) return;
    setGenerating(true);
    try {
      const { pdf_url } = await invoiceService.generate(order.id);
      window.open(`${import.meta.env.VITE_API_URL}${pdf_url}`, '_blank');
    } finally {
      setGenerating(false);
    }
  };

  if (!order) return <p className="text-sm text-[#A6A6A6]">Chargement...</p>;

  return (
    <div className="max-w-2xl">
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-[#5FA8D3] mb-4"
      >
        ← Retour
      </button>

      <div className="flex justify-between items-start mb-1">
        <h1 className="text-2xl font-bold text-[#1B3A57] font-heading">
          {order.order_number}
        </h1>
        <StatusBadge status={order.status} />
      </div>

      {/* ---- Date de commande ---- */}
      <div className="text-sm text-[#A6A6A6] mb-6">
        Passée le{' '}
        {new Date(order.created_at).toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        })}{' '}
        à{' '}
        {new Date(order.created_at).toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-5">
        <h3 className="text-sm font-semibold text-[#1B3A57] mb-3">Client</h3>
        <div className="text-sm text-[#2E2E2E] space-y-1">
          <div>{order.customer_name}</div>
          {order.customer_company && <div>{order.customer_company}</div>}
          <div>{order.customer_email}</div>
          <div>{order.customer_phone}</div>
          {(order.customer_country || order.customer_region) && (
            <div>
              {[order.customer_region, order.customer_country]
                .filter(Boolean)
                .join(', ')}
            </div>
          )}
          {order.shipping_address && <div>{order.shipping_address}</div>}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-5">
        <h3 className="text-sm font-semibold text-[#1B3A57] mb-3">
          {order.type === 'quote' ? 'Produits demandés' : 'Articles commandés'}
        </h3>

        {order.items && order.items.length > 0 ? (
          <>
            <div className="space-y-3 mb-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center text-sm border-b border-gray-50 pb-2.5 last:border-0"
                >
                  <div>
                    <div className="font-medium text-[#2E2E2E]">
                      {item.product?.name ?? 'Produit supprimé'}
                    </div>
                    <div className="text-xs text-[#A6A6A6]">
                      {item.quantity} × {formatPrice(item.unit_price)}
                    </div>
                  </div>
                  <div className="font-semibold text-[#1B3A57]">
                    {formatPrice(item.subtotal)}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between pt-3 border-t border-gray-100 font-semibold text-[#1B3A57]">
              <span>
                {order.type === 'quote' ? 'Total estimatif' : 'Total'}
              </span>
              <span>{formatPrice(order.total_amount)}</span>
            </div>
          </>
        ) : (
          <p className="text-sm text-[#A6A6A6]">
            Aucun produit n'a été sélectionné pour ce devis.
          </p>
        )}
      </div>

      {/* ---- Historique des statuts ---- */}
      {order.status_history && order.status_history.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-5">
          <h3 className="text-sm font-semibold text-[#1B3A57] mb-4">
            Historique
          </h3>
          <div className="space-y-0">
            {order.status_history.map((entry, i) => (
              <div key={entry.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#5FA8D3] mt-1.5" />
                  {i < order.status_history!.length - 1 && (
                    <div className="w-px flex-1 bg-gray-200" />
                  )}
                </div>
                <div className="pb-4">
                  <div className="text-sm font-medium text-[#2E2E2E]">
                    {statusLabels[entry.status]}
                  </div>
                  <div className="text-xs text-[#A6A6A6]">
                    {new Date(entry.changed_at).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}{' '}
                    à{' '}
                    {new Date(entry.changed_at).toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3 flex-wrap">
        {order.status === 'pending' && (
          <Button onClick={handleConfirm}>Confirmer</Button>
        )}
        {order.type === 'quote' && (
          <Button variant="secondary" onClick={handleConvertToOrder}>
            Convertir en commande
          </Button>
        )}
        {order.status === 'confirmed' && (
          <Button
            variant="secondary"
            onClick={handleGenerateInvoice}
            disabled={generating}
          >
            {generating ? 'Génération...' : 'Générer la facture (PDF)'}
          </Button>
        )}
      </div>
    </div>
  );
}
