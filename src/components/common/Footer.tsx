import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Heart, ExternalLink, Lock } from 'lucide-react';
import { VukaLogo } from './VukaLogo';
import { LegalModal, LegalTab } from '../legal/LegalModal';

export const Footer: React.FC = () => {
  const { setAppViewMode, setActiveBackofficeModule } = useApp();
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState<LegalTab>('PRIVACY');

  const openLegal = (tab: LegalTab) => {
    setLegalTab(tab);
    setIsLegalModalOpen(true);
  };

  return (
    <footer className="border-t border-[#D9D0C6] bg-white text-[#4A433D] py-16 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="space-y-4">
            <VukaLogo size="md" />
            <p className="text-sm text-[#7A7068] leading-relaxed font-normal">
              Super App de billetterie, contrôle d'accès et paiement cashless 100% sans contact. Plateforme événementielle multi-événements accueillant festivals, concerts et salons en RDC (dont le Congo Food Week 6 en événement vedette).
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E2F3E9] border border-[#167A42]/20 text-xs text-[#167A42] font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#167A42]" />
              <span>Souveraineté des données & Sécurité bancaire</span>
            </div>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="text-xs font-bold text-[#14110F] uppercase tracking-wider mb-4">
              Solutions Événementielles
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <span className="text-[#4A433D] hover:text-[#FF6A2B] transition cursor-pointer flex items-center gap-2 font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#FF6A2B]"></span>
                  VUKA Ticket — Billetterie en ligne
                </span>
              </li>
              <li>
                <span className="text-[#4A433D] hover:text-[#FF6A2B] transition cursor-pointer flex items-center gap-2 font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#0E5A8A]"></span>
                  VUKA Access — Contrôle d'accès RFID
                </span>
              </li>
              <li>
                <span className="text-[#4A433D] hover:text-[#FF6A2B] transition cursor-pointer flex items-center gap-2 font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#FFC21A]"></span>
                  VUKA Pay — Portefeuille & Cashless
                </span>
              </li>
              <li>
                <span className="text-[#4A433D] hover:text-[#FF6A2B] transition cursor-pointer flex items-center gap-2 font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#14110F]"></span>
                  VUKA POS — Terminaux Caisse Sunmi
                </span>
              </li>
              <li className="pt-2 border-t border-[#F3ECE2]">
                <button
                  onClick={() => {
                    setAppViewMode('BACKOFFICE_STAFF');
                    setActiveBackofficeModule('POS_TERMINAL');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-xs font-bold text-[#14110F] hover:text-[#FF6A2B] transition flex items-center gap-1.5 py-1 px-2.5 rounded-[8px] bg-[#F3ECE2] hover:bg-[#FFE3D3]"
                >
                  <Lock className="w-3.5 h-3.5 text-[#FF6A2B]" />
                  <span>Espace Staff & Backoffice Pro</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Impact & Partenaires */}
          <div>
            <h4 className="text-xs font-bold text-[#14110F] uppercase tracking-wider mb-4">
              Modèle Solidaire
            </h4>
            <div className="p-4 rounded-[16px] bg-[#FFE3D3]/40 border border-[#FF6A2B]/20 text-xs space-y-2">
              <div className="flex items-center gap-1.5 text-[#14110F] font-bold">
                <Heart className="w-4 h-4 text-[#C62828]" />
                <span>10% reversés à la Fondation</span>
              </div>
              <p className="text-[#4A433D] leading-relaxed font-normal">
                Sur chaque transaction effectuée sur les 23 stands du Congo Food Week 6, 10% financent des actions d'impact social pour la Fondation Congolicious (cantines scolaires en milieu rural).
              </p>
            </div>
          </div>

          {/* Technologie & LAB3 */}
          <div>
            <h4 className="text-xs font-bold text-[#14110F] uppercase tracking-wider mb-4">
              Infrastructures RDC
            </h4>
            <ul className="space-y-2 text-xs text-[#7A7068] font-medium">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A2B]"></span>
                <span>Terminaux Android Sunmi V2S</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A2B]"></span>
                <span>Double liaison Starlink redondante</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A2B]"></span>
                <span>Puces MIFARE DESFire & QR Dynamique</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A2B]"></span>
                <span>Passerelle M-Pesa Vodacom intégrée</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar Épurée */}
        <div className="pt-8 border-t border-[#D9D0C6] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#7A7068]">
          <p>© 2026 VUKA Pay. Tous droits réservés.</p>

          {/* Liens Légaux & Conformité */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 font-medium">
            <button
              type="button"
              onClick={() => openLegal('PRIVACY')}
              className="hover:text-[#14110F] hover:underline transition cursor-pointer"
            >
              Politique de Confidentialité
            </button>
            <span className="text-[#D9D0C6] hidden sm:inline">•</span>
            <button
              type="button"
              onClick={() => openLegal('TERMS')}
              className="hover:text-[#14110F] hover:underline transition cursor-pointer"
            >
              Conditions Générales (CGU / CGV)
            </button>
            <span className="text-[#D9D0C6] hidden sm:inline">•</span>
            <button
              type="button"
              onClick={() => openLegal('LEGAL_NOTICE')}
              className="hover:text-[#14110F] hover:underline transition cursor-pointer"
            >
              Mentions Légales
            </button>
          </div>

          {/* Attribution MOKILI */}
          <div className="flex items-center gap-1.5 font-medium">
            <span>Propulsé par</span>
            <a 
              href="https://mokili.io" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-bold text-[#14110F] hover:text-[#FF6A2B] transition flex items-center gap-1"
            >
              <span>MOKILI</span>
              <ExternalLink className="w-3 h-3 text-[#7A7068]" />
            </a>
          </div>
        </div>
      </div>

      {/* Modal Légale & Conformité */}
      <LegalModal
        isOpen={isLegalModalOpen}
        initialTab={legalTab}
        onClose={() => setIsLegalModalOpen(false)}
      />
    </footer>
  );
};
