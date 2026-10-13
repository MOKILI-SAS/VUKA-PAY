import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Flame, Sparkles, Utensils, Music, Users, Crown, ArrowRight } from 'lucide-react';

interface ZoneItem {
  id: string;
  name: string;
  subtitle: string;
  badge: string;
  standsCount: string;
  icon: React.ReactNode;
  bgGradient: string;
}

const ZONES: ZoneItem[] = [
  {
    id: 'zone-braises',
    name: 'L’Allée des Grillades & Braises',
    subtitle: 'Maboké de capitaine, travers de porc & poulet fumé',
    badge: '10 Stands Maîtres Rôtisseurs',
    standsCount: '10 Stands',
    icon: <Flame className="w-8 h-8 text-[#FF6A2B]" />,
    bgGradient: 'from-[#FF6A2B] via-orange-900 to-[#14110F]',
  },
  {
    id: 'zone-streetfood',
    name: 'Street-Food & Saveurs Locales',
    subtitle: 'Mikate dorés, brochettes kamundele, bananes pesées',
    badge: '6 Stands Express',
    standsCount: '6 Stands',
    icon: <Utensils className="w-8 h-8 text-[#FFC21A]" />,
    bgGradient: 'from-amber-600 via-amber-900 to-[#14110F]',
  },
  {
    id: 'zone-vip',
    name: 'Village VIP & Lounge Partenaires',
    subtitle: 'Espace lounge climatisé, buffet privé & cocktails prestige',
    badge: 'Accès Pass VIP',
    standsCount: 'Espace Privé',
    icon: <Crown className="w-8 h-8 text-[#FFC21A]" />,
    bgGradient: 'from-[#14110F] via-slate-900 to-black',
  },
  {
    id: 'zone-agora',
    name: 'Scène Live & Agora Musicale',
    subtitle: 'Concerts rumba congolaise, DJ sets & animations live',
    badge: 'Concerts Quotidiens',
    standsCount: 'Grande Scène',
    icon: <Music className="w-8 h-8 text-[#0E5A8A]" />,
    bgGradient: 'from-[#0E5A8A] via-slate-900 to-[#14110F]',
  },
  {
    id: 'zone-famille',
    name: 'Espace Famille & Dégustations',
    subtitle: 'Ateliers mini-chefs, jeux ludiques & cantine solidaire',
    badge: 'Tout Public',
    standsCount: 'Espace Détente',
    icon: <Users className="w-8 h-8 text-[#FF6A2B]" />,
    bgGradient: 'from-[#FF6A2B]/80 via-rose-950 to-[#14110F]',
  },
];

interface FestivalZonesProps {
  onSelectZone?: (zone: ZoneItem) => void;
}

export const FestivalZones: React.FC<FestivalZonesProps> = ({ onSelectZone }) => {
  const zonesScrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (zonesScrollRef.current) {
      zonesScrollRef.current.scrollBy({ left: -280, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (zonesScrollRef.current) {
      zonesScrollRef.current.scrollBy({ left: 280, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="w-6 h-1 bg-[#FF6A2B] rounded-full mb-1.5" />
          <h2 className="text-xl sm:text-2xl font-bold text-[#14110F] uppercase tracking-tight font-heading">
            Les Zones du Festival
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-block text-xs font-semibold text-[#7A7068]">
            Académie des Beaux-Arts • 5 Zones
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={scrollLeft}
              aria-label="Zone précédente"
              className="w-9 h-9 rounded-full border border-[#D9D0C6] hover:border-[#FF6A2B] hover:bg-[#FFE3D3] text-[#14110F] hover:text-[#FF6A2B] flex items-center justify-center transition shadow-sm active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={scrollRight}
              aria-label="Zone suivante"
              className="w-9 h-9 rounded-full border border-[#D9D0C6] hover:border-[#FF6A2B] hover:bg-[#FFE3D3] text-[#14110F] hover:text-[#FF6A2B] flex items-center justify-center transition shadow-sm active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Cards Scrollable */}
      <div
        ref={zonesScrollRef}
        className="flex items-stretch gap-4 overflow-x-auto pb-4 pt-1 no-scrollbar scroll-smooth"
      >
        {ZONES.map((zone) => (
          <div
            key={zone.id}
            onClick={() => onSelectZone && onSelectZone(zone)}
            className="min-w-[240px] sm:min-w-[260px] max-w-[260px] rounded-[20px] bg-white border border-[#D9D0C6] shadow-level1 hover:shadow-md hover:border-[#FF6A2B] transition-all cursor-pointer group flex flex-col justify-between overflow-hidden"
          >
            {/* Visual Header */}
            <div className={`h-36 bg-gradient-to-br ${zone.bgGradient} p-5 relative flex flex-col justify-between text-white overflow-hidden`}>
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-[#FFC21A] uppercase">
                  {zone.standsCount}
                </span>

                <div className="transform group-hover:scale-110 transition-transform">
                  {zone.icon}
                </div>
              </div>

              <div className="relative z-10">
                <span className="text-[10px] text-white/80 font-mono">Zone Thématique</span>
              </div>
            </div>

            {/* Info Body */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#14110F] group-hover:text-[#FF6A2B] transition-colors leading-snug font-heading">
                  {zone.name}
                </h3>
                <p className="text-xs text-[#7A7068] mt-1 line-clamp-2">
                  {zone.subtitle}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-[#F3ECE2] flex items-center justify-between text-xs font-bold text-[#FF6A2B]">
                <span>Explorer la zone</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
