import React from 'react';
import { useApp } from '../../context/AppContext';
import { User } from 'lucide-react';
import { formatUSD } from '../../utils/formatters';
import { VukaLogo } from './VukaLogo';

export const Header: React.FC = () => {
  const { 
    appViewMode,
    setAppViewMode,
    setActiveClientTab,
    currentUser,
    setIsAuthModalOpen,
    setAuthModalMode,
    wallet
  } = useApp();

  const handleOpenProfile = () => {
    setAppViewMode('CLIENT_PORTAL');
    setActiveClientTab('OVERVIEW');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginClick = () => {
    setAuthModalMode('LOGIN');
    setIsAuthModalOpen(true);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FBF6EE]/95 backdrop-blur-md border-b border-[#E5E0D8] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          
          {/* ZONE GAUCHE : Logo officiel VUKA Pay */}
          <div className="flex items-center">
            <button 
              type="button"
              onClick={() => {
                setAppViewMode('PUBLIC_LANDING');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center cursor-pointer select-none focus:outline-none hover:opacity-95 transition-opacity"
              title="VUKA Pay — Accueil"
              aria-label="VUKA Pay Accueil"
            >
              <VukaLogo size="md" />
            </button>
          </div>

          {/* ZONE DROITE : Actions utilisateurs (Connexion ou "Mon Profil", adapté petits et grands écrans) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {currentUser ? (
              /* Utilisateur connecté : Bouton direct "Mon Profil" */
              <button
                type="button"
                onClick={handleOpenProfile}
                className={`flex items-center gap-2 h-9 pl-2 pr-3.5 sm:pr-4 rounded-full border transition active:scale-95 shadow-xs ${
                  appViewMode === 'CLIENT_PORTAL'
                    ? 'bg-[#14110F] text-white border-[#14110F]'
                    : 'bg-white hover:bg-[#FAF8F5] text-[#14110F] border-[#D9D0C6] hover:border-[#14110F]/30'
                }`}
                title="Accéder à Mon Profil & Dashboard"
              >
                <div className="w-6 h-6 rounded-full bg-[#14110F] text-[#FFC21A] flex items-center justify-center font-bold text-[11px] shrink-0">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-bold font-heading whitespace-nowrap">
                  Mon Profil
                </span>
                <span className="text-[11px] font-mono font-bold text-[#FF6A2B] hidden sm:inline pl-1 border-l border-[#E5E0D8]">
                  {formatUSD(wallet.balanceUSD)}
                </span>
              </button>
            ) : (
              /* Visiteur non connecté : Bouton sobre Connexion */
              <button
                type="button"
                onClick={handleLoginClick}
                className="inline-flex items-center gap-1.5 sm:gap-2 h-9 px-3.5 sm:px-5 rounded-full bg-white hover:bg-[#FAF8F5] border border-[#D9D0C6] hover:border-[#14110F] text-xs font-bold text-[#14110F] shadow-xs transition active:scale-95"
              >
                <User className="w-3.5 h-3.5 text-[#FF6A2B]" />
                <span>Connexion</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
