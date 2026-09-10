import { useEffect, useState } from 'react';
import { categoryService } from '../../services/categoryService.js';
import type { Category } from '../../services/types.js';

interface Props {
  selectedId: string;
  onSelect: (id: string) => void;
}

export function CategoryDrilldown({ selectedId, onSelect }: Props) {
  const [tree, setTree] = useState<Category[]>([]);
  // Pile de navigation : [racine] ou [racine, groupe] selon le niveau où on est descendu
  const [path, setPath] = useState<Category[]>([]);

  useEffect(() => {
    categoryService.getTree().then(setTree);
  }, []);

  const currentLevel: Category[] =
    path.length === 0 ? tree : path[path.length - 1].children ?? [];

  const goInto = (cat: Category) => {
    if (cat.children?.length) {
      setPath((p) => [...p, cat]);
    } else {
      onSelect(String(cat.id));
    }
  };

  const goBack = () => {
    setPath((p) => p.slice(0, -1));
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-[#1B3A57]">Catégories</h3>
        {selectedId && (
          <button
            onClick={() => {
              onSelect('');
              setPath([]);
            }}
            className="text-xs text-[#E0212B] font-semibold"
          >
            Réinitialiser
          </button>
        )}
      </div>

      {/* Fil d'ariane */}
      {path.length > 0 && (
        <button
          onClick={goBack}
          className="flex items-center gap-1.5 text-xs text-[#5FA8D3] font-semibold mb-3"
        >
          ← {path.length > 1 ? path[path.length - 2].name : 'Toutes les catégories'}
        </button>
      )}

      <div className="flex flex-col gap-1.5">
        {path.length === 0 && (
          <button
            onClick={() => onSelect('')}
            className={`text-left text-sm px-3 py-2 rounded-lg ${
              !selectedId
                ? 'bg-[#EAF3FA] text-[#5FA8D3] font-semibold'
                : 'text-[#2E2E2E] hover:bg-gray-50'
            }`}
          >
            Toutes les catégories
          </button>
        )}

        {currentLevel.map((cat) => {
          const hasChildren = !!cat.children?.length;
          const isSelected = selectedId === String(cat.id);
          return (
            <button
              key={cat.id}
              onClick={() => goInto(cat)}
              className={`flex items-center justify-between text-left text-sm px-3 py-2 rounded-lg ${
                isSelected
                  ? 'bg-[#EAF3FA] text-[#5FA8D3] font-semibold'
                  : 'text-[#2E2E2E] hover:bg-gray-50'
              }`}
            >
              <span>{cat.name}</span>
              {hasChildren && <span className="text-[#A6A6A6]">›</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
