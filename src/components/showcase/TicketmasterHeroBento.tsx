import React from 'react';
import { 
  ArrowRight, 
  Ticket, 
  Heart, 
  Utensils, 
  Music, 
  Award,
  Building2,
  Calendar
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface TicketmasterHeroBentoProps {
  onExploreTickets: () => void;
  onExploreStands: () => void;
}

export const TicketmasterHeroBento: React.FC<TicketmasterHeroBentoProps> = ({
  onExploreTickets,
  onExploreStands,
}) => {
  const { openOrganizerLogin } = useApp();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-3 pb-8">
      
      {/* Platform Context Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 px-1">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF6A2B] animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-widest text-[#FF6A2B]">
            Billetterie & Cashless VUKA Pay
          </span>
          <span className="text-[#D9D0C6]">•</span>
          <span className="text-xs font-medium text-[#7A7068]">
            Événement Officiel Partenaire
          </span>
        </div>
        <div className="text-xs text-[#7A7068] flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 text-[#7A7068]" />
          <span>Organisé par Fondation Congolicious</span>
        </div>
      </div>

      {/* 5-Card Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Card 1: Large Featured Event — Fond Nuit #14110F avec accents Braise et Soleil */}
        <div className="lg:col-span-7 relative overflow-hidden rounded-[24px] bg-[#14110F] text-[#FBF6EE] p-7 sm:p-10 flex flex-col justify-between shadow-level2 group">
          {/* Subtle warm glow in corner */}
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[#FF6A2B]/10 blur-3xl pointer-events-none" />
          <div className="absolute right-10 bottom-10 w-64 h-64 rounded-full bg-[#FFC21A]/10 blur-2xl pointer-events-none" />

          {/* Top Bar on Card 1 */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-[#FFC21A] animate-pulse" />
              <span className="text-[#FBF6EE] uppercase tracking-wider text-[11px] font-bold">Festival Phare du Moment</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFC21A] text-[#14110F] text-xs font-bold">
              <Award className="w-3.5 h-3.5" />
              <span>CFW 6 • Billetterie Officielle</span>
            </div>
          </div>

          {/* Main Content Area with Poppins & Inter Typography */}
          <div className="relative z-10 my-8 sm:my-10 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#FFC21A] uppercase tracking-wider font-mono">
              <Calendar className="w-3.5 h-3.5 text-[#FFC21A]" />
              <span>Kinshasa • 22 au 27 Septembre 2026 • Beaux-Arts</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold text-[#FBF6EE] leading-[1.08] tracking-tight font-heading">
              Congo Food Week 6.
              <span className="block text-[#FF6A2B] mt-1">
                La Grande Célébration Culinaire.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-[#D9D0C6] max-w-xl font-normal leading-relaxed">
              Le rendez-vous incontournable de Kinshasa vend ses pass officiels sur <strong>VUKA Pay</strong>. 23 stands d'exception, maîtres des braises, concerts live et paiement 100% cashless sans contact.
            </p>

            {/* Quick Metrics Pills */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <div className="px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs text-[#FBF6EE] font-semibold flex items-center gap-1.5">
                <Utensils className="w-3.5 h-3.5 text-[#FFC21A]" />
                <span>23 Stands Exposants</span>
              </div>
              <div className="px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs text-[#FBF6EE] font-semibold flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5 text-[#FFC21A]" />
                <span>6 Soirées Live</span>
              </div>
              <div className="px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs text-[#FBF6EE] font-semibold flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-[#C62828]" />
                <span>10% Fdt Congolicious</span>
              </div>
            </div>
          </div>

          {/* Action CTAs Bottom — Règle : Texte Nuit sur Braise */}
          <div className="relative z-10 flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onExploreTickets}
              className="h-12 px-7 rounded-full bg-[#FF6A2B] hover:bg-[#E24E10] text-[#14110F] font-bold text-xs sm:text-sm uppercase tracking-wider shadow-sm hover:shadow-md transition-all flex items-center gap-2.5 active:scale-95"
            >
              <Ticket className="w-4 h-4 text-[#14110F]" />
              <span>Acheter un Pass (Dès 5$)</span>
              <ArrowRight className="w-4 h-4 text-[#14110F]" />
            </button>

            <button
              onClick={onExploreStands}
              className="h-12 px-6 rounded-full bg-white/10 hover:bg-white/20 text-[#FBF6EE] font-semibold text-xs sm:text-sm border border-white/20 transition-all flex items-center gap-2 active:scale-95"
            >
              <Utensils className="w-4 h-4 text-[#FFC21A]" />
              <span>Explorer les 23 Stands</span>
            </button>
          </div>
        </div>

        {/* Cards 2-5: 2x2 Grid of Bento Cards */}
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Card 2: Pass Découverte 1 Jour */}
          <div className="p-6 rounded-[24px] bg-white border border-[#D9D0C6] shadow-level1 hover:shadow-md transition-all flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FFE3D3] text-[#14110F] border border-[#FF6A2B]/20 uppercase tracking-wider">
                  Accès 1 Jour
                </span>
                <span className="text-xs font-medium text-[#7A7068] font-mono">Jour au choix</span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#14110F] group-hover:text-[#FF6A2B] transition-colors tracking-tight font-heading">
                  Pass Découverte
                </h3>
                <p className="text-xs text-[#7A7068] mt-1 line-clamp-2">
                  Accès complet au site du festival, aux 23 stands et aux concerts de la journée choisie.
                </p>
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-[#F3ECE2] flex items-center justify-between">
              <div>
                <div className="text-xl font-bold text-[#14110F] font-mono tnum">5 $</div>
                <div className="text-[10px] text-[#7A7068] font-mono">≈ 13 750 CDF</div>
              </div>
              <button
                onClick={onExploreTickets}
                className="h-9 px-4 rounded-full bg-[#FF6A2B] hover:bg-[#E24E10] text-[#14110F] font-bold text-xs uppercase tracking-wider transition active:scale-95"
              >
                Réserver
              </button>
            </div>
          </div>

          {/* Card 3: Pass 6 Jours All-Access */}
          <div className="p-6 rounded-[24px] bg-white border-2 border-[#FFC21A] shadow-level1 hover:shadow-md transition-all flex flex-col justify-between relative group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FFC21A] text-[#14110F] uppercase tracking-wider">
                  Meilleure Vente
                </span>
                <span className="text-xs font-bold text-[#FF6A2B] font-mono">6 Jours</span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#14110F] group-hover:text-[#FF6A2B] transition-colors tracking-tight font-heading">
                  Pass 6 Jours Intégral
                </h3>
                <p className="text-xs text-[#7A7068] mt-1 line-clamp-2">
                  Accès illimité du mardi 22 au dimanche 27 sept. Bracelet RFID MIFARE inclus.
                </p>
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-[#F3ECE2] flex items-center justify-between">
              <div>
                <div className="text-xl font-bold text-[#FF6A2B] font-mono tnum">20 $</div>
                <div className="text-[10px] text-[#7A7068] font-mono">≈ 55 000 CDF</div>
              </div>
              <button
                onClick={onExploreTickets}
                className="h-9 px-4 rounded-full bg-[#FF6A2B] hover:bg-[#E24E10] text-[#14110F] font-bold text-xs uppercase tracking-wider transition active:scale-95"
              >
                Réserver
              </button>
            </div>
          </div>

          {/* Card 4: Pass VIP Food & Wine */}
          <div className="p-6 rounded-[24px] bg-white border border-[#D9D0C6] shadow-level1 hover:shadow-md transition-all flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#E3EEF6] text-[#0E5A8A] border border-[#0E5A8A]/20 uppercase tracking-wider">
                  Coupe-File VIP
                </span>
                <span className="text-xs font-medium text-[#7A7068] font-mono">Privilège</span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#14110F] group-hover:text-[#0E5A8A] transition-colors tracking-tight font-heading">
                  Pass VIP Lounge
                </h3>
                <p className="text-xs text-[#7A7068] mt-1 line-clamp-2">
                  Entrée prioritaire Porte VIP, lounge climatisé, dégustations offertes et parking privé.
                </p>
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-[#F3ECE2] flex items-center justify-between">
              <div>
                <div className="text-xl font-bold text-[#14110F] font-mono tnum">50 $</div>
                <div className="text-[10px] text-[#7A7068] font-mono">≈ 137 500 CDF</div>
              </div>
              <button
                onClick={onExploreTickets}
                className="h-9 px-4 rounded-full bg-[#FF6A2B] hover:bg-[#E24E10] text-[#14110F] font-bold text-xs uppercase tracking-wider transition active:scale-95"
              >
                Réserver
              </button>
            </div>
          </div>

          {/* Card 5: VUKA Événements & Espace Organisateurs */}
          <div className="p-6 rounded-[24px] bg-[#14110F] text-[#FBF6EE] shadow-level1 hover:shadow-md transition-all flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FFC21A] text-[#14110F] uppercase tracking-wider">
                  Espace Organisateurs
                </span>
                <span className="text-[10px] font-bold text-[#FF6A2B] uppercase">Multi-Événements</span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#FBF6EE] group-hover:text-[#FFC21A] transition-colors tracking-tight font-heading">
                  Vendez vos billets sur VUKA.
                </h3>
                <p className="text-xs text-[#D9D0C6] mt-1 line-clamp-2 font-normal">
                  Festivals, concerts, galas : lancez votre billetterie et déployez le cashless sans contact comme le Congo Food Week.
                </p>
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-white/10 flex items-center justify-between">
              <span className="text-[11px] font-medium text-[#D9D0C6]">
                Mise en ligne en 5 min
              </span>
              <button
                onClick={openOrganizerLogin}
                className="h-9 px-3.5 rounded-full bg-[#FF6A2B] hover:bg-[#E24E10] text-[#14110F] font-bold text-xs transition flex items-center gap-1.5 active:scale-95"
              >
                <span>Créer mon événement</span>
                <ArrowRight className="w-3 h-3 text-[#14110F]" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
