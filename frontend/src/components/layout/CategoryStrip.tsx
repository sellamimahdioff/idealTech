import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { categoryService } from '../../services/categoryService.js';
import type { Category } from '../../services/types.js';

export function CategoryStrip() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [openId, setOpenId] = useState<number | null>(null);

  useEffect(() => {
    categoryService.getTree().then(setCategories).catch(() => {});
  }, []);

  // Le mega-menu au survol n'a de sens qu'en desktop.
  // En mobile/tablette, la navigation par catégories se fait via le drilldown de la page Catalogue.
  return (
    <div className="hidden md:block bg-[#1B3A57] relative z-30">
      <div className="max-w-7xl mx-auto px-6 flex gap-7 overflow-visible">
        {categories.map((cat) => {
          const hasChildren = !!cat.children?.length;
          return (
            <div
              key={cat.id}
              className="relative"
              onMouseEnter={() => hasChildren && setOpenId(cat.id)}
              onMouseLeave={() => setOpenId(null)}
            >
              <Link
                to={`/catalogue?categoryId=${cat.id}`}
                className={`block text-sm font-medium py-2.5 whitespace-nowrap border-b-2 ${
                  openId === cat.id
                    ? 'text-white border-[#E0212B]'
                    : 'text-[#CFE0EC] border-transparent hover:text-white'
                }`}
              >
                {cat.name}
              </Link>

              {hasChildren && openId === cat.id && (
                <div className="absolute left-0 top-full bg-white shadow-xl rounded-b-xl border-t-2 border-[#E0212B] py-6 px-8 flex gap-12 min-w-[560px] max-w-[90vw] overflow-x-auto">
                  {cat.children!.map((group) => (
                    <div key={group.id} className="min-w-[160px]">
                      <Link
                        to={`/catalogue?categoryId=${group.id}`}
                        className="block text-sm font-semibold text-[#5FA8D3] mb-3 pb-1.5 border-b border-gray-100 hover:underline"
                      >
                        {group.name}
                      </Link>
                      <ul className="space-y-2">
                        {(group.children ?? []).map((sub) => (
                          <li key={sub.id}>
                            <Link
                              to={`/catalogue?categoryId=${sub.id}`}
                              className="text-sm text-[#2E2E2E] hover:text-[#E0212B]"
                            >
                              {sub.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
