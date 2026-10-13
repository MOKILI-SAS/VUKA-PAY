import React, { useRef } from 'react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  CreditCard, 
  Heart, 
  ShieldCheck, 
  ArrowRight,
  Flame,
  Award,
  Zap
} from 'lucide-react';

interface FestivalDay {
  id: string;
  dayName: string;
  dateStr: string;
  timeStr: string;
  statusBadge: string;
  title: string;
  description: string;
  highlight: string;
  location: string;
  ticketPrice: string;
}

const FESTIVAL_DAYS: FestivalDay[] = [
  {
    id: 'day-1',
    dayName: 'Mardi 22 Septembre',
    dateStr: '22 Sept. 2026',
    timeStr: '12h00 – 23h00',
    statusBadge: 'J-1 OUVERTURE',
    title: 'Grande Cérémonie d’Ouverture & Dégustation des 23 Chefs',
    description: 'Inauguration officielle, ruban inaugural, cocktail des ambassadeurs et banquet d’ouverture.',
    highlight: 'Présentation des 23 stands gastronomiques',
    location: 'Académie des Beaux-Arts • Kinshasa, Gombe',
    ticketPrice: '5 $ (13 750 CDF)',
  },
  {
    id: 'day-2',
    dayName: 'Mercredi 23 Septembre',
    dateStr: '23 Sept. 2026',
    timeStr: '14h00 – 23h30',
    statusBadge: 'BATTLE BARBECUE',
    title: 'Le Grand Championnat des Grillades & Braises de Kin',
    description: 'Duel au sommet entre les 10 meilleurs maîtres grillardiers de la capitale. Dégustations ouvertes au public.',
    highlight: 'Maboké de capitaine & travers de porc fumés',
    location: 'Allée des Braises • Académie des Beaux-Arts',
    ticketPrice: '5 $ (13 750 CDF)',
  },
  {
    id: 'day-3',
    dayName: 'Vendredi 25 Septembre',
    dateStr: '25 Sept. 2026',
    timeStr: '16h00 – 01h00',
    statusBadge: 'NOCTURNE GOURMANDE',
    title: 'Soirée Rumba Étoilée & Street-Food Kinshasa',
    description: 'Live acoustique rumba congolaise, dégustation de pondu royal, fumbwa et street-food nocturne.',
    highlight: 'Showcase Live Rumba & Mixologie Mikili',
    location: 'Scène Principale & Allée Street-Food',
    ticketPrice: '5 $ (13 750 CDF)',
  },
  {
    id: 'day-4',
    dayName: 'Samedi 26 Septembre',
    dateStr: '26 Sept. 2026',
    timeStr: '12h00 – 02h00',
    statusBadge: 'CLIMAX FESTIVAL',
    title: 'Le Méga Concert Festif & Nuit des Saveurs',
    description: 'La plus grande journée du festival. Plus de 15 000 festivaliers attendus, show pyrotechnique et invités de renom.',
    highlight: 'Concert d’anthologie sous les étoiles',
    location: 'Grande Scène & Agora du Festival',
    ticketPrice: '5 $ (13 750 CDF)',
  },
  {
    id: 'day-5',
    dayName: 'Dimanche 27 Septembre',
    dateStr: '27 Sept. 2026',
    timeStr: '12h00 – 22h00',
    statusBadge: 'FINALE & CLÔTURE',
    title: 'Finale du Trophée Congolicious & Clôture',
    description: 'Remise des prix des meilleurs stands et annonce des fonds récoltés pour la Fondation Congolicious.',
    highlight: 'Remise du Trophée Or & Banquet des Familles',
    location: 'Académie des Beaux-Arts • Kinshasa',
    ticketPrice: '5 $ (13 750 CDF)',
  },
];

interface FestivalScheduleProps {
  onSelectDayTicket: () => void;
}

