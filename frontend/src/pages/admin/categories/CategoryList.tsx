import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { categoryService } from '../../../services/categoryService.js';
import type { Category } from '../../../services/types.js';
import { Button } from '../../../components/ui/Button.js';

export function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    categoryService.getFlat().then(setCategories).finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cette catégorie ?')) return;
    try {
      await categoryService.remove(id);
      load();
    } catch (err: any) {
      alert(
        err?.response?.data?.message ??
          'Impossible de supprimer cette catégorie.',
      );
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-[#1B3A57] font-heading">
          Catégories & sous-catégories
        </h1>
        <Link to="/admin/categories/nouvelle">
          <Button>+ Nouvelle catégorie</Button>
        </Link>
      </div>

      {loading ? (
        <p className="text-sm text-[#A6A6A6]">Chargement...</p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-[#A6A6A6]">
              <tr>
                <th className="px-5 py-3 font-medium">Nom</th>
                <th className="px-5 py-3 font-medium">Slug</th>
                <th className="px-5 py-3 font-medium">Catégorie parente</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-t border-gray-100">
                  <td className="px-5 py-3 font-medium text-[#2E2E2E]">
                    {cat.parent ? `↳ ${cat.name}` : cat.name}
                  </td>
                  <td className="px-5 py-3 text-[#A6A6A6]">{cat.slug}</td>
                  <td className="px-5 py-3 text-[#A6A6A6]">
                    {cat.parent?.name ?? '—'}
                  </td>
                  <td className="px-5 py-3 text-right space-x-3">
                    <Link
                      to={`/admin/categories/${cat.id}`}
                      className="text-[#5FA8D3] font-semibold"
                    >
                      Modifier
                    </Link>
                    <button
                      onClick={() => handleDelete(cat.id)}
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
