import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

interface TrendingItem {
  id: string;
  name: string;
  category: string;
  badge?: string;
  imageUrl: string;
  subtitle: string;
}

const TRENDING_ITEMS: TrendingItem[] = [
  {
    id: 'chef-christian',
    name: 'Chef Christian & Braises de Kin',
    category: 'GASTRONOMIE & GRILLADES',
    badge: 'Tendance #1',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    subtitle: 'Maboké de capitaine & brochettes géantes',
  },
  {
    id: 'malewa-chic',
    name: 'Grillades Malewa Chic',
    category: 'STREET-FOOD KINSHASA',
    badge: 'Coup de Cœur',
    imageUrl: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=600&q=80',
    subtitle: 'Poulet bicyclette braisé & bananes pesées',
  },
  {
    id: 'concert-fally',
    name: 'Fally Ipupa & Invités d’Honneur',
    category: 'CONCERT LIVE SAMEDI 26',
    badge: 'Tête d’Affiche',
    imageUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=600&q=80',
    subtitle: 'Grand show exclusif sous les étoiles',
  },
  {
    id: 'mama-kin',
    name: 'Mama Kinshasa Authentic Buffet',
    category: 'TRADITIONNEL & TERROIR',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
    subtitle: 'Pondu royal, fumbwa & mikate chauds',
  },
  {
    id: 'cocktails-mikili',
    name: 'Cocktails Mikili & Juice Bar',
    category: 'MIXOLOGIE & DRINKS',
    badge: 'Bar Central',
    imageUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=600&q=80',
    subtitle: 'Tangawisi bio, bissap givré & mojitos',
  },
  {
    id: 'tacos-kongo',
    name: 'Tacos Kongo & Fusion Gourmande',
    category: 'CUISINE DU MONDE',
    imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80',
    subtitle: 'Tacos chèvre braisée & sauces piment doux',
  },
];

interface TrendingSearchesProps {
  onSelectItem?: (item: TrendingItem) => void;
}

export const TrendingSearches: React.FC<TrendingSearchesProps> = ({ onSelectItem }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-4">
      {/* Header with Title and Arrow Buttons */}
      <div className="flex items-center justify-between">
        <div>
          <div className="w-6 h-1 bg-[#FF6A2B] rounded-full mb-1.5" />
          <h2 className="text-xl sm:text-2xl font-bold text-[#14110F] uppercase tracking-tight font-heading">
            Recherches Populaires
          </h2>
        </div>

        {/* Carousel Arrow Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={scrollLeft}
            aria-label="Défiler vers la gauche"
            className="w-9 h-9 rounded-full border border-[#D9D0C6] hover:border-[#FF6A2B] hover:bg-[#FFE3D3] text-[#14110F] hover:text-[#FF6A2B] flex items-center justify-center transition shadow-sm active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={scrollRight}
            aria-label="Défiler vers la droite"
            className="w-9 h-9 rounded-full border border-[#D9D0C6] hover:border-[#FF6A2B] hover:bg-[#FFE3D3] text-[#14110F] hover:text-[#FF6A2B] flex items-center justify-center transition shadow-sm active:scale-95"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className="flex items-stretch gap-4 overflow-x-auto pb-4 pt-1 no-scrollbar scroll-smooth"
      >
        {TRENDING_ITEMS.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectItem && onSelectItem(item)}
            className="min-w-[260px] sm:min-w-[280px] max-w-[280px] bg-white rounded-[16px] border border-[#D9D0C6] shadow-level1 hover:shadow-md hover:border-[#FF6A2B] transition-all cursor-pointer group flex flex-col justify-between overflow-hidden"
          >
            {/* Visual Header avec image représentative */}
            <div className="h-32 relative overflow-hidden bg-[#14110F]">
              <img 
                src={item.imageUrl} 
                alt={item.name}
                width="280"
                height="128"
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {item.badge && (
                <span className="absolute top-2.5 right-2.5 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FFC21A] text-[#14110F] shadow-xs">
                  {item.badge}
                </span>
              )}
            </div>

            {/* Info Body */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#7A7068] uppercase tracking-wider block mb-1">
                  {item.category}
                </span>
                <h3 className="text-sm font-bold text-[#14110F] group-hover:text-[#FF6A2B] transition-colors leading-snug font-heading">
                  {item.name}
                </h3>
                <p className="text-xs text-[#7A7068] mt-1 line-clamp-1">
                  {item.subtitle}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-[#F3ECE2] flex items-center justify-between text-xs font-bold text-[#FF6A2B]">
                <span>Découvrir la carte</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
