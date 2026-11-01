import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  Smartphone, 
  Wifi, 
  Receipt, 
  Zap, 
  CheckCircle2, 
  Lock, 
  Radio, 
  ArrowRight 
} from 'lucide-react';
import { PerforatedTicketSection } from '../showcase/PerforatedTicketSection';
import { SolutionsGalaxy } from '../showcase/SolutionsGalaxy';
import { TicketDefinition } from '../../types';

interface AboutPageProps {
  onSelectTicket: (ticket?: TicketDefinition) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onSelectTicket }) => {
  const { setAppViewMode, tickets } = useApp();

  const handleOpenCheckout = () => {
    const chosenTicket = tickets.find((t) => t.id === 'pass-6-days') || tickets[0];
    if (chosenTicket) {
      onSelectTicket(chosenTicket);
    }
  };

  return (
    <div className="w-full bg-[#FBF6EE] min-h-screen text-[#14110F]">
      
      {/* 1. PREMIÈRE SECTION : HERO CHARTE VUKA ATTIRANT & INTUITIF (Sans les 4 boutons ni bouton retour) */}
      <section className="bg-white border-b border-[#E5E0D8] pt-10 pb-14 sm:pt-14 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* En-tête éditorial fort */}
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFE3D3] border border-[#FF6A2B]/20 text-xs font-bold text-[#14110F] uppercase tracking-wider font-heading">
              <span className="w-2 h-2 rounded-full bg-[#FF6A2B] animate-pulse"></span>
              <span>Infrastructure & Super App Événementielle • RDC</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#14110F] font-heading tracking-tight leading-[1.08]">
              L’Écosystème Digital qui Révolutionne les Événements en RDC.
            </h1>

            <p className="text-base sm:text-lg text-[#7A7068] font-normal leading-relaxed">
              VUKA Pay réunit sur une seule plateforme souveraine la billetterie numérique infalsifiable, le contrôle d'accès instantané Starlink, les caisses marchandes tactiles et le paiement cashless 100% sans contact via Mobile Money.
            </p>
          </div>

          {/* Grille Bento des 4 Piliers Fondamentaux (Palette officielle Braise, Nuit, Soleil, Fleuve, Sable) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* Pilule 1 : Billetterie Infalsifiable (Carte Nuit & Braise) */}
            <div className="p-6 rounded-[24px] bg-[#14110F] text-[#FBF6EE] border border-[#2A2420] shadow-md flex flex-col justify-between space-y-4 hover:border-[#FF6A2B]/40 transition group">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#FFE3D3] text-[#14110F] flex items-center justify-center font-bold">
                  <Lock className="w-6 h-6 text-[#FF6A2B]" />
                </div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-[#FFC21A] font-mono">
                  SÉCURITÉ VUKA SECURE
                </div>
                <h3 className="text-lg font-bold font-heading text-white group-hover:text-[#FF6A2B] transition-colors">
                  Billetterie Infalsifiable
                </h3>
                <p className="text-xs text-[#D9D0C6] leading-relaxed">
                  QR Code dynamique avec signature cryptographique HMAC rotatif toutes les 30s. Fini les fraudes et captures d'écran.
                </p>
              </div>
              <div className="pt-2 border-t border-[#2A2420] text-[11px] font-semibold text-[#FFC21A]">
                Zéro faux billet garanti
              </div>
            </div>

            {/* Pilule 2 : Paiement Cashless 100% Sans Espèces (Braise & Sable) */}
            <div className="p-6 rounded-[24px] bg-[#FBF6EE] text-[#14110F] border border-[#D9D0C6] shadow-xs flex flex-col justify-between space-y-4 hover:border-[#FF6A2B] transition group">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#FFE3D3] text-[#14110F] flex items-center justify-center font-bold">
                  <Zap className="w-6 h-6 text-[#FF6A2B]" />
                </div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-[#FF6A2B] font-mono">
                  CASHLESS RAPIDE
                </div>
                <h3 className="text-lg font-bold font-heading text-[#14110F] group-hover:text-[#FF6A2B] transition-colors">
                  Paiement en &lt; 2s
                </h3>
                <p className="text-xs text-[#7A7068] leading-relaxed">
                  Réglez instantanément vos consommations par bracelet RFID ou QR dynamique. Recharges directes M-Pesa en bidevise USD/CDF.
                </p>
              </div>
              <div className="pt-2 border-t border-[#D9D0C6]/60 text-[11px] font-semibold text-[#14110F]">
                100% sans manipulation de cash
              </div>
            </div>

            {/* Pilule 3 : Résilience Starlink & Mode Offline (Fleuve & Nuit) */}
            <div className="p-6 rounded-[24px] bg-white text-[#14110F] border border-[#D9D0C6] shadow-xs flex flex-col justify-between space-y-4 hover:border-[#0E5A8A] transition group">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#E2F0F9] text-[#0E5A8A] flex items-center justify-center font-bold">
                  <Wifi className="w-6 h-6 text-[#0E5A8A]" />
                </div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-[#0E5A8A] font-mono">
                  INFRASTRUCTURE RDC
                </div>
                <h3 className="text-lg font-bold font-heading text-[#14110F] group-hover:text-[#0E5A8A] transition-colors">
                  Offline-First & Starlink
                </h3>
                <p className="text-xs text-[#7A7068] leading-relaxed">
                  Caisses tactiles Sunmi V2S et scanners de portes fonctionnels même en cas de coupure réseau, avec synchronisation Starlink continue.
                </p>
              </div>
              <div className="pt-2 border-t border-[#D9D0C6]/60 text-[11px] font-semibold text-[#0E5A8A]">
                Continuité de service 100%
              </div>
            </div>

            {/* Pilule 4 : Modèle Transparent & Équitable (Soleil & Nuit) */}
            <div className="p-6 rounded-[24px] bg-[#FFFBEB] text-[#14110F] border border-[#FFC21A]/30 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#FFC21A] transition group">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#FFEBA5] text-[#14110F] flex items-center justify-center font-bold">
                  <Receipt className="w-6 h-6 text-[#14110F]" />
                </div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-[#14110F] font-mono">
                  TRANSPARENCE FINANCIÈRE
                </div>
                <h3 className="text-lg font-bold font-heading text-[#14110F]">
                  Zéro Frais Cachés
                </h3>
                <p className="text-xs text-[#7A7068] leading-relaxed">
                  Clôtures journalières automatisées et virements directs aux exposants et organisateurs. Réconciliation bidevise claire et certifiée.
                </p>
              </div>
              <div className="pt-2 border-t border-[#FFC21A]/20 text-[11px] font-semibold text-[#14110F]">
                Trésorerie et audits traçables
              </div>
            </div>

          </div>

          {/* Bandeau de Chiffres Clés VUKA */}
          <div className="p-6 sm:p-8 rounded-[24px] bg-[#FAF8F5] border border-[#D9D0C6] grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#FF6A2B] font-mono">&lt; 500 ms</div>
              <div className="text-xs text-[#7A7068] font-medium mt-1">Scan de contrôle aux portes</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#14110F] font-mono">100%</div>
              <div className="text-xs text-[#7A7068] font-medium mt-1">Intégration Mobile Money</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#167A42] font-mono">0 Faux</div>
              <div className="text-xs text-[#7A7068] font-medium mt-1">Signature HMAC inviolable</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#0E5A8A] font-mono">USD / CDF</div>
              <div className="text-xs text-[#7A7068] font-medium mt-1">Réconciliation bidevise live</div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 2 : COMMENT ÇA MARCHE (Le Billet Perforé & Cashless) */}
      <section id="cashless-section" className="border-b border-[#E5E0D8]">
        <PerforatedTicketSection onExploreTickets={handleOpenCheckout} />
      </section>

      {/* SECTION 3 & 4 : TARIFS & SOLUTIONS GALAXY */}
      <section id="solutions" className="border-b border-[#E5E0D8]">
        <SolutionsGalaxy onSelectTicket={handleOpenCheckout} />
      </section>

      {/* BANDEAU DE FIN DE PAGE AVEC CTA VERS LES ÉVÉNEMENTS */}
      <section className="bg-white py-12 text-center">
        <div className="max-w-2xl mx-auto px-4 space-y-4">
          <h3 className="text-xl sm:text-2xl font-bold font-heading text-[#14110F]">
            Prêt à vivre l’expérience VUKA Pay ?
          </h3>
          <p className="text-sm text-[#7A7068]">
            Découvrez les événements, concerts et festivals à l'affiche et réservez vos billets en toute sécurité.
          </p>
          <div>
            <button
              type="button"
              onClick={() => {
                setAppViewMode('PUBLIC_LANDING');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="h-11 px-6 rounded-full bg-[#FF6A2B] hover:bg-[#E24E10] text-[#14110F] font-bold text-xs uppercase tracking-wider transition active:scale-95 inline-flex items-center gap-2 shadow-xs"
            >
              <span>Découvrir les événements</span>
              <ArrowRight className="w-4 h-4 text-[#14110F]" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
