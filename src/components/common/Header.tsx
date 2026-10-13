import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Ticket, 
  Wallet, 
  Store, 
  Menu, 
  X,
  ChevronDown,
  User,
  Receipt,
  LogOut,
  Calendar,
  Layers
} from 'lucide-react';
import { formatUSD } from '../../utils/formatters';
import { VukaLogo } from './VukaLogo';

export const Header: React.FC = () => {
  const { 
    appViewMode,
    setAppViewMode,
    setActiveClientTab,
    currentUser,
    logoutUser,
    setIsAuthModalOpen,
    setAuthModalMode,
    openOrganizerLogin,
    wallet
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [solutionsDropdownOpen, setSolutionsDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const solutionsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Fermeture au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (solutionsRef.current && !solutionsRef.current.contains(event.target as Node)) {
        setSolutionsDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scrollToSection = (sectionId: string) => {
    if (appViewMode !== 'PUBLIC_LANDING') {
      setAppViewMode('PUBLIC_LANDING');
    }
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
    setMobileMenuOpen(false);
  };

  const navigateToClientTab = (tab: 'OVERVIEW' | 'TICKETS' | 'WALLET' | 'HISTORY' | 'PROFILE') => {
    setAppViewMode('CLIENT_PORTAL');
    setActiveClientTab(tab);
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
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

          {/* ZONE CENTRALE : Navigation sobre et aérée (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button 
              type="button"
              onClick={() => scrollToSection('evenements')}
              className="px-3.5 py-1.5 rounded-full text-xs lg:text-sm font-medium text-[#4A433D] hover:text-[#14110F] hover:bg-black/[0.04] transition-colors"
            >
              Événements
            </button>

            <button 
              type="button"
              onClick={() => scrollToSection('cashless-section')}
              className="px-3.5 py-1.5 rounded-full text-xs lg:text-sm font-medium text-[#4A433D] hover:text-[#14110F] hover:bg-black/[0.04] transition-colors"
            >
              Comment ça marche
            </button>

            <button 
              type="button"
              onClick={() => scrollToSection('tarifs')}
              className="px-3.5 py-1.5 rounded-full text-xs lg:text-sm font-medium text-[#4A433D] hover:text-[#14110F] hover:bg-black/[0.04] transition-colors"
            >
              Tarifs
            </button>

            {/* Dropdown Solutions */}
            <div className="relative" ref={solutionsRef}>
              <button 
                type="button"
                onClick={() => setSolutionsDropdownOpen(!solutionsDropdownOpen)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs lg:text-sm font-medium transition-colors ${
                  solutionsDropdownOpen 
                    ? 'text-[#14110F] bg-black/[0.06]' 
                    : 'text-[#4A433D] hover:text-[#14110F] hover:bg-black/[0.04]'
                }`}
                aria-expanded={solutionsDropdownOpen}
              >
                <span>Solutions</span>
                <ChevronDown className={`w-3.5 h-3.5 text-[#7A7068] transition-transform duration-200 ${solutionsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {solutionsDropdownOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 rounded-2xl bg-white border border-[#E5E0D8] shadow-xl p-2 space-y-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <button 
                    type="button"
                    onClick={() => { 
                      scrollToSection('billetterie'); 
                      setSolutionsDropdownOpen(false); 
                    }}
                    className="w-full p-2.5 rounded-xl hover:bg-[#FBF6EE] flex items-center gap-3 transition text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#FFE3D3] text-[#FF6A2B] flex items-center justify-center shrink-0">
                      <Ticket className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-[#14110F] text-xs">VUKA Billetterie</div>
                      <div className="text-[11px] text-[#7A7068]">Vente en ligne & Mobile Money</div>
                    </div>
                  </button>

                  <button 
                    type="button"
                    onClick={() => {
                      scrollToSection('cashless-section');
                      setSolutionsDropdownOpen(false);
                    }}
                    className="w-full p-2.5 rounded-xl hover:bg-[#FBF6EE] flex items-center gap-3 transition text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#FFF3CC] text-[#14110F] flex items-center justify-center shrink-0">
                      <Wallet className="w-4 h-4 text-[#14110F]" />
                    </div>
                    <div>
                      <div className="font-semibold text-[#14110F] text-xs">VUKA Cashless</div>
                      <div className="text-[11px] text-[#7A7068]">NFC & QR dynamique 30s</div>
                    </div>
                  </button>

                  <button 
                    type="button"
                    onClick={() => {
                      setAppViewMode('BACKOFFICE_STAFF');
                      setSolutionsDropdownOpen(false);
                    }}
                    className="w-full p-2.5 rounded-xl hover:bg-[#FBF6EE] flex items-center gap-3 transition text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#F3ECE2] text-[#4A433D] flex items-center justify-center shrink-0">
                      <Store className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-[#14110F] text-xs">Caisses POS & Contrôle</div>
                      <div className="text-[11px] text-[#7A7068]">Terminaux Sunmi & Barrières</div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* ZONE DROITE : Actions utilisateurs & Espace Organisateurs */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Raccourci Espace Organisateurs */}
            <button
              type="button"
              onClick={openOrganizerLogin}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-[#7A7068] hover:text-[#14110F] hover:bg-black/[0.04] transition-colors"
            >
              <span>Espace Organisateurs</span>
            </button>

            {/* Séparateur subtil */}
            <div className="hidden sm:block h-4 w-px bg-[#D9D0C6]" />

            {/* Profil Utilisateur / Bouton Connexion */}
            {currentUser ? (
              /* Utilisateur connecté : Pilule sobre */
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 h-9 pl-2 pr-3 rounded-full bg-white hover:bg-[#F3ECE2] border border-[#D9D0C6] transition active:scale-95 shadow-xs"
                >
                  <div className="w-6 h-6 rounded-full bg-[#14110F] text-[#FFC21A] flex items-center justify-center font-bold text-[11px]">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left hidden sm:block">
                    <span className="text-xs font-semibold text-[#14110F] leading-none block">
                      {currentUser.name.split(' ')[0]}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-[#FF6A2B] hidden md:inline">
                    {formatUSD(wallet.balanceUSD)}
                  </span>
                  <ChevronDown className={`w-3 h-3 text-[#7A7068] transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Utilisateur */}
                {userDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-64 rounded-2xl bg-white border border-[#E5E0D8] shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="p-3 border-b border-[#F3ECE2] mb-1">
                      <div className="text-xs font-bold text-[#14110F]">{currentUser.name}</div>
                      <div className="text-[11px] text-[#7A7068] font-mono truncate">{currentUser.phone || currentUser.email}</div>
                      <div className="mt-2 flex items-center justify-between text-xs pt-2 border-t border-[#F3ECE2]">
                        <span className="text-[#7A7068] font-medium">Solde Cashless :</span>
                        <span className="font-bold text-[#14110F] font-mono">{formatUSD(wallet.balanceUSD)}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigateToClientTab('OVERVIEW')}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#4A433D] hover:bg-[#FBF6EE] hover:text-[#14110F] transition text-left"
                    >
                      <User className="w-4 h-4 text-[#FF6A2B]" />
                      <span>Parcours Festivalier</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => navigateToClientTab('TICKETS')}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#4A433D] hover:bg-[#FBF6EE] hover:text-[#14110F] transition text-left"
                    >
                      <Ticket className="w-4 h-4 text-[#FF6A2B]" />
                      <span>Mes Billets & Pass</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => navigateToClientTab('WALLET')}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#4A433D] hover:bg-[#FBF6EE] hover:text-[#14110F] transition text-left"
                    >
                      <Wallet className="w-4 h-4 text-[#FF6A2B]" />
                      <span>Mon Portefeuille Cashless</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => navigateToClientTab('HISTORY')}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#4A433D] hover:bg-[#FBF6EE] hover:text-[#14110F] transition text-left"
                    >
                      <Receipt className="w-4 h-4 text-[#FF6A2B]" />
                      <span>Mes Reçus & Commandes</span>
                    </button>

                    <div className="pt-1 mt-1 border-t border-[#F3ECE2]">
                      <button
                        type="button"
                        onClick={() => {
                          logoutUser();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#C62828] hover:bg-[#FBE5E5] transition text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Se déconnecter</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Visiteur non connecté : Bouton épuré sobre */
              <button
                type="button"
                onClick={() => {
                  setAuthModalMode('LOGIN');
                  setIsAuthModalOpen(true);
                }}
                className="inline-flex items-center gap-2 h-9 px-4 sm:px-5 rounded-full bg-white hover:bg-[#F3ECE2] border border-[#D9D0C6] hover:border-[#14110F] text-xs font-bold text-[#14110F] shadow-xs transition active:scale-95"
              >
                <User className="w-3.5 h-3.5 text-[#FF6A2B]" />
                <span>Connexion</span>
              </button>
            )}

            {/* Bouton Hamburger Mobile */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden h-9 w-9 flex items-center justify-center rounded-full bg-white border border-[#D9D0C6] text-[#14110F] hover:bg-[#F3ECE2] transition"
              aria-label="Menu Mobile"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* TIROIR MOBILE ÉPURÉ */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E5E0D8] bg-[#FBF6EE] px-4 py-4 space-y-4 shadow-xl animate-in slide-in-from-top-2 duration-200">
          
          {/* Section Compte Mobile */}
          {currentUser ? (
            <div className="p-4 rounded-2xl bg-white border border-[#E5E0D8] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-[#14110F]">{currentUser.name}</div>
                  <div className="text-xs text-[#7A7068] font-mono">{currentUser.phone || currentUser.email}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#7A7068] uppercase font-semibold block">Solde Cashless</span>
                  <span className="text-sm font-bold text-[#FF6A2B] font-mono">{formatUSD(wallet.balanceUSD)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#F3ECE2]">
                <button
                  type="button"
                  onClick={() => navigateToClientTab('OVERVIEW')}
                  className="py-2 px-3 rounded-xl bg-[#FBF6EE] border border-[#E5E0D8] text-xs font-semibold text-[#14110F] text-center"
                >
                  Mon Espace
                </button>
                <button
                  type="button"
                  onClick={() => navigateToClientTab('WALLET')}
                  className="py-2 px-3 rounded-xl bg-[#14110F] text-[#FBF6EE] font-semibold text-xs text-center"
                >
                  Mon Wallet
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setAuthModalMode('LOGIN');
                  setIsAuthModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="py-2.5 rounded-full bg-white border border-[#D9D0C6] text-xs font-bold text-[#14110F] text-center shadow-xs"
              >
                Se connecter
              </button>
              <button
                type="button"
                onClick={() => {
                  openOrganizerLogin();
                  setMobileMenuOpen(false);
                }}
                className="py-2.5 rounded-full bg-[#14110F] text-xs font-bold text-[#FBF6EE] text-center shadow-xs"
              >
                Organisateurs
              </button>
            </div>
          )}

          {/* Liens de navigation mobile */}
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => scrollToSection('evenements')}
              className="w-full text-left py-2 px-3 rounded-xl text-sm font-semibold text-[#4A433D] hover:bg-white"
            >
              Événements à l'affiche
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('cashless-section')}
              className="w-full text-left py-2 px-3 rounded-xl text-sm font-semibold text-[#4A433D] hover:bg-white"
            >
              Comment fonctionne le Cashless
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('tarifs')}
              className="w-full text-left py-2 px-3 rounded-xl text-sm font-semibold text-[#4A433D] hover:bg-white"
            >
              Tarifs et Commissions
            </button>
          </div>

          {/* Raccourci Backoffice Staff */}
          <div className="pt-2 border-t border-[#E5E0D8]">
            <button
              type="button"
              onClick={() => {
                setAppViewMode('BACKOFFICE_STAFF');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2 px-3 rounded-xl text-xs font-semibold text-[#7A7068] hover:text-[#14110F] hover:bg-white text-left flex items-center justify-between"
            >
              <span>Accès Staff & Caisses</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#F3ECE2] text-[#4A433D]">Interne</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
