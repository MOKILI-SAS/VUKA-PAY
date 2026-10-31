import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  MapPin,
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

  const featuredEvents: VukaPublishedEvent[] = publishedEvents.length > 0 
    ? publishedEvents.filter(e => e.isFeatured)
    : [];

  const activeEvents = featuredEvents.length > 0 ? featuredEvents : publishedEvents;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Rotation automatique en boucle (6 secondes)
  useEffect(() => {
    if (activeEvents.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeEvents.length);
    }, 6000);

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

  const handleCtaClick = () => {
    if (currentEvent?.id === 'cfw-6') {
      const found = tickets.find(t => t.id === 'pass-6-days') || tickets[0];
      if (onSelectTicket && found) {
        onSelectTicket(found);
      } else {
        onExploreTickets();
      }
    } else {
      const el = document.getElementById('evenements');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        onExploreTickets();
      }
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-3 pb-4">
      
      {/* HERO BANNER ÉPURÉ & ULTRA-SIMPLE — Inspiré du modèle Eventbrite (Capture 1) */}
      <div 
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="relative w-full overflow-hidden rounded-[24px] sm:rounded-[32px] bg-[#14110F] text-[#FBF6EE] shadow-level2 group min-h-[380px] sm:min-h-[440px] lg:min-h-[480px] flex flex-col justify-between"
      >
        {/* Photo de fond immersive avec éclairage scénique / festival */}
        {currentEvent?.imageUrl && (
          <div 
            key={currentEvent.id}
            className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-out scale-100 group-hover:scale-105 opacity-45 pointer-events-none"
            style={{ backgroundImage: `url(${currentEvent.imageUrl})` }}
          />
        )}

        {/* Dégradés d'ombrage pour lisibilité optimale du texte et du CTA */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent pointer-events-none" />

        {/* Top Header : Tag de catégorie discret et flèches de navigation discrètes */}
        <div className="relative z-10 p-6 sm:p-8 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-[#FBF6EE] text-[11px] font-bold uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFC21A]" />
            {currentEvent?.badge || currentEvent?.activityType?.toUpperCase() || 'À L\'AFFICHE'}
          </span>

          {/* Navigation manuelle discrète */}
          <div className="flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Événement précédent"
              className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-md transition active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Événement suivant"
              className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-md transition active:scale-95"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Centre / Bas : Titre percutant, sous-titre clair et unique bouton CTA sobre */}
        <div className="relative z-10 p-6 sm:p-10 max-w-3xl space-y-4">
          
          <div className="flex items-center gap-2 text-xs font-medium text-[#FFC21A]">
            <Calendar className="w-3.5 h-3.5" />
            <span>{currentEvent?.dateStr}</span>
            <span>•</span>
            <MapPin className="w-3.5 h-3.5 text-[#FF6A2B]" />
            <span>{currentEvent?.location} ({currentEvent?.city})</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.08] font-heading drop-shadow-sm">
            {currentEvent?.title}
          </h1>

          {currentEvent?.subtitle && (
            <p className="text-base sm:text-xl text-[#F3ECE2] font-medium leading-relaxed max-w-2xl drop-shadow-sm">
              {currentEvent.subtitle}
            </p>
          )}

          {/* Bouton CTA Unique & Épuré (Style Eventbrite) */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleCtaClick}
              className="h-12 px-8 rounded-full bg-white hover:bg-[#F3ECE2] text-[#14110F] font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center gap-2.5 active:scale-95"
            >
              <span>{currentEvent?.ctaText || 'Découvrir l\'événement'}</span>
              <ArrowRight className="w-4 h-4 text-[#14110F]" />
            </button>
          </div>

        </div>

        {/* Barre de Progression / Indicateurs en bas */}
        <div className="relative z-10 px-6 sm:px-10 pb-6 flex items-center gap-1.5">
          {activeEvents.map((evt, idx) => (
            <button
              key={evt.id}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`h-1 rounded-full transition-all duration-300 ${
                idx === currentIndex 
                  ? 'w-7 bg-white' 
                  : 'w-2 bg-white/30 hover:bg-white/60'
              }`}
              aria-label={`Aller à ${evt.title}`}
            />
          ))}
        </div>

      </div>

    </div>
  );
};
