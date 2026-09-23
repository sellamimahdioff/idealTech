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
  const [brands, setBrands] = useState<{ brand: string; count: number }[]>(
    [],
  );

  const categoryId = searchParams.get('categoryId') ?? '';
  const search = searchParams.get('search') ?? '';
  const minPrice = searchParams.get('minPrice') ?? '';
  const maxPrice = searchParams.get('maxPrice') ?? '';
  const brand = searchParams.get('brand') ?? '';
  const page = Number(searchParams.get('page') ?? '1');

  useEffect(() => {
    productService.getBrands().then(setBrands);
  }, []);

 useEffect(() => {
  let cancelled = false;

  queueMicrotask(() => {
    if (!cancelled) setLoading(true);
  });

  productService
    .getAll({
      categoryId: categoryId ? Number(categoryId) : undefined,
      search: search || undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      brand: brand || undefined,
      page,
      limit: 12,
    })
    .then((res) => {
      if (cancelled) return;
      setProducts(res.items);
      setTotalPages(res.totalPages);
    })
    .finally(() => {
      if (!cancelled) setLoading(false);
    });

  return () => {
    cancelled = true;
  };
}, [categoryId, search, minPrice, maxPrice, brand, page]);
  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete('page');
    setSearchParams(next);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10 grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6 md:gap-8">
      <aside className="md:sticky md:top-24 md:self-start space-y-6">
        <CategoryDrilldown
          selectedId={categoryId}
          onSelect={(id) => updateParam('categoryId', id)}
        />

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="text-xs font-semibold text-[#1B3A57] mb-3">
            Prix (TND)
          </div>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => updateParam('minPrice', e.target.value)}
              className="w-1/2 border border-gray-200 rounded-lg px-2 py-1.5 text-sm"
            />
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => updateParam('maxPrice', e.target.value)}
              className="w-1/2 border border-gray-200 rounded-lg px-2 py-1.5 text-sm"
            />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="text-xs font-semibold text-[#1B3A57] mb-3">
            Marques
          </div>
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {brands.map((b) => (
              <label
                key={b.brand}
                className="flex items-center gap-2 text-sm cursor-pointer"
              >
                <input
                  type="radio"
                  name="brand"
                  checked={brand === b.brand}
                  onChange={() => updateParam('brand', b.brand)}
                />
                {b.brand}{' '}
                <span className="text-[#A6A6A6]">({b.count})</span>
              </label>
            ))}
            {brand && (
              <button
                onClick={() => updateParam('brand', '')}
                className="text-xs text-[#5FA8D3] mt-1"
              >
                Réinitialiser
              </button>
            )}
          </div>
        </div>
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