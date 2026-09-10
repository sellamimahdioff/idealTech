import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuthStore } from '../../store/authStore.js';

const navItems = [
  { to: '/admin', label: 'Tableau de bord', end: true },
  { to: '/admin/categories', label: 'Catégories' },
  { to: '/admin/produits', label: 'Produits' },
  { to: '/admin/commandes', label: 'Commandes' },
  { to: '/admin/devis', label: 'Devis' },
  { to: '/admin/factures', label: 'Factures' },
  { to: '/admin/avis', label: 'Avis clients' },
];

export function AdminLayout() {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const SidebarContent = (
    <>
      <div className="flex items-center gap-2 mb-8 px-1">
        <span className="w-2 h-2 rounded-full bg-[#E0212B]" />
        <span className="font-extrabold font-heading">
          iDeal <em className="text-[#E0212B] not-italic">Tech</em>
        </span>
      </div>
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `px-3 py-2.5 rounded-lg text-sm font-medium ${
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-[#B9C9D6] hover:bg-white/5'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <button
        onClick={handleLogout}
        className="text-sm text-[#B9C9D6] hover:text-white text-left px-3 py-2"
      >
        Déconnexion
      </button>
    </>
  );

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col md:flex-row">
      <div className="md:hidden bg-[#1B3A57] text-white flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#E0212B]" />
          <span className="font-extrabold font-heading text-sm">
            iDeal <em className="text-[#E0212B] not-italic">Tech</em> Admin
          </span>
        </div>
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="w-8 h-8 flex items-center justify-center"
          aria-label="Menu"
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      <aside className="hidden md:flex w-60 bg-[#1B3A57] text-white flex-col p-5 flex-shrink-0">
        {SidebarContent}
      </aside>

      {mobileOpen && (
        <aside className="md:hidden bg-[#1B3A57] text-white flex flex-col p-5">
          {SidebarContent}
        </aside>
      )}

      <main className="flex-1 p-4 md:p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
