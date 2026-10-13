import React from 'react';
import { Calendar, MapPin, Ticket, ArrowRight, Utensils, Laptop, Users, Music, PlusCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const UpcomingEventsSection: React.FC<{ onSelectEventTickets: () => void }> = ({ onSelectEventTickets }) => {
  const { publishedEvents, openOrganizerLogin } = useApp();

  const getEventIcon = (category: string) => {
    if (category.includes('GASTRONOMIE')) return <Utensils className="w-5 h-5 text-[#FFC21A]" />;
    if (category.includes('INNOVATION')) return <Laptop className="w-5 h-5 text-amber-400" />;
    if (category.includes('CONCERT') || category.includes('FESTIVAL')) return <Music className="w-5 h-5 text-cyan-400" />;
    return <Users className="w-5 h-5 text-[#FFC21A]" />;
  };

  const getEventGradient = (idx: number, isFeatured?: boolean) => {
    if (isFeatured) return 'from-[#FF6A2B] via-orange-950 to-[#14110F]';
    const gradients = [
      'from-purple-900 to-slate-900',
      'from-amber-900 to-slate-900',
      'from-slate-800 to-slate-950',
      'from-[#0E5A8A] to-[#14110F]'
    ];
    return gradients[idx % gradients.length];
  };

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
            {/* Top Color Banner */}
            <div className={`p-5 bg-gradient-to-br ${getEventGradient(idx, event.isFeatured)} text-white relative`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20">
                  {event.category}
                </span>
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  {getEventIcon(event.category)}
                </div>
              </div>

              <h3 className="text-lg font-bold text-white leading-snug tracking-tight font-heading">
                {event.title}
              </h3>

              {event.isFeatured && (
                <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFC21A] text-[#14110F] text-[10px] font-bold uppercase tracking-wider">
                  <span>Partenaire Officiel CFW6</span>
                </div>
              )}
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
