import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Ticket, 
  Heart, 
  Utensils, 
  Calendar,
  ChevronLeft,
  ChevronRight,
  MapPin,
  ShieldCheck,
  Building2,
  Sparkles
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

  // Filtrer les événements mis en avant
  const featuredEvents: VukaPublishedEvent[] = publishedEvents.length > 0 
    ? publishedEvents.filter(e => e.isFeatured)
    : [];

  const activeEvents = featuredEvents.length > 0 ? featuredEvents : publishedEvents;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Rotation automatique en boucle (5.5 secondes)
  useEffect(() => {
    if (activeEvents.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeEvents.length);
    }, 5500);

    return () => clearInterval(interval);
  }, [activeEvents.length, isPaused]);

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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-2 pb-6">
      
      {/* Platform Context Header Bar — Épuré & Sobre */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3 px-1 text-xs text-[#7A7068]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FF6A2B]" />
          <span className="font-semibold uppercase tracking-wider text-[#14110F]">
            Billetterie & Cashless VUKA Pay
          </span>
          <span className="text-[#D9D0C6]">•</span>
          <span>Activités & Campagnes Officielles</span>
        </div>
        <div className="flex items-center gap-1.5 font-medium">
          <Building2 className="w-3.5 h-3.5 text-[#7A7068]" />
          <span>Partenaire Officiel : {currentEvent?.organizerName || 'Fondation Congolicious'}</span>
        </div>
      </div>

      {/* MINI-HERO PLEINE LARGEUR — Inspiré de Tickera, Weezevent, Somba Ticket */}
      <div 
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="relative w-full overflow-hidden rounded-[28px] bg-[#14110F] text-[#FBF6EE] shadow-level2 group border border-black/10 min-h-[460px] sm:min-h-[500px] flex flex-col justify-between"
      >
        {/* Background Image avec fondu sombre haute lisibilité */}
        {currentEvent?.imageUrl && (
          <div 
            key={currentEvent.id}
            className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-out scale-105 group-hover:scale-100 opacity-25 pointer-events-none"
            style={{ backgroundImage: `url(${currentEvent.imageUrl})` }}
          />
        )}

        {/* Ambient Warm Vignette & Overlays */}
        <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-[#FF6A2B]/10 blur-3xl pointer-events-none" />
        <div className="absolute right-12 bottom-10 w-80 h-80 rounded-full bg-[#FFC21A]/5 blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#14110F] via-[#14110F]/90 to-[#14110F]/70 pointer-events-none" />

        {/* TOP BAR : Badges contextuels & Contrôles du Slider */}
        <div className="relative z-10 p-6 sm:p-8 pb-0 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[#FBF6EE] text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFC21A]" />
              {currentEvent?.badge || 'ACTIVITÉ EN VEDETTE'}
            </span>

            {currentEvent?.activityType && (
              <span className="px-3 py-1 rounded-full bg-[#FF6A2B]/20 border border-[#FF6A2B]/40 text-[#FF6A2B] text-[11px] font-bold uppercase tracking-wider">
                {currentEvent.activityType}
              </span>
            )}
          </div>

          {/* Navigation manuelle sobre */}
          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-2 py-1 rounded-full border border-white/10">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Activité précédente"
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-[#FF6A2B] text-[#FBF6EE] hover:text-[#14110F] flex items-center justify-center transition active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-mono font-bold text-[#FFC21A] px-1.5">
              {currentIndex + 1} / {activeEvents.length}
            </span>
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

        {/* CORPS PRINCIPAL : Grille responsive (Contenu éditorial à gauche + Image en vedette à droite) */}
        <div className="relative z-10 px-6 sm:px-10 py-6 sm:py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Colonne Gauche : Titre, Description, Métriques */}
          <div key={currentEvent?.id} className="lg:col-span-7 space-y-4 animate-in fade-in duration-300">
            
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#FFC21A] font-medium">
              <span className="flex items-center gap-1.5 bg-black/30 px-3 py-1 rounded-full border border-white/10">
                <Calendar className="w-3.5 h-3.5 text-[#FFC21A]" />
                <span>{currentEvent?.dateStr}</span>
              </span>
              <span className="flex items-center gap-1.5 bg-black/30 px-3 py-1 rounded-full border border-white/10">
                <MapPin className="w-3.5 h-3.5 text-[#FF6A2B]" />
                <span>{currentEvent?.location} • {currentEvent?.city}</span>
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-[#FBF6EE] leading-[1.1] tracking-tight font-heading">
              {currentEvent?.title}
              {currentEvent?.subtitle && (
                <span className="block text-[#FF6A2B] mt-1.5 text-xl sm:text-3xl font-semibold">
                  {currentEvent.subtitle}
                </span>
              )}
            </h1>

            <p className="text-sm sm:text-base text-[#D9D0C6] max-w-2xl font-normal leading-relaxed">
              {currentEvent?.description || 'Réservez vos places officielles en toute sécurité ou soutenez les initiatives solidaires avec VUKA Pay.'}
            </p>

            {/* Métriques / Atouts de l'activité */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              {currentEvent?.metrics ? (
                currentEvent.metrics.map((m, idx) => (
                  <div 
                    key={idx}
                    className="px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs text-[#FBF6EE] font-semibold flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFC21A]" />
                    <span>{m.label} : <strong className="text-white">{m.value}</strong></span>
                  </div>
                ))
              ) : (
                <div className="px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs text-[#FBF6EE] font-semibold flex items-center gap-2">
                  <Utensils className="w-3.5 h-3.5 text-[#FFC21A]" />
                  <span>{currentEvent?.category}</span>
                </div>
              )}
            </div>

            {/* CTAs d'action */}
            <div className="pt-3 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => handleSelectPass()}
                className="min-h-[48px] h-12 px-7 rounded-full bg-[#FF6A2B] hover:bg-[#E24E10] text-[#14110F] font-bold text-xs sm:text-sm uppercase tracking-wider shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2.5 active:scale-95"
              >
                <Ticket className="w-4 h-4 text-[#14110F]" />
                <span>{currentEvent?.ctaText || 'Participer / Réserver'}</span>
                <ArrowRight className="w-4 h-4 text-[#14110F]" />
              </button>

              {currentEvent?.id === 'cfw-6' && (
                <button
                  type="button"
                  onClick={onExploreStands}
                  className="min-h-[48px] h-12 px-6 rounded-full bg-white/10 hover:bg-white/20 text-[#FBF6EE] font-semibold text-xs sm:text-sm border border-white/20 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <Utensils className="w-4 h-4 text-[#FFC21A]" />
                  <span>Explorer les 23 Stands</span>
                </button>
              )}
            </div>

          </div>

          {/* Colonne Droite : Affiche visuelle & Carte Tarif */}
          <div className="lg:col-span-5 hidden sm:block">
            <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-white/5 backdrop-blur-md p-4 shadow-xl group/card">
              {/* Image en vedette avec liseré sobre */}
              <div className="relative h-60 sm:h-72 w-full rounded-xl overflow-hidden bg-black/40">
                <img 
                  src={currentEvent?.imageUrl || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80'} 
                  alt={currentEvent?.title || 'Activité VUKA'}
                  width="600"
                  height="300"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Pill tarif en surimpression */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-white px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20">
                    {currentEvent?.priceFrom}
                  </span>
                  <span className="text-[11px] font-semibold text-[#FFC21A] flex items-center gap-1 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#FFC21A]" />
                    Paiement M-Pesa Sécurisé
                  </span>
                </div>
              </div>

              {/* Titre & Ville sous l'image */}
              <div className="mt-3 flex items-center justify-between text-xs text-[#D9D0C6]">
                <span className="font-semibold text-white truncate pr-2">{currentEvent?.title}</span>
                <span className="font-mono text-[#FFC21A] shrink-0">{currentEvent?.city}</span>
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM BAR : Pagination Dots */}
        <div className="relative z-10 px-6 sm:px-10 pb-6 pt-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {activeEvents.map((evt, idx) => (
              <button
                key={evt.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex 
                    ? 'w-8 bg-[#FF6A2B]' 
                    : 'w-2 bg-white/25 hover:bg-white/60'
                }`}
                aria-label={`Aller à ${evt.title}`}
                title={evt.title}
              />
            ))}
          </div>

          <div className="text-[11px] text-[#7A7068] font-mono hidden sm:block">
            Défilement automatique • {currentIndex + 1} sur {activeEvents.length}
          </div>
        </div>

      </div>
    </div>
  );
};
