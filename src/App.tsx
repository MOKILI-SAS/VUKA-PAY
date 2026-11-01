import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { TicketmasterSearchHeader } from './components/showcase/TicketmasterSearchHeader';
import { TicketmasterHeroBento } from './components/showcase/TicketmasterHeroBento';
import { UpcomingEventsSection } from './components/showcase/UpcomingEventsSection';
import { TrendingSearches } from './components/showcase/TrendingSearches';
import { AboutPage } from './components/about/AboutPage';
import { CheckoutModal } from './components/ticketing/CheckoutModal';
import { ClientDashboard } from './components/client/ClientDashboard';
import { BackofficeHub } from './components/backoffice/BackofficeHub';
import { AuthModal } from './components/auth/AuthModal';
import { PublishActivityModal } from './components/showcase/PublishActivityModal';
import { TicketVerificationModal } from './components/ticketing/TicketVerificationModal';
import { UserDashboardModal } from './components/dashboard/UserDashboardModal';
import { TicketDefinition, VukaPublishedEvent } from './types';

const MainContent: React.FC = () => {
  const { appViewMode, setAppViewMode, setActiveClientTab, tickets } = useApp();
  const [selectedTicketForCheckout, setSelectedTicketForCheckout] = useState<TicketDefinition | null>(null);
  const [selectedEventForCheckout, setSelectedEventForCheckout] = useState<VukaPublishedEvent | null>(null);

  const handleOpenPassCheckout = (ticket?: TicketDefinition) => {
    const chosenTicket = ticket || tickets.find((t) => t.id === 'pass-6-days') || tickets[0];
    if (chosenTicket) {
      setSelectedTicketForCheckout(chosenTicket);
      setSelectedEventForCheckout(null);
    }
  };

  const handleSelectEvent = (event: VukaPublishedEvent) => {
    setSelectedEventForCheckout(event);
    setSelectedTicketForCheckout(null);
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
            {/* 1. Barre de recherche, Filtres (dont É-vote), Régions & Bouton Publier (Au-dessus du Hero) */}
            <TicketmasterSearchHeader onSearchClick={() => handleOpenPassCheckout()} />

            {/* 2. Hero Section mettant en avant les activités populaires (Style Eventbrite) */}
            <TicketmasterHeroBento 
              onExploreTickets={() => handleOpenPassCheckout()} 
              onExploreStands={handleExploreStands}
              onSelectTicket={(ticket) => {
                setSelectedTicketForCheckout(ticket);
                setSelectedEventForCheckout(null);
              }}
              onSelectEvent={handleSelectEvent}
            />

            {/* 3. Section Grille des Événements */}
            <div id="evenements" className="space-y-2">
              <UpcomingEventsSection 
                onSelectEvent={handleSelectEvent}
                onSelectEventTickets={() => handleOpenPassCheckout()} 
              />
            </div>

            {/* 4. Section "RECHERCHES POPULAIRES" avec carrousel horizontal tactile */}
            <TrendingSearches onSelectItem={() => handleOpenPassCheckout()} />
          </div>
        )}

        {/* VUE 2 : PAGE INTERNE À PROPOS (Comment ça marche, Tarifs, Solutions) */}
        {appViewMode === 'ABOUT_PAGE' && (
          <AboutPage onSelectTicket={(ticket) => {
            setSelectedTicketForCheckout(ticket || null);
            setSelectedEventForCheckout(null);
          }} />
        )}

        {/* VUE 3 : ESPACE FESTIVALIER & PARCOURS CLIENT */}
        {appViewMode === 'CLIENT_PORTAL' && (
          <ClientDashboard />
        )}

      </main>

      {/* Modal d'Authentification / Création de Compte */}
      <AuthModal />

      {/* Modal de Publication d'Activités (Événement, Donation, Concert, Festival, Conférence) */}
      <PublishActivityModal />

      {/* Modal de Vérification de Billet (Anti-Fraude VUKA) */}
      <TicketVerificationModal />

      {/* Modal Dashboard Organisateur & Espace Standier */}
      <UserDashboardModal />

      {/* Checkout Modal when buying a ticket or registering for an event */}
      {(selectedTicketForCheckout || selectedEventForCheckout) && (
        <CheckoutModal
          event={selectedEventForCheckout}
          ticket={selectedTicketForCheckout}
          onClose={() => {
            setSelectedTicketForCheckout(null);
            setSelectedEventForCheckout(null);
          }}
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
