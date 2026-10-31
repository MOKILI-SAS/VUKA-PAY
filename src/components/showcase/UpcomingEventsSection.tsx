import React from 'react';
import { 
  Calendar, 
  MapPin, 
  Ticket, 
  ArrowRight, 
  Heart, 
  Filter,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const UpcomingEventsSection: React.FC<{ onSelectEventTickets: () => void }> = ({ onSelectEventTickets }) => {
  const { 
    publishedEvents, 
    selectedActivityTypeFilter, 
    selectedRegionFilter,
    likedEventIds,
    toggleLikeEvent,
    followedOrganizers,
    toggleFollowOrganizer
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

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-2 pb-10">
      
      {/* Grille des Événements — Épurée, Douce pour les yeux et Premium */}
      {filteredEvents.length === 0 ? (
        <div className="p-10 text-center bg-white rounded-2xl border border-[#E5E0D8] space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-full bg-[#FAF8F5] text-[#7A7068] flex items-center justify-center mx-auto">
            <Filter className="w-5 h-5 text-[#FF6A2B]" />
          </div>
          <h3 className="text-base font-bold text-[#14110F]">
            Aucune activité pour ces critères
          </h3>
          <p className="text-xs text-[#7A7068] max-w-md mx-auto">
            {selectedRegionFilter !== 'Toutes les villes' 
              ? `Aucun événement disponible actuellement à ${selectedRegionFilter} dans la catégorie ${selectedActivityTypeFilter}.`
              : `Aucune activité trouvée pour la catégorie « ${selectedActivityTypeFilter} ».`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredEvents.map((event) => {
            const isLiked = likedEventIds.includes(event.id);
            const organizer = event.organizerName || 'Fondation Congolicious';
            const isFollowed = followedOrganizers.includes(organizer);

            return (
              <div
                key={event.id}
                onClick={onSelectEventTickets}
                className="cursor-pointer rounded-2xl border border-[#E5E0D8] hover:border-[#14110F]/30 bg-white shadow-xs hover:shadow-md overflow-hidden flex flex-col justify-between transition-all group"
              >
                {/* 1. Image en vedette avec bouton Like & Tag épuré */}
                <div className="relative h-44 w-full overflow-hidden bg-[#14110F]">
                  <img 
                    src={event.imageUrl || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80'} 
                    alt={event.title}
                    width="400"
                    height="176"
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                  
                  {/* Top Bar sur l'image : Tag catégorie + Bouton Like */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-md text-[#14110F] shadow-xs">
                      {event.activityType}
                    </span>

                    {/* Bouton Like / Favori */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLikeEvent(event.id);
                      }}
                      className="w-8 h-8 rounded-full bg-white/90 hover:bg-white backdrop-blur-md flex items-center justify-center transition shadow-xs active:scale-95 group/heart"
                      title={isLiked ? "Retirer des favoris" : "Ajouter aux favoris"}
                      aria-label="Aimer cet événement"
                    >
                      <Heart 
                        className={`w-4 h-4 transition-colors ${
                          isLiked 
                            ? 'text-[#E11D48] fill-[#E11D48]' 
                            : 'text-[#7A7068] group-hover/heart:text-[#E11D48]'
                        }`} 
                      />
                    </button>
                  </div>
                </div>

                {/* 2. Contenu de la Carte : Titre, Organisateur + Suivre, Date & Lieu */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  
                  <div className="space-y-1.5">
                    {/* Date en évidence */}
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#FF6A2B]">
                      <Calendar className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{event.dateStr}</span>
                    </div>

                    {/* Titre de l'événement */}
                    <h3 className="text-sm sm:text-base font-bold text-[#14110F] group-hover:text-[#FF6A2B] transition-colors leading-snug line-clamp-2 font-heading">
                      {event.title}
                    </h3>

                    {/* Organisateur + Bouton S'abonner Subtil */}
                    <div className="flex items-center justify-between text-xs text-[#7A7068] pt-1">
                      <span className="truncate pr-1">
                        Par <strong className="text-[#14110F] font-semibold">{organizer}</strong>
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFollowOrganizer(organizer);
                        }}
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full transition shrink-0 ${
                          isFollowed 
                            ? 'bg-[#E2F3E9] text-[#166534] border border-[#166534]/20' 
                            : 'bg-[#FAF8F5] hover:bg-[#F3ECE2] text-[#4A433D] border border-[#D9D0C6]'
                        }`}
                        title={isFollowed ? `Abonné à ${organizer}` : `S'abonner aux événements de ${organizer}`}
                      >
                        {isFollowed ? 'Abonné' : '+ Suivre'}
                      </button>
                    </div>

                    {/* Lieu et ville */}
                    <div className="flex items-center gap-1.5 text-xs text-[#7A7068] pt-0.5">
                      <MapPin className="w-3 h-3 text-[#7A7068] shrink-0" />
                      <span className="truncate">{event.location} • {event.city}</span>
                    </div>
                  </div>

                  {/* 3. Pied de Carte : Tarif & Bouton CTA discret et élégant */}
                  <div className="pt-2.5 border-t border-[#F3ECE2] flex items-center justify-between gap-2">
                    <div>
                      <div className="text-[10px] uppercase font-semibold text-[#7A7068]">
                        {event.activityType === 'É-vote' 
                          ? 'Participation' 
                          : (event.activityType === 'Donation' ? 'Don dès' : 'Tarif dès')}
                      </div>
                      <div className="text-xs sm:text-sm font-bold text-[#14110F] font-mono">
                        {event.priceFrom}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectEventTickets();
                      }}
                      className="h-8 px-3.5 rounded-full bg-[#14110F] hover:bg-[#FF6A2B] text-white hover:text-[#14110F] font-bold text-xs transition-all active:scale-95 flex items-center gap-1.5 shrink-0 shadow-xs"
                    >
                      <span>
                        {event.activityType === 'É-vote' 
                          ? 'Voter' 
                          : (event.activityType === 'Donation' ? 'Donner' : 'Réserver')}
                      </span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

    </section>
  );
};
