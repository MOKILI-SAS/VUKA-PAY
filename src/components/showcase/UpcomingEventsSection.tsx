import React from 'react';
import { Calendar, MapPin, Ticket, ArrowRight, PlusCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const UpcomingEventsSection: React.FC<{ onSelectEventTickets: () => void }> = ({ onSelectEventTickets }) => {
  const { publishedEvents, openOrganizerLogin } = useApp();

  return (
    <section id="evenements" className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-10">
      
      {/* Header Section (Sans le badge Catalogue Multi-Événements) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#14110F] font-heading">
            Les grands événements équipés par VUKA Pay.
          </h2>
          <p className="text-sm text-[#7A7068] mt-1 max-w-2xl font-normal">
            Festivals culturels, concerts géants ou sommets professionnels : achetez vos billets sécurisés et profitez de l'expérience cashless sans contact.
          </p>
        </div>

        <button
          onClick={openOrganizerLogin}
          className="inline-flex items-center gap-2 h-11 px-5 rounded-full border border-[#FF6A2B] text-[#FF6A2B] hover:bg-[#FFE3D3] font-bold text-xs sm:text-sm transition active:scale-95 shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-[#FF6A2B]" />
          <span>Organisateurs : Publier un événement</span>
        </button>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {publishedEvents.map((event, idx) => (
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
              
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[#FBF6EE] border border-white/15">
                  {event.category}
                </span>
                {event.isFeatured && (
                  <span className="px-2.5 py-1 rounded-full bg-[#FFC21A] text-[#14110F] text-[10px] font-bold uppercase tracking-wider shadow-sm">
                    Vedette CFW6
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
                  <span className="font-semibold text-[#14110F]">{event.dateStr}</span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#7A7068] shrink-0" />
                  <span className="truncate">{event.location} • {event.city}</span>
                </div>

                <div className="pt-2 border-t border-[#F3ECE2] flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#7A7068] uppercase">Tarif</span>
                  <span className="text-sm font-bold text-[#FF6A2B] font-mono tnum">{event.priceFrom}</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                {event.id === 'cfw-6' ? (
                  <button
                    onClick={onSelectEventTickets}
                    className="w-full h-10 rounded-full bg-[#FF6A2B] hover:bg-[#E24E10] text-[#14110F] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition active:scale-95"
                  >
                    <Ticket className="w-3.5 h-3.5 text-[#14110F]" />
                    <span>Acheter des Billets</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (event.status === 'OPEN') {
                        onSelectEventTickets();
                      } else {
                        alert(`La billetterie pour ${event.title} sera ouverte prochainement sur VUKA Pay.`);
                      }
                    }}
                    className="w-full h-10 rounded-full bg-[#F3ECE2] hover:bg-[#D9D0C6] text-[#14110F] font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition active:scale-95"
                  >
                    <span>{event.status === 'OPEN' ? 'Voir l’événement' : 'Recevoir une alerte'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};
