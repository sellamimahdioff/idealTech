import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCartStore } from '../../store/cartStore.js';

export function Header() {
  const [search, setSearch] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const totalItems = useCartStore((s) => s.totalItems());

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/catalogue?search=${encodeURIComponent(search)}`);
    setMobileOpen(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3.5 md:py-4 flex items-center gap-4 md:gap-8">
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <span className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-[#E0212B] mb-3 md:mb-3.5" />
          <span className="text-xl md:text-2xl font-extrabold text-[#5FA8D3] font-heading">
            iD<span className="text-[#A6A6A6]">eal</span>{' '}
            <em className="text-[#E0212B] not-italic text-sm md:text-base ml-1">
              Tech
            </em>
          </span>
        </Link>

        {/* Recherche : visible en desktop, cachée en mobile (déplacée dans le menu) */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 max-w-xl"
        >
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un produit, une référence..."
            className="flex-1 border border-gray-200 rounded-l-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#5FA8D3]"
          />
          <button
            type="submit"
            className="bg-[#1B3A57] text-white px-4 rounded-r-lg font-semibold text-sm"
          >
            Rechercher
          </button>
        </form>

        <nav className="hidden lg:flex gap-6 text-sm font-medium text-[#2E2E2E]">
          <Link to="/catalogue" className="hover:text-[#5FA8D3]">
            Catalogue
          </Link>
          <Link to="/devis" className="hover:text-[#5FA8D3]">
            Devis
          </Link>
          <Link to="/suivi" className="hover:text-[#5FA8D3]">
            Suivi de commande
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-3 ml-auto">
          <Link
            to="/devis"
            className="border border-[#1B3A57] text-[#1B3A57] px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap"
          >
            Demander un devis
          </Link>
          <Link
            to="/panier"
            className="bg-[#E0212B] text-white px-4 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 whitespace-nowrap"
          >
            🛒 Panier · {totalItems}
          </Link>
        </div>

        {/* Mobile : panier compact + burger */}
        <div className="flex md:hidden items-center gap-2 ml-auto">
          <Link
            to="/panier"
            className="bg-[#E0212B] text-white px-3 py-2 rounded-lg font-semibold text-xs flex items-center gap-1"
          >
            🛒 {totalItems}
          </Link>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="w-9 h-9 flex items-center justify-center border border-gray-200 rounded-lg"
            aria-label="Menu"
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Panneau mobile déroulant */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 px-4 py-4 space-y-4">
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher..."
              className="flex-1 border border-gray-200 rounded-l-lg px-3.5 py-2.5 text-sm outline-none focus:border-[#5FA8D3]"
            />
            <button
              type="submit"
              className="bg-[#1B3A57] text-white px-4 rounded-r-lg font-semibold text-sm"
            >
              OK
            </button>
          </form>

          <nav className="flex flex-col gap-1 text-sm font-medium text-[#2E2E2E]">
            <Link
              to="/catalogue"
              onClick={() => setMobileOpen(false)}
              className="py-2.5 border-b border-gray-50"
            >
              Catalogue
            </Link>
            <Link
              to="/devis"
              onClick={() => setMobileOpen(false)}
              className="py-2.5 border-b border-gray-50"
            >
              Demander un devis
            </Link>
            <Link
              to="/suivi"
              onClick={() => setMobileOpen(false)}
              className="py-2.5"
            >
              Suivi de commande
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
