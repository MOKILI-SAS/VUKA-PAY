import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Ticket, 
  Heart, 
  Utensils, 
  Music, 
  Award, 
  Building2, 
  Calendar,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Radio
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TicketDefinition, VukaPublishedEvent } from '../../types';

interface TicketmasterHeroBentoProps {
  onExploreTickets: () => void;
  onExploreStands: () => void;
  onSelectTicket?: (ticket: TicketDefinition) => void;
}

export const TicketmasterHeroBento: React.FC<TicketmasterHeroBentoProps> = ({
  onExploreTickets,
  onExploreStands,
  onSelectTicket,
}) => {
  const { tickets, publishedEvents } = useApp();

  // Filtrer les événements mis en avant (ou tous les événements disponibles)
  const featuredEvents: VukaPublishedEvent[] = publishedEvents.length > 0 
    ? publishedEvents.filter(e => e.isFeatured)
    : [];

  const activeEvents = featuredEvents.length > 0 ? featuredEvents : publishedEvents;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Rotation automatique en boucle (toutes les 5.5 secondes)
  useEffect(() => {
    if (activeEvents.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeEvents.length);
    }, 5500);

    return () => clearInterval(interval);
  }, [activeEvents.length, isPaused]);

  // Si l'index dépasse la taille de la liste (ex: après ajout/suppression)
  useEffect(() => {
    if (currentIndex >= activeEvents.length && activeEvents.length > 0) {
      setCurrentIndex(0);
    }
  }, [activeEvents.length, currentIndex]);

  const currentEvent = activeEvents[currentIndex] || activeEvents[0];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + activeEvents.length) % activeEvents.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % activeEvents.length);
  };

  const handleSelectPass = (ticketId?: string) => {
    if (onSelectTicket) {
      const found = (ticketId && tickets.find((t) => t.id === ticketId)) || tickets[0];
      if (found) onSelectTicket(found);
    } else {
      onExploreTickets();
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-3 pb-8">
      
      {/* Platform Context Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 px-1">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF6A2B] animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-widest text-[#FF6A2B]">
            Billetterie & Cashless VUKA Pay
          </span>
          <span className="text-[#D9D0C6]">•</span>
          <span className="text-xs font-medium text-[#7A7068]">
            Événements & Campagnes Officielles
          </span>
        </div>
        <div className="text-xs text-[#7A7068] flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 text-[#7A7068]" />
          <span>Partenaire Officiel : {currentEvent?.organizerName || 'Fondation Congolicious'}</span>
        </div>
      </div>

      {/* 5-Card Bento Grid avec Mini-Hero Slider en boucle à gauche */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Card 1 : MINI-HERO SLIDER EN BOUCLE — Fond Nuit #14110F avec rotation automatique */}
        <div 
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="lg:col-span-7 relative overflow-hidden rounded-[24px] bg-[#14110F] text-[#FBF6EE] p-5 sm:p-10 flex flex-col justify-between shadow-level2 group min-h-[460px] sm:min-h-[500px]"
        >
          {/* Image de fond de l'événement avec fondu sombre pour contraste WCAG AA */}
          {currentEvent?.imageUrl && (
            <div 
              key={currentEvent.id}
              className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out scale-105 group-hover:scale-100 opacity-20 pointer-events-none"
              style={{ backgroundImage: `url(${currentEvent.imageUrl})` }}
            />
          )}

          {/* Halo lumineux chaud VUKA (Braise & Soleil) */}
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[#FF6A2B]/15 blur-3xl pointer-events-none" />
          <div className="absolute right-10 bottom-10 w-64 h-64 rounded-full bg-[#FFC21A]/10 blur-2xl pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#14110F] via-[#14110F]/90 to-[#14110F]/75 pointer-events-none" />

          {/* Top Bar : Badges dynamiques + Flèches de défilement manuel */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-[#FFC21A] animate-pulse" />
                <span className="text-[#FBF6EE] uppercase tracking-wider text-[11px] font-bold">
                  {currentEvent?.badge || `${currentEvent?.activityType?.toUpperCase() || 'ÉVÉNEMENT'} EN VEDETTE`}
                </span>
              </div>

              {currentEvent?.activityType && (
                <span className="px-2.5 py-1 rounded-full bg-[#FF6A2B]/20 border border-[#FF6A2B]/40 text-[#FF6A2B] text-[10px] font-bold uppercase tracking-wider hidden sm:inline-block">
                  {currentEvent.activityType}
                </span>
              )}
            </div>

            {/* Contrôles de Défilement (Précédent / Suivant & Indicateur) */}
            <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md p-1 rounded-full border border-white/10">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Activité précédente"
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-[#FF6A2B] text-[#FBF6EE] hover:text-[#14110F] flex items-center justify-center transition active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="px-2 text-[10px] font-mono font-bold text-[#FFC21A]">
                {currentIndex + 1} / {activeEvents.length}
              </div>

              <button
                type="button"
                onClick={handleNext}
                aria-label="Activité suivante"
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-[#FF6A2B] text-[#FBF6EE] hover:text-[#14110F] flex items-center justify-center transition active:scale-95"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Main Content Area avec transition fluide */}
          <div 
            key={currentEvent?.id} 
            className="relative z-10 my-4 sm:my-6 space-y-3 sm:space-y-4 animate-in fade-in duration-300"
          >
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#FFC21A] uppercase tracking-wider font-mono">
              <Calendar className="w-3.5 h-3.5 text-[#FFC21A]" />
              <span>{currentEvent?.dateStr} • {currentEvent?.location}</span>
            </div>

            <h1 className="text-2xl sm:text-5xl font-bold text-[#FBF6EE] leading-[1.1] tracking-tight font-heading">
              {currentEvent?.title}
              {currentEvent?.subtitle && (
                <span className="block text-[#FF6A2B] mt-1 text-xl sm:text-3xl font-semibold">
                  {currentEvent.subtitle}
                </span>
              )}
            </h1>

            <p className="text-xs sm:text-base text-[#D9D0C6] max-w-xl font-normal leading-relaxed line-clamp-3 sm:line-clamp-none">
              {currentEvent?.description || 'Réservez vos places officielles en quelques clics ou soutenez les actions solidaires avec VUKA Pay.'}
            </p>

            {/* Quick Metrics Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1 sm:pt-2">
              {currentEvent?.metrics ? (
                currentEvent.metrics.map((m, idx) => (
                  <div 
                    key={idx}
                    className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[11px] sm:text-xs text-[#FBF6EE] font-semibold flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFC21A]" />
                    <span>{m.label} : <strong>{m.value}</strong></span>
                  </div>
                ))
              ) : (
                <>
                  <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[11px] sm:text-xs text-[#FBF6EE] font-semibold flex items-center gap-1.5">
                    <Utensils className="w-3.5 h-3.5 text-[#FFC21A]" />
                    <span>{currentEvent?.category || 'Billetterie Ouverte'}</span>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[11px] sm:text-xs text-[#FBF6EE] font-semibold flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-[#C62828]" />
                    <span>{currentEvent?.priceFrom}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Action CTAs Bottom + Pagination Dots Bar */}
          <div className="relative z-10 pt-2 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => handleSelectPass()}
                className="min-h-[48px] h-12 px-6 sm:px-7 rounded-full bg-[#FF6A2B] hover:bg-[#E24E10] text-[#14110F] font-bold text-xs sm:text-sm uppercase tracking-wider shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2.5 active:scale-95"
              >
                <Ticket className="w-4 h-4 text-[#14110F]" />
                <span>{currentEvent?.ctaText || 'Participer / Réserver'}</span>
                <ArrowRight className="w-4 h-4 text-[#14110F]" />
              </button>

              <button
                type="button"
                onClick={onExploreStands}
                className="min-h-[48px] h-12 px-5 sm:px-6 rounded-full bg-white/10 hover:bg-white/20 text-[#FBF6EE] font-semibold text-xs sm:text-sm border border-white/20 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Utensils className="w-4 h-4 text-[#FFC21A]" />
                <span>Explorer les 23 Stands</span>
              </button>
            </div>

            {/* Pagination Dots (Clair, Interactif & Indicateur de progression) */}
            <div className="flex items-center gap-1.5 pt-1">
              {activeEvents.map((evt, idx) => (
                <button
                  key={evt.id}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentIndex 
                      ? 'w-8 bg-[#FF6A2B]' 
                      : 'w-2 bg-white/30 hover:bg-white/60'
                  }`}
                  aria-label={`Aller à ${evt.title}`}
                  title={evt.title}
                />
              ))}
            </div>
          </div>

        </div>

        {/* Cards 2-5 : Grille 2x2 des Cartes Pass & Cashless */}
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Card 2: Pass Découverte 1 Jour */}
          <div className="p-6 rounded-[24px] bg-white border border-[#D9D0C6] shadow-level1 hover:shadow-md transition-all flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FFE3D3] text-[#14110F] border border-[#FF6A2B]/20 uppercase tracking-wider">
                  Accès 1 Jour
                </span>
                <span className="text-xs font-medium text-[#7A7068] font-mono">Jour au choix</span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#14110F] group-hover:text-[#FF6A2B] transition-colors tracking-tight font-heading">
                  Pass Découverte
                </h3>
                <p className="text-xs text-[#7A7068] mt-1 line-clamp-2">
                  Accès complet au site du festival, aux 23 stands et aux concerts de la journée choisie.
                </p>
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-[#F3ECE2] flex items-center justify-between">
              <div>
                <div className="text-xl font-bold text-[#14110F] font-mono tnum">5 $</div>
                <div className="text-[10px] text-[#7A7068] font-mono">≈ 13 750 CDF</div>
              </div>
              <button
                type="button"
                onClick={() => handleSelectPass('pass-j1')}
                className="h-10 px-4 rounded-full bg-[#FF6A2B] hover:bg-[#E24E10] text-[#14110F] font-bold text-xs uppercase tracking-wider transition active:scale-95"
              >
                Réserver
              </button>
            </div>
          </div>

          {/* Card 3: Pass 6 Jours All-Access */}
          <div className="p-6 rounded-[24px] bg-white border-2 border-[#FFC21A] shadow-level1 hover:shadow-md transition-all flex flex-col justify-between relative group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FFC21A] text-[#14110F] uppercase tracking-wider">
                  Meilleure Vente
                </span>
                <span className="text-xs font-bold text-[#FF6A2B] font-mono">6 Jours</span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#14110F] group-hover:text-[#FF6A2B] transition-colors tracking-tight font-heading">
                  Pass 6 Jours Intégral
                </h3>
                <p className="text-xs text-[#7A7068] mt-1 line-clamp-2">
                  Accès illimité du mardi 22 au dimanche 27 sept. Bracelet RFID MIFARE inclus.
                </p>
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-[#F3ECE2] flex items-center justify-between">
              <div>
                <div className="text-xl font-bold text-[#FF6A2B] font-mono tnum">20 $</div>
                <div className="text-[10px] text-[#7A7068] font-mono">≈ 55 000 CDF</div>
              </div>
              <button
                type="button"
                onClick={() => handleSelectPass('pass-6-days')}
                className="h-10 px-4 rounded-full bg-[#FF6A2B] hover:bg-[#E24E10] text-[#14110F] font-bold text-xs uppercase tracking-wider transition active:scale-95"
              >
                Réserver
              </button>
            </div>
          </div>

          {/* Card 4: Pass VIP Food & Wine */}
          <div className="p-6 rounded-[24px] bg-white border border-[#D9D0C6] shadow-level1 hover:shadow-md transition-all flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#E3EEF6] text-[#0E5A8A] border border-[#0E5A8A]/20 uppercase tracking-wider">
                  Coupe-File VIP
                </span>
                <span className="text-xs font-medium text-[#7A7068] font-mono">Privilège</span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#14110F] group-hover:text-[#0E5A8A] transition-colors tracking-tight font-heading">
                  Pass VIP Lounge
                </h3>
                <p className="text-xs text-[#7A7068] mt-1 line-clamp-2">
                  Entrée prioritaire Porte VIP, lounge climatisé, dégustations offertes et parking privé.
                </p>
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-[#F3ECE2] flex items-center justify-between">
              <div>
                <div className="text-xl font-bold text-[#14110F] font-mono tnum">50 $</div>
                <div className="text-[10px] text-[#7A7068] font-mono">≈ 137 500 CDF</div>
              </div>
              <button
                type="button"
                onClick={() => handleSelectPass('pass-6-days')}
                className="h-10 px-4 rounded-full bg-[#FF6A2B] hover:bg-[#E24E10] text-[#14110F] font-bold text-xs uppercase tracking-wider transition active:scale-95"
              >
                Réserver
              </button>
            </div>
          </div>

          {/* Card 5: VUKA Cashless & Portefeuille Digital */}
          <div className="p-6 rounded-[24px] bg-[#14110F] text-[#FBF6EE] shadow-level1 hover:shadow-md transition-all flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FFC21A] text-[#14110F] uppercase tracking-wider">
                  Cashless & Sans Contact
                </span>
                <span className="text-[10px] font-bold text-[#FF6A2B] uppercase font-mono">100% Sécurisé</span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#FBF6EE] group-hover:text-[#FFC21A] transition-colors tracking-tight font-heading">
                  Portefeuille VUKA Pay
                </h3>
                <p className="text-xs text-[#D9D0C6] mt-1 line-clamp-2 font-normal">
                  Rechargez en direct par M-Pesa. Réglez vos consommations par bracelet RFID ou QR code dynamique aux 23 stands sans espèces.
                </p>
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-white/10 flex items-center justify-between">
              <span className="text-[11px] font-medium text-[#D9D0C6]">
                Recharge instantanée
              </span>
              <button
                type="button"
                onClick={onExploreStands}
                className="h-10 px-4 rounded-full bg-[#FF6A2B] hover:bg-[#E24E10] text-[#14110F] font-bold text-xs uppercase tracking-wider transition active:scale-95 inline-flex items-center gap-1.5"
              >
                <span>Découvrir</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#14110F]" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
