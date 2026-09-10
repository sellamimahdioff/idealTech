import { useEffect, useState } from 'react';
import { productService } from '../../services/productService.js';
import { orderService } from '../../services/orderService.js';

export function Dashboard() {
  const [stats, setStats] = useState({
    products: 0,
    pendingOrders: 0,
    pendingQuotes: 0,
    lowStock: 0,
  });

  useEffect(() => {
    productService.getAll({ limit: 1 }).then((res) =>
      setStats((s) => ({ ...s, products: res.total })),
    );
    orderService
      .getAll({ type: 'order', status: 'pending' })
      .then((orders) =>
        setStats((s) => ({ ...s, pendingOrders: orders.length })),
      );
    orderService
      .getAll({ type: 'quote', status: 'pending' })
      .then((quotes) =>
        setStats((s) => ({ ...s, pendingQuotes: quotes.length })),
      );
  }, []);

  const cards = [
    { label: 'Produits au catalogue', value: stats.products },
    { label: 'Commandes en attente', value: stats.pendingOrders },
    { label: 'Devis en attente', value: stats.pendingQuotes },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1B3A57] mb-8 font-heading">
        Tableau de bord
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-white border border-gray-200 rounded-xl p-6"
          >
            <div className="text-3xl font-extrabold text-[#1B3A57] font-heading mb-1">
              {card.value}
            </div>
            <div className="text-sm text-[#A6A6A6]">{card.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
