import React from 'react';
import { Calendar, MapPin, Ticket, ArrowRight, Heart, PlusCircle, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ActivityType } from '../../types';

export const UpcomingEventsSection: React.FC<{ onSelectEventTickets: () => void }> = ({ onSelectEventTickets }) => {
  const { publishedEvents, selectedActivityTypeFilter, openPublishModal } = useApp();

  const filteredEvents = selectedActivityTypeFilter === 'Tous les types' || !selectedActivityTypeFilter
    ? publishedEvents
    : publishedEvents.filter(e => e.activityType === selectedActivityTypeFilter);

  return (
    <section id="evenements" className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-10">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="w-8 h-1 bg-[#FF6A2B] rounded-full mb-3" />
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#14110F] font-heading">
              Les activités équipées par VUKA Pay.
            </h2>
          </div>
          <p className="text-sm text-[#7A7068] max-w-2xl font-normal">
            {selectedActivityTypeFilter && selectedActivityTypeFilter !== 'Tous les types'
              ? `Affichage des activités de catégorie « ${selectedActivityTypeFilter} ». Achetez vos pass sécurisés ou contribuez par Mobile Money.`
              : 'Festivals culturels, concerts géants, conférences et collectes solidaires : réservez vos pass sécurisés et profitez de l\'expérience sans contact.'}
          </p>
        </div>

        {/* Bouton Publier dans la section */}
        <button
          type="button"
          onClick={() => openPublishModal(
            selectedActivityTypeFilter !== 'Tous les types' ? (selectedActivityTypeFilter as ActivityType) : undefined
          )}
          className="inline-flex items-center gap-2 h-11 px-5 rounded-full border border-[#FF6A2B] text-[#FF6A2B] hover:bg-[#FFE3D3] font-bold text-xs sm:text-sm transition active:scale-95 shrink-0 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4 text-[#FF6A2B]" />
          <span>Publier une Activité</span>
        </button>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-[24px] border border-[#D9D0C6] space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#FFE3D3] text-[#FF6A2B] flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[#14110F]">
            Aucune activité pour le filtre « {selectedActivityTypeFilter} »
          </h3>
          <p className="text-xs text-[#7A7068] max-w-md mx-auto">
            Soyez le premier à publier un {selectedActivityTypeFilter} sur la vitrine officielle VUKA Pay.
          </p>
          <button
            type="button"
            onClick={() => openPublishModal(selectedActivityTypeFilter as ActivityType)}
            className="px-6 py-3 rounded-full bg-[#FF6A2B] hover:bg-[#E24E10] text-[#14110F] font-bold text-xs uppercase tracking-wider transition"
          >
            Publier un {selectedActivityTypeFilter}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className={`rounded-[20px] border overflow-hidden flex flex-col justify-between transition-all group ${
                event.isFeatured
                  ? 'bg-white border-[#FF6A2B] shadow-level1 hover:shadow-md'
                  : 'bg-white border-[#D9D0C6] hover:border-[#FF6A2B]/50 shadow-level1 hover:shadow-md'
              }`}
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20" />
                
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[#FBF6EE] border border-white/15">
                    {event.activityType || event.category}
                  </span>
                  {event.isFeatured && (
                    <span className="px-2.5 py-1 rounded-full bg-[#FFC21A] text-[#14110F] text-[10px] font-bold uppercase tracking-wider shadow-sm">
                      En Vedette
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-base sm:text-lg font-bold text-white leading-tight tracking-tight font-heading drop-shadow-sm line-clamp-2">
                    {event.title}
                  </h3>
                </div>
              </div>

              {/* Event Details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5 text-xs text-[#7A7068]">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#FF6A2B] shrink-0" />
                    <span className="font-semibold text-[#14110F] truncate">{event.dateStr}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#7A7068] shrink-0" />
                    <span className="truncate">{event.location} • {event.city}</span>
                  </div>

                  <div className="pt-2 border-t border-[#F3ECE2] flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[#7A7068] uppercase">
                      {event.activityType === 'Donation' ? 'Don Suggéré' : 'Tarif'}
                    </span>
                    <span className="text-sm font-bold text-[#FF6A2B] font-mono tnum">{event.priceFrom}</span>
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={onSelectEventTickets}
                    className="w-full min-h-[44px] h-11 rounded-full bg-[#FF6A2B] hover:bg-[#E24E10] text-[#14110F] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition active:scale-95"
                  >
                    {event.activityType === 'Donation' ? (
                      <>
                        <Heart className="w-3.5 h-3.5 text-[#14110F]" />
                        <span>Faire un Don</span>
                      </>
                    ) : (
                      <>
                        <Ticket className="w-3.5 h-3.5 text-[#14110F]" />
                        <span>{event.ctaText || 'Réserver un Pass'}</span>
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
