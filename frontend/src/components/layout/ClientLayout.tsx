import { Outlet } from 'react-router-dom';
import { Header } from './Header.js';
import { CategoryStrip } from './CategoryStrip.js';
import { Footer } from './Footer.js';
import { WhatsAppFloatingButton } from './WhatsAppFloatingButton.js';

export function ClientLayout() {
  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col">
      <Header />
      <CategoryStrip />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFloatingButton />
    </div>
  );
}