export const FestivalSchedule: React.FC<FestivalScheduleProps> = ({ onSelectDayTicket }) => {
  const scheduleScrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scheduleScrollRef.current) {
      scheduleScrollRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scheduleScrollRef.current) {
      scheduleScrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* 2-Column Layout: Left (70% Schedule) + Right (30% Sidebar "EN VEDETTE") */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Schedule of the Week (col-span-8) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="w-6 h-1 bg-[#FF6A2B] rounded-full mb-1.5" />
              <h2 className="text-xl sm:text-2xl font-bold text-[#14110F] uppercase tracking-tight font-heading">
                Programmation des 6 Journées
              </h2>
            </div>

            {/* Carousel navigation buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={scrollLeft}
                aria-label="Jour précédent"
                className="w-9 h-9 rounded-full border border-[#D9D0C6] hover:border-[#FF6A2B] hover:bg-[#FFE3D3] text-[#14110F] hover:text-[#FF6A2B] flex items-center justify-center transition shadow-sm active:scale-95"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={scrollRight}
                aria-label="Jour suivant"
                className="w-9 h-9 rounded-full border border-[#D9D0C6] hover:border-[#FF6A2B] hover:bg-[#FFE3D3] text-[#14110F] hover:text-[#FF6A2B] flex items-center justify-center transition shadow-sm active:scale-95"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cards Carousel */}
          <div
            ref={scheduleScrollRef}
            className="flex items-stretch gap-4 overflow-x-auto pb-4 pt-1 no-scrollbar scroll-smooth"
          >
            {FESTIVAL_DAYS.map((day) => (
              <div
                key={day.id}
                className="min-w-[300px] sm:min-w-[340px] max-w-[340px] bg-white rounded-[20px] border border-[#D9D0C6] shadow-level1 hover:shadow-md hover:border-[#FF6A2B] transition-all flex flex-col justify-between p-6 group"
              >
                <div className="space-y-3">
                  {/* Status Badge & Date */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FFE3D3] text-[#14110F] border border-[#FF6A2B]/20 uppercase tracking-wider">
                      {day.statusBadge}
                    </span>
                    <span className="text-xs font-medium text-[#7A7068] font-mono">
                      {day.dateStr}
                    </span>
                  </div>

                  {/* Day Name & Time */}
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#FF6A2B]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{day.dayName} • {day.timeStr}</span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-base font-bold text-[#14110F] group-hover:text-[#FF6A2B] transition-colors leading-snug font-heading">
                      {day.title}
                    </h3>
                    <p className="text-xs text-[#7A7068] mt-2 leading-relaxed">
                      {day.description}
                    </p>
                  </div>

                  {/* Highlight pill */}
                  <div className="p-2.5 rounded-[10px] bg-[#F3ECE2] border border-[#D9D0C6]/50 flex items-center gap-2 text-[11px] font-semibold text-[#4A433D]">
                    <Flame className="w-3.5 h-3.5 text-[#FF6A2B]" />
                    <span className="truncate">{day.highlight}</span>
                  </div>
                </div>

                {/* Bottom Card Footer */}
                <div className="pt-4 mt-4 border-t border-[#F3ECE2] flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-[#7A7068] uppercase font-semibold">Entrée Journée</div>
                    <div className="text-sm font-bold text-[#14110F] font-mono tnum">{day.ticketPrice}</div>
                  </div>

                  <button
                    onClick={onSelectDayTicket}
                    className="px-4 py-2 rounded-full bg-[#FF6A2B] hover:bg-[#E24E10] text-[#14110F] font-bold text-xs uppercase tracking-wider transition active:scale-95 flex items-center gap-1.5"
                  >
                    <span>Réserver</span>
                    <ArrowRight className="w-3 h-3 text-[#14110F]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: "EN VEDETTE" Sidebar (col-span-4) */}
        <div className="lg:col-span-4 space-y-4">
          <div>
            <div className="w-6 h-1 bg-[#FF6A2B] rounded-full mb-1.5" />
            <h2 className="text-xl sm:text-2xl font-bold text-[#14110F] uppercase tracking-tight font-heading">
              En Vedette
            </h2>
          </div>

          <div className="space-y-3.5">
            {/* Sidebar Card 1: Ticket + Cashless Combo */}
            <div className="p-5 rounded-[20px] bg-[#14110F] text-[#FBF6EE] shadow-level1 relative overflow-hidden group">
              <div className="absolute -right-10 -bottom-10 w-32 h-32 rounded-full bg-[#FF6A2B]/15 blur-xl pointer-events-none" />

              <div className="relative z-10 space-y-2">
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#FFC21A] text-[#14110F] uppercase tracking-wider inline-block">
                  Offre Exclusive
                </span>

                <h3 className="text-base font-bold text-[#FBF6EE] font-heading">
                  Combo Billet + Cashless Pré-chargé
                </h3>

                <p className="text-xs text-[#D9D0C6]">
                  Pré-chargez votre portefeuille à l'achat du pass et bénéficiez de <strong className="text-[#FFC21A]">+5% de crédit bonus</strong> offert aux 23 stands.
                </p>

                <button
                  onClick={onSelectDayTicket}
                  className="mt-2 w-full py-2.5 px-4 rounded-full bg-[#FF6A2B] hover:bg-[#E24E10] text-[#14110F] font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-1.5 active:scale-95 shadow-sm"
                >
                  <CreditCard className="w-3.5 h-3.5 text-[#14110F]" />
                  <span>Profiter du Combo</span>
                </button>
              </div>
            </div>

            {/* Sidebar Card 2: Fondation Congolicious Solidarité */}
            <div className="p-5 rounded-[20px] bg-white border border-[#D9D0C6] shadow-level1 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#FFE3D3] text-[#14110F] uppercase tracking-wider">
                  Impact Social
                </span>
                <Heart className="w-4 h-4 text-[#C62828] fill-[#C62828]" />
              </div>

              <h3 className="text-base font-bold text-[#14110F] font-heading">
                Le fruit qui tombe de l'arbre.
              </h3>

              <p className="text-xs text-[#7A7068] leading-relaxed">
                Nourrir un enfant aujourd'hui, c'est construire le Congo de demain. <strong className="text-[#14110F]">10% de chaque commande</strong> sont reversés au programme de cantines scolaires en milieu rural.
              </p>

              <div className="pt-2">
                <a
                  href="https://congoliciousfoundation.org"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-[#FF6A2B] hover:underline flex items-center gap-1"
                >
                  <span>En savoir plus sur les cantines</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Sidebar Card 3: Technologie & Sécurité Starlink */}
            <div className="p-5 rounded-[20px] bg-white border border-[#D9D0C6] shadow-level1 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#E3EEF6] text-[#0E5A8A] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#14110F]">Terminaux Sunmi V2S</h4>
                  <span className="text-[10px] text-[#7A7068] font-mono">Double Connexion Starlink</span>
                </div>
              </div>

              <p className="text-xs text-[#7A7068]">
                Paiement instantané en moins de 2 secondes. Fonctionne même en cas de coupure réseau grâce au mode Offline cryptographique HMAC.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
