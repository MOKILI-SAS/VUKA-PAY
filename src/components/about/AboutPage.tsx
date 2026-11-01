import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Wallet, Receipt, Layers, Heart, ShieldCheck, CheckCircle2 } from 'lucide-react';
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

  const scrollToAnchor = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-[#FBF6EE] min-h-screen text-[#14110F]">
      
      {/* 1. HERO HEADER DE LA PAGE À PROPOS */}
      <div className="border-b border-[#E5E0D8] bg-white py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Bouton Retour aux Événements */}
          <div className="mb-6">
            <button
              type="button"
              onClick={() => {
                setAppViewMode('PUBLIC_LANDING');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FBF6EE] hover:bg-[#F3ECE2] border border-[#D9D0C6] text-xs font-bold text-[#14110F] transition active:scale-95 shadow-xs"
            >
              <ArrowLeft className="w-4 h-4 text-[#FF6A2B]" />
              <span>Retour aux Événements</span>
            </button>
          </div>

          <div className="max-w-3xl space-y-3">
            <h1 className="text-3xl sm:text-5xl font-black font-heading tracking-tight text-[#14110F] leading-tight">
              À Propos de VUKA Pay
            </h1>
            <p className="text-base sm:text-lg text-[#7A7068] font-normal leading-relaxed">
              La Super App de billetterie, contrôle d'accès et paiement cashless 100% sans contact conçue pour les événements majeurs en République Démocratique du Congo.
            </p>
          </div>

          {/* Navigation Rapide entre Sections */}
          <div className="flex flex-wrap items-center gap-2 pt-6 border-t border-[#F3ECE2] mt-8">
            <button
              type="button"
              onClick={() => scrollToAnchor('cashless-section')}
              className="px-4 py-2 rounded-full bg-[#FAF8F5] hover:bg-[#FFE3D3] border border-[#D9D0C6] text-xs font-bold text-[#14110F] transition flex items-center gap-2"
            >
              <Wallet className="w-3.5 h-3.5 text-[#FF6A2B]" />
              <span>Comment ça marche</span>
            </button>
            <button
              type="button"
              onClick={() => scrollToAnchor('tarifs')}
              className="px-4 py-2 rounded-full bg-[#FAF8F5] hover:bg-[#FFE3D3] border border-[#D9D0C6] text-xs font-bold text-[#14110F] transition flex items-center gap-2"
            >
              <Receipt className="w-3.5 h-3.5 text-[#FFC21A]" />
              <span>Tarifs & Modèle Solidaire</span>
            </button>
            <button
              type="button"
              onClick={() => scrollToAnchor('solutions')}
              className="px-4 py-2 rounded-full bg-[#FAF8F5] hover:bg-[#FFE3D3] border border-[#D9D0C6] text-xs font-bold text-[#14110F] transition flex items-center gap-2"
            >
              <Layers className="w-3.5 h-3.5 text-[#0E5A8A]" />
              <span>Nos Solutions</span>
            </button>
          </div>

        </div>
      </div>

      {/* 2. SECTION 1 : COMMENT ÇA MARCHE (Pass Perforé, QR Dynamique 30s & Bracelet RFID) */}
      <div className="border-b border-[#E5E0D8]">
        <PerforatedTicketSection onExploreTickets={handleOpenCheckout} />
      </div>

      {/* 3. SECTION 2 & 3 : TARIFS & SOLUTIONS GALAXY */}
      <div id="solutions">
        <SolutionsGalaxy onSelectTicket={handleOpenCheckout} />
      </div>

      {/* 4. BANDEAU DE FIN DE PAGE AVEC CTA RETOUR */}
      <div className="bg-white border-t border-[#E5E0D8] py-12 text-center">
        <div className="max-w-2xl mx-auto px-4 space-y-4">
          <h3 className="text-xl sm:text-2xl font-bold font-heading text-[#14110F]">
            Prêt à vivre l'expérience VUKA Pay ?
          </h3>
          <p className="text-sm text-[#7A7068]">
            Explorez les pass disponibles pour le Congo Food Week 6 et réservez votre accès en quelques clics.
          </p>
          <div>
            <button
              type="button"
              onClick={() => {
                setAppViewMode('PUBLIC_LANDING');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="h-11 px-6 rounded-full bg-[#14110F] hover:bg-[#2A2420] text-[#FBF6EE] font-bold text-xs uppercase tracking-wider transition active:scale-95"
            >
              Découvrir les événements à l'affiche
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
