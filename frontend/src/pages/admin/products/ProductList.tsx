import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../../../services/productService.js';
import type { Product } from '../../../services/types.js';
import { formatPrice } from '../../../utils/formatPrice.js';
import { Button } from '../../../components/ui/Button.js';

export function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    productService
      .getAll({ search: search || undefined, limit: 50 })
      .then((res) => setProducts(res.items))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [search]);

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce produit ?')) return;
    await productService.remove(id);
    load();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-[#1B3A57] font-heading">
          Produits
        </h1>
        <Link to="/admin/produits/nouveau">
          <Button>+ Nouveau produit</Button>
        </Link>
      </div>

      <input
        type="text"
        placeholder="Rechercher par nom ou référence..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm mb-5 w-full max-w-sm outline-none focus:border-[#5FA8D3]"
      />

      {loading ? (
        <p className="text-sm text-[#A6A6A6]">Chargement...</p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-[#A6A6A6]">
              <tr>
                <th className="px-5 py-3 font-medium">Produit</th>
                <th className="px-5 py-3 font-medium">Référence</th>
                <th className="px-5 py-3 font-medium">Prix détail</th>
                <th className="px-5 py-3 font-medium">Stock</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t border-gray-100">
                  <td className="px-5 py-3 font-medium text-[#2E2E2E]">
                    {p.name}
                  </td>
                  <td className="px-5 py-3 text-[#A6A6A6]">{p.sku}</td>
                  <td className="px-5 py-3">{formatPrice(p.retail_price)}</td>
                  <td className="px-5 py-3">
                    <span
                      className={
                        p.stock_quantity > 0
                          ? 'text-green-700'
                          : 'text-[#E0212B]'
                      }
                    >
                      {p.stock_quantity}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right space-x-3">
                    <Link
                      to={`/admin/produits/${p.id}`}
                      className="text-[#5FA8D3] font-semibold"
                    >
                      Modifier
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-[#E0212B] font-semibold"
                    >
                      Supprimer
                    </button>
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
