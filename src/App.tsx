import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { TicketmasterSearchHeader } from './components/showcase/TicketmasterSearchHeader';
import { TicketmasterHeroBento } from './components/showcase/TicketmasterHeroBento';
import { UpcomingEventsSection } from './components/showcase/UpcomingEventsSection';
import { TrendingSearches } from './components/showcase/TrendingSearches';
import { PerforatedTicketSection } from './components/showcase/PerforatedTicketSection';
import { SolutionsGalaxy } from './components/showcase/SolutionsGalaxy';
import { CheckoutModal } from './components/ticketing/CheckoutModal';
import { ClientDashboard } from './components/client/ClientDashboard';
import { BackofficeHub } from './components/backoffice/BackofficeHub';
import { AuthModal } from './components/auth/AuthModal';
import { PublishActivityModal } from './components/showcase/PublishActivityModal';
import { TicketDefinition } from './types';

const MainContent: React.FC = () => {
  const { appViewMode, setAppViewMode, setActiveClientTab, tickets } = useApp();
  const [selectedTicketForCheckout, setSelectedTicketForCheckout] = useState<TicketDefinition | null>(null);

  const handleOpenPassCheckout = (ticket?: TicketDefinition) => {
    const chosenTicket = ticket || tickets.find((t) => t.id === 'pass-6-days') || tickets[0];
    if (chosenTicket) {
      setSelectedTicketForCheckout(chosenTicket);
    }
  };

  const handleExploreStands = () => {
    setAppViewMode('CLIENT_PORTAL');
    setActiveClientTab('OVERVIEW');
  };

  // 1. BACKOFFICE STAFF (Portail sécurisé isolé pour Caisse POS, Contrôle d'accès et Super Admin)
  if (appViewMode === 'BACKOFFICE_STAFF') {
    return <BackofficeHub />;
  }

  // 2. SITE PUBLIC ET PORTAIL CLIENT FESTIVALIER
  return (
    <div className="min-h-screen flex flex-col bg-[#FBF6EE] text-[#14110F] selection:bg-[#FFE3D3] selection:text-[#14110F]">
      {/* Top Navbar publique avec profil festivalier et navigation fluide */}
      <Header />

      {/* Main Views */}
      <main className="flex-1 pb-16">
        
        {/* VUE 1 : LANDING PAGE GRAND PUBLIC (100% sobre, épurée et sans encombrement) */}
        {appViewMode === 'PUBLIC_LANDING' && (
          <div className="space-y-6">
            {/* 1. Ticketmaster Global Search Header Bar avec filtre de catégories */}
            <TicketmasterSearchHeader onSearchClick={() => handleOpenPassCheckout()} />

            {/* 2. Ticketmaster Hero Bento Grid (Grand événement CFW6 + Pass & Cashless) */}
            <TicketmasterHeroBento 
              onExploreTickets={() => handleOpenPassCheckout()} 
              onExploreStands={handleExploreStands}
              onSelectTicket={(ticket) => setSelectedTicketForCheckout(ticket)}
            />

            {/* 3. Catalogue Multi-Événements VUKA Pay (CFW6, Kinshasa Jazz, AfroTech, Nuits de la Rumba) */}
            <UpcomingEventsSection onSelectEventTickets={() => handleOpenPassCheckout()} />

            {/* 4. Section "RECHERCHES POPULAIRES" avec carrousel horizontal tactile */}
            <TrendingSearches onSelectItem={() => handleOpenPassCheckout()} />

            {/* 5. Grand Ticket Perforé Braise (#FF6A2B) & Nuit (#14110F) avec QR Code Scannable */}
            <PerforatedTicketSection onExploreTickets={() => handleOpenPassCheckout()} />

            {/* 6. Les 3 Piliers d'Expertise VUKA Pay (Fluide, Chaleureux 10% Solidaire, Fiable) */}
            <SolutionsGalaxy onSelectTicket={() => handleOpenPassCheckout()} />
          </div>
        )}

        {/* VUE 2 : ESPACE FESTIVALIER & PARCOURS CLIENT */}
        {appViewMode === 'CLIENT_PORTAL' && (
          <ClientDashboard />
        )}

      </main>

      {/* Modal d'Authentification / Création de Compte */}
      <AuthModal />

      {/* Modal de Publication d'Activités (Événement, Donation, Concert, Festival, Conférence) */}
      <PublishActivityModal />

      {/* Checkout Modal when buying a ticket */}
      {selectedTicketForCheckout && (
        <CheckoutModal
          ticket={selectedTicketForCheckout}
          onClose={() => setSelectedTicketForCheckout(null)}
        />
      )}

      {/* Persistent Footer avec mentions légales obligatoires et attribution "Propulsé par MOKILI" */}
      <Footer />
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
