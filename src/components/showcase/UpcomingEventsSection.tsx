import React from 'react';
import { Calendar, MapPin, Ticket, ArrowRight, Heart, PlusCircle, Sparkles, Filter } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ActivityType } from '../../types';

export const UpcomingEventsSection: React.FC<{ onSelectEventTickets: () => void }> = ({ onSelectEventTickets }) => {
  const { 
    publishedEvents, 
    selectedActivityTypeFilter, 
    selectedRegionFilter,
    openPublishModal,
    currentUser,
    setIsAuthModalOpen,
    setAuthModalMode
  } = useApp();

  const filteredEvents = publishedEvents.filter(event => {
    // 1. Filtre par type
    const matchesType = !selectedActivityTypeFilter || 
      selectedActivityTypeFilter === 'Tous les types' || 
      event.activityType === selectedActivityTypeFilter;

    // 2. Filtre par région/ville
    const matchesRegion = !selectedRegionFilter || 
      selectedRegionFilter === 'Toutes les villes' || 
      event.city.toLowerCase().includes(selectedRegionFilter.toLowerCase());

    return matchesType && matchesRegion;
  });

  const handlePublishClick = () => {
    if (!currentUser) {
      setAuthModalMode('LOGIN');
      setIsAuthModalOpen(true);
    } else {
      openPublishModal(
        selectedActivityTypeFilter !== 'Tous les types' ? (selectedActivityTypeFilter as ActivityType) : undefined
      );
    }
  };

  return (
    <section id="evenements" className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Header Section — Sobre et épuré */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <div className="w-6 h-1 bg-[#FF6A2B] rounded-full mb-2.5" />
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#14110F] font-heading">
            Activités officielles VUKA Pay.
          </h2>
          <p className="text-xs sm:text-sm text-[#7A7068] max-w-2xl font-normal mt-1">
            {selectedActivityTypeFilter !== 'Tous les types' || selectedRegionFilter !== 'Toutes les villes'
              ? `Filtres appliqués : ${selectedActivityTypeFilter !== 'Tous les types' ? selectedActivityTypeFilter : 'Tous types'}${selectedRegionFilter !== 'Toutes les villes' ? ` à ${selectedRegionFilter}` : ''}.`
              : 'Billetterie officielle, concerts live, conférences et collectes solidaires avec paiement sécurisé par Mobile Money.'}
          </p>
        </div>

        {/* Bouton Publier dans la section */}
        <button
          type="button"
          onClick={handlePublishClick}
          className="inline-flex items-center gap-2 h-10 px-4 rounded-full border border-[#D9D0C6] hover:border-[#14110F] bg-white hover:bg-[#FAF8F5] text-[#14110F] font-semibold text-xs transition active:scale-95 shrink-0 self-start sm:self-auto shadow-xs"
        >
          <PlusCircle className="w-3.5 h-3.5 text-[#FF6A2B]" />
          <span>Publier une Activité</span>
        </button>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="p-10 text-center bg-white rounded-2xl border border-[#E5E0D8] space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-full bg-[#FAF8F5] text-[#7A7068] flex items-center justify-center mx-auto">
            <Filter className="w-5 h-5 text-[#FF6A2B]" />
          </div>
          <h3 className="text-base font-bold text-[#14110F]">
            Aucune activité ne correspond à vos critères
          </h3>
          <p className="text-xs text-[#7A7068] max-w-md mx-auto">
            {selectedRegionFilter !== 'Toutes les villes' 
              ? `Aucune activité trouvée à ${selectedRegionFilter} pour le type ${selectedActivityTypeFilter}.`
              : `Aucune activité pour le filtre « ${selectedActivityTypeFilter} » pour l'instant.`}
          </p>
          <button
            type="button"
            onClick={handlePublishClick}
            className="px-5 py-2.5 rounded-full bg-[#14110F] hover:bg-[#2A2420] text-[#FBF6EE] font-bold text-xs uppercase tracking-wider transition active:scale-95"
          >
            Publier une activité ici
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="rounded-2xl border border-[#E5E0D8] hover:border-[#14110F]/30 bg-white shadow-xs hover:shadow-md overflow-hidden flex flex-col justify-between transition-all group"
            >
              {/* Image représentative de l'événement */}
              <div className="relative h-44 w-full overflow-hidden bg-[#14110F]">
                <img 
                  src={event.imageUrl || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80'} 
                  alt={event.title}
                  width="400"
                  height="176"
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[#FBF6EE] border border-white/15">
                    {event.activityType || event.category}
                  </span>
                  {event.isFeatured && (
                    <span className="px-2 py-0.5 rounded-full bg-white/90 text-[#14110F] text-[10px] font-bold uppercase tracking-wider shadow-xs">
                      En Vedette
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-base font-bold text-white leading-tight tracking-tight font-heading drop-shadow-sm line-clamp-2">
                    {event.title}
                  </h3>
                </div>
              </div>

              {/* Event Details */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2 text-xs text-[#7A7068]">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#FF6A2B] shrink-0" />
                    <span className="font-semibold text-[#14110F] truncate">{event.dateStr}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#7A7068] shrink-0" />
                    <span className="truncate">{event.location} • <strong className="text-[#14110F]">{event.city}</strong></span>
                  </div>

                  <div className="pt-2 border-t border-[#F3ECE2] flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-[#7A7068] uppercase">
                      {event.activityType === 'Donation' ? 'Don Recommandé' : 'Tarif dès'}
                    </span>
                    <span className="text-xs font-bold text-[#14110F] font-mono tnum">{event.priceFrom}</span>
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={onSelectEventTickets}
                    className="w-full min-h-[40px] h-10 rounded-full bg-[#FF6A2B] hover:bg-[#E24E10] text-[#14110F] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition active:scale-95"
                  >
                    {event.activityType === 'Donation' ? (
                      <>
                        <Heart className="w-3.5 h-3.5 text-[#14110F]" />
                        <span>Faire un Don</span>
                      </>
                    ) : (
                      <>
                        <Ticket className="w-3.5 h-3.5 text-[#14110F]" />
                        <span>{event.ctaText || 'Réserver'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </section>
  );
};
