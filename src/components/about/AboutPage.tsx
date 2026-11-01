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

          {/* Navigation Rapide entre les 4 Sections */}
          <div className="flex flex-wrap items-center gap-2 pt-6 border-t border-[#F3ECE2] mt-8">
            <button
              type="button"
              onClick={() => scrollToAnchor('presentation')}
              className="px-4 py-2 rounded-full bg-[#FAF8F5] hover:bg-[#FFE3D3] border border-[#D9D0C6] text-xs font-bold text-[#14110F] transition flex items-center gap-2"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#FF6A2B]" />
              <span>1. Présentation</span>
            </button>
            <button
              type="button"
              onClick={() => scrollToAnchor('cashless-section')}
              className="px-4 py-2 rounded-full bg-[#FAF8F5] hover:bg-[#FFE3D3] border border-[#D9D0C6] text-xs font-bold text-[#14110F] transition flex items-center gap-2"
            >
              <Wallet className="w-3.5 h-3.5 text-[#FF6A2B]" />
              <span>2. Comment ça marche</span>
            </button>
            <button
              type="button"
              onClick={() => scrollToAnchor('tarifs')}
              className="px-4 py-2 rounded-full bg-[#FAF8F5] hover:bg-[#FFE3D3] border border-[#D9D0C6] text-xs font-bold text-[#14110F] transition flex items-center gap-2"
            >
              <Receipt className="w-3.5 h-3.5 text-[#FFC21A]" />
              <span>3. Tarifs</span>
            </button>
            <button
              type="button"
              onClick={() => scrollToAnchor('solutions')}
              className="px-4 py-2 rounded-full bg-[#FAF8F5] hover:bg-[#FFE3D3] border border-[#D9D0C6] text-xs font-bold text-[#14110F] transition flex items-center gap-2"
            >
              <Layers className="w-3.5 h-3.5 text-[#0E5A8A]" />
              <span>4. Nos Solutions</span>
            </button>
          </div>

        </div>
      </div>

      {/* SECTION 1 : PRÉSENTATION DE LA PLATEFORME */}
      <div id="presentation" className="py-14 sm:py-18 bg-[#FBF6EE] border-b border-[#E5E0D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10">
            <span className="text-xs font-bold font-mono text-[#FF6A2B] uppercase tracking-wider block mb-2">Section 1 • Vision & Rôle</span>
            <h2 className="text-2xl sm:text-4xl font-bold font-heading text-[#14110F]">
              La plateforme événementielle nouvelle génération en RDC
            </h2>
            <p className="text-sm sm:text-base text-[#7A7068] mt-3 leading-relaxed">
              VUKA Pay n'est pas l'application d'un seul festival. C'est une infrastructure complète ouverte à tous les organisateurs d'événements, concerts, festivals, sommets et campagnes solidaires pour vendre leurs pass, contrôler les entrées et encaisser en cashless sans espèces.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-[#D9D0C6] shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFE3D3] text-[#FF6A2B] flex items-center justify-center font-bold">
                01
              </div>
              <h3 className="text-base font-bold text-[#14110F] font-heading">Multi-Événements & Souveraineté</h3>
              <p className="text-xs text-[#7A7068] leading-relaxed">
                Chaque organisateur peut créer son événement, configurer ses catégories de billets et suivre ses ventes et encaissements en direct.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#D9D0C6] shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFF3CC] text-[#14110F] flex items-center justify-center font-bold">
                02
              </div>
              <h3 className="text-base font-bold text-[#14110F] font-heading">100% Cashless Sans Contact</h3>
              <p className="text-xs text-[#7A7068] leading-relaxed">
                Fini les billets papier perdus et les vols d'espèces. Les participants paient via QR dynamique anti-capture ou bracelet RFID en moins de 2 secondes.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#D9D0C6] shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#E2F3E9] text-[#167A42] flex items-center justify-center font-bold">
                03
              </div>
              <h3 className="text-base font-bold text-[#14110F] font-heading">Résilience Offline-First</h3>
              <p className="text-xs text-[#7A7068] leading-relaxed">
                Les terminaux caisses et scanners fonctionnent même sans connexion Internet grâce au moteur cryptographique local et à la synchro Starlink.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2 : COMMENT ÇA MARCHE */}
      <div id="cashless-section" className="border-b border-[#E5E0D8]">
        <PerforatedTicketSection onExploreTickets={handleOpenCheckout} />
      </div>

      {/* SECTION 3 & 4 : TARIFS & SOLUTIONS GALAXY */}
      <div id="tarifs">
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
