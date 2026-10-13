import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { TicketmasterSearchHeader } from './components/showcase/TicketmasterSearchHeader';
import { TicketmasterHeroBento } from './components/showcase/TicketmasterHeroBento';
import { UpcomingEventsSection } from './components/showcase/UpcomingEventsSection';
import { TrendingSearches } from './components/showcase/TrendingSearches';
import { FestivalSchedule } from './components/showcase/FestivalSchedule';
import { FestivalZones } from './components/showcase/FestivalZones';
import { PerforatedTicketSection } from './components/showcase/PerforatedTicketSection';
import { SolutionsGalaxy } from './components/showcase/SolutionsGalaxy';
import { TicketCatalog } from './components/ticketing/TicketCatalog';
import { CheckoutModal } from './components/ticketing/CheckoutModal';
import { ClientDashboard } from './components/client/ClientDashboard';
import { BackofficeHub } from './components/backoffice/BackofficeHub';
import { AuthModal } from './components/auth/AuthModal';
import { TicketDefinition } from './types';

const MainContent: React.FC = () => {
  const { appViewMode, setAppViewMode, setActiveClientTab } = useApp();
  const [selectedTicketForCheckout, setSelectedTicketForCheckout] = useState<TicketDefinition | null>(null);

  const scrollToTickets = () => {
    if (appViewMode !== 'PUBLIC_LANDING') {
      setAppViewMode('PUBLIC_LANDING');
    }
    setTimeout(() => {
      const el = document.getElementById('billetterie');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
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
      {/* Top Navbar publique avec profil festivalier et accès billetterie */}
      <Header />

      {/* Main Views */}
      <main className="flex-1 pb-16">
        
        {/* VUE 1 : LANDING PAGE GRAND PUBLIC (100% épurée, aucun outil staff/caisse visible) */}
        {appViewMode === 'PUBLIC_LANDING' && (
          <div className="space-y-6">
            {/* 1. Ticketmaster Global Search Header Bar (Emplacement | Dates | Recherche | Bouton) */}
            <TicketmasterSearchHeader onSearchClick={scrollToTickets} />

            {/* 2. Ticketmaster Hero Bento Grid (5 Cartes : Grand événement CFW6 à gauche + 4 cartes à droite) */}
            <TicketmasterHeroBento 
              onExploreTickets={scrollToTickets} 
              onExploreStands={handleExploreStands}
            />

            {/* 3. Catalogue Multi-Événements VUKA Pay (CFW6, Kinshasa Jazz, AfroTech, Nuits de la Rumba) */}
            <UpcomingEventsSection onSelectEventTickets={scrollToTickets} />

            {/* 4. Section "RECHERCHES POPULAIRES" avec carrousel horizontal et flèches de défilement */}
            <TrendingSearches onSelectItem={() => scrollToTickets()} />

            {/* 5. Section "ÉVÉNEMENTS DE LA SEMAINE / PROGRAMMATION DES 6 JOURS" + Sidebar "EN VEDETTE" */}
            <FestivalSchedule onSelectDayTicket={scrollToTickets} />

            {/* 6. Section "LES ZONES DU FESTIVAL" (Inspirée de la grille Villes Populaires de Ticketmaster) */}
            <FestivalZones />

            {/* 7. Grand Ticket Perforé Braise (#FF6A2B) & Nuit (#14110F) avec QR Code Scannable */}
            <PerforatedTicketSection />

            {/* 8. Les 3 Piliers d'Expertise VUKA Pay (Billetterie, Cashless, Accès) */}
            <SolutionsGalaxy onSelectTicket={scrollToTickets} />

            {/* 9. Catalogue des Billets Officiels CFW6 avec Paiement M-Pesa */}
            <TicketCatalog onBuyClick={(ticket) => setSelectedTicketForCheckout(ticket)} />
          </div>
        )}

        {/* VUE 2 : ESPACE FESTIVALIER & PARCOURS CLIENT */}
        {appViewMode === 'CLIENT_PORTAL' && (
          <ClientDashboard />
        )}

      </main>

      {/* Modal d'Authentification / Création de Compte */}
      <AuthModal />

      {/* Checkout Modal when buying a ticket */}
      {selectedTicketForCheckout && (
        <CheckoutModal
          ticket={selectedTicketForCheckout}
          onClose={() => setSelectedTicketForCheckout(null)}
        />
      )}

      {/* Persistent Footer with required "Propulsé par MOKILI" et lien discret staff */}
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
