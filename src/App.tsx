import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { RoleSwitcher } from './components/common/RoleSwitcher';
import { Hero } from './components/showcase/Hero';
import { SolutionsGalaxy } from './components/showcase/SolutionsGalaxy';
import { TicketCatalog } from './components/ticketing/TicketCatalog';
import { CheckoutModal } from './components/ticketing/CheckoutModal';
import { WalletDashboard } from './components/wallet/WalletDashboard';
import { POSTerminal } from './components/pos/POSTerminal';
import { AccessControlView } from './components/access/AccessControlView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { TicketDefinition } from './types';

const MainContent: React.FC = () => {
  const { currentRole } = useApp();
  const [selectedTicketForCheckout, setSelectedTicketForCheckout] = useState<TicketDefinition | null>(null);

  const scrollToTickets = () => {
    const el = document.getElementById('billetterie');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0D17] text-slate-100 selection:bg-[#FF5722] selection:text-white">
      {/* Top Header */}
      <Header />

      {/* Main Role-Based Views */}
      <main className="flex-1 pb-24">
        {currentRole === 'PUBLIC' && (
          <div>
            <Hero onExploreTickets={scrollToTickets} />
            <SolutionsGalaxy onSelectTicket={scrollToTickets} />
            <TicketCatalog onBuyClick={(ticket) => setSelectedTicketForCheckout(ticket)} />
          </div>
        )}

        {currentRole === 'FESTIVALIER' && (
          <WalletDashboard />
        )}

        {currentRole === 'STAND_MANAGER' && (
          <POSTerminal />
        )}

        {currentRole === 'STAFF_ACCESS' && (
          <AccessControlView />
        )}

        {currentRole === 'SUPER_ADMIN' && (
          <AdminDashboard />
        )}
      </main>

      {/* Checkout Modal when buying a ticket */}
      {selectedTicketForCheckout && (
        <CheckoutModal
          ticket={selectedTicketForCheckout}
          onClose={() => setSelectedTicketForCheckout(null)}
        />
      )}

      {/* Persistent Footer with required "Propulsé par MOKILI" */}
      <Footer />

      {/* Interactive Floating Role Switcher */}
      <RoleSwitcher />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;
