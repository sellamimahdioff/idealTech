import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productService } from '../../services/productService.js';
import { ProductGrid } from '../../components/product/ProductGrid.js';
import { CategoryDrilldown } from '../../components/product/CategoryDrilldown.js';
import type { Product } from '../../services/types.js';

export function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const categoryId = searchParams.get('categoryId') ?? '';
  const search = searchParams.get('search') ?? '';
  const page = Number(searchParams.get('page') ?? '1');

  useEffect(() => {
    setLoading(true);
    productService
      .getAll({
        categoryId: categoryId ? Number(categoryId) : undefined,
        search: search || undefined,
        page,
        limit: 12,
      })
      .then((res) => {
        setProducts(res.items);
        setTotalPages(res.totalPages);
      })
      .finally(() => setLoading(false));
  }, [categoryId, search, page]);

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete('page');
    setSearchParams(next);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10 grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6 md:gap-8">
      <aside className="md:sticky md:top-24 md:self-start">
        <CategoryDrilldown
          selectedId={categoryId}
          onSelect={(id) => updateParam('categoryId', id)}
        />
      </aside>

      <div>
        <div className="flex justify-between items-center mb-5 md:mb-6">
          <h1 className="text-lg md:text-xl font-bold text-[#1B3A57] font-heading">
            Catalogue{search && ` — recherche : "${search}"`}
          </h1>
        </div>

        {loading ? (
          <p className="text-sm text-[#A6A6A6]">Chargement...</p>
        ) : (
          <>
            <ProductGrid products={products} />

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8 flex-wrap">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => updateParam('page', String(p))}
                      className={`w-9 h-9 rounded-lg text-sm font-medium ${
                        p === page
                          ? 'bg-[#1B3A57] text-white'
                          : 'bg-white border border-gray-200 text-[#2E2E2E]'
                      }`}
                    >
                      {p}
                    </button>
                  ),
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
