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
  Layers,
  PlusCircle,
  LayoutDashboard,
  ShieldCheck
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
    openPublishModal,
    openUserDashboard,
    setIsTicketVerificationOpen,
    wallet
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const aboutRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Fermeture au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (aboutRef.current && !aboutRef.current.contains(event.target as Node)) {
        setAboutDropdownOpen(false);
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

            {/* Dropdown À Propos regroupant : Comment ça marche, Tarifs et Solutions */}
            <div className="relative" ref={aboutRef}>
              <button 
                type="button"
                onClick={() => setAboutDropdownOpen(!aboutDropdownOpen)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs lg:text-sm font-medium transition-colors ${
                  aboutDropdownOpen 
                    ? 'text-[#14110F] bg-black/[0.06]' 
                    : 'text-[#4A433D] hover:text-[#14110F] hover:bg-black/[0.04]'
                }`}
                aria-expanded={aboutDropdownOpen}
              >
                <span>À Propos</span>
                <ChevronDown className={`w-3.5 h-3.5 text-[#7A7068] transition-transform duration-200 ${aboutDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {aboutDropdownOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 rounded-2xl bg-white border border-[#E5E0D8] shadow-xl p-2 space-y-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* Section 1 : Comment ça marche */}
                  <button 
                    type="button"
                    onClick={() => { 
                      scrollToSection('cashless-section'); 
                      setAboutDropdownOpen(false); 
                    }}
                    className="w-full p-2.5 rounded-xl hover:bg-[#FBF6EE] flex items-center gap-3 transition text-left group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#FFE3D3] text-[#FF6A2B] flex items-center justify-center shrink-0">
                      <Wallet className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-[#14110F] text-xs group-hover:text-[#FF6A2B] transition-colors">Comment ça marche</div>
                      <div className="text-[11px] text-[#7A7068]">Pass numérique & cashless sans contact</div>
                    </div>
                  </button>

                  {/* Section 2 : Tarifs */}
                  <button 
                    type="button"
                    onClick={() => {
                      scrollToSection('tarifs');
                      setAboutDropdownOpen(false);
                    }}
                    className="w-full p-2.5 rounded-xl hover:bg-[#FBF6EE] flex items-center gap-3 transition text-left group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#FFF3CC] text-[#14110F] flex items-center justify-center shrink-0">
                      <Receipt className="w-4 h-4 text-[#14110F]" />
                    </div>
                    <div>
                      <div className="font-semibold text-[#14110F] text-xs group-hover:text-[#FF6A2B] transition-colors">Tarifs & Pass</div>
                      <div className="text-[11px] text-[#7A7068]">Pass festivalier & 10% solidaire</div>
                    </div>
                  </button>

                  {/* Section 3 : Solutions */}
                  <button 
                    type="button"
                    onClick={() => {
                      scrollToSection('tarifs');
                      setAboutDropdownOpen(false);
                    }}
                    className="w-full p-2.5 rounded-xl hover:bg-[#FBF6EE] flex items-center gap-3 transition text-left group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#F3ECE2] text-[#4A433D] flex items-center justify-center shrink-0">
                      <Layers className="w-4 h-4 text-[#0E5A8A]" />
                    </div>
                    <div>
                      <div className="font-semibold text-[#14110F] text-xs group-hover:text-[#FF6A2B] transition-colors">Nos Solutions</div>
                      <div className="text-[11px] text-[#7A7068]">Billetterie, Cashless & Bornes POS</div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* ZONE DROITE : Actions utilisateurs (Connexion / Profil) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Profil Utilisateur / Bouton Connexion */}
            {currentUser ? (
              /* Utilisateur connecté : Pilule sobre */
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 h-9 pl-2 pr-3 rounded-full bg-white hover:bg-[#FAF8F5] border border-[#D9D0C6] transition active:scale-95 shadow-xs"
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

                    {/* Raccourci 1 : Dashboard Organisateur & Espace Standier */}
                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        openUserDashboard();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#14110F] bg-[#FAF8F5] hover:bg-[#F3ECE2] transition text-left mb-1"
                    >
                      <LayoutDashboard className="w-4 h-4 text-[#FF6A2B]" />
                      <div className="truncate">
                        <div>Dashboard de Gestion</div>
                        <div className="text-[10px] text-[#7A7068] font-normal">Publier & Espace Standier</div>
                      </div>
                    </button>

                    {/* Raccourci 2 : Portefeuille Cashless */}
                    <button
                      type="button"
                      onClick={() => navigateToClientTab('WALLET')}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#4A433D] hover:bg-[#FAF8F5] hover:text-[#14110F] transition text-left"
                    >
                      <Wallet className="w-4 h-4 text-[#FF6A2B]" />
                      <span>Mon Portefeuille</span>
                    </button>

                    {/* Raccourci 3 : Mes Billets & Pass */}
                    <button
                      type="button"
                      onClick={() => navigateToClientTab('TICKETS')}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#4A433D] hover:bg-[#FAF8F5] hover:text-[#14110F] transition text-left"
                    >
                      <Ticket className="w-4 h-4 text-[#FF6A2B]" />
                      <span>Mes Tickets & Pass</span>
                    </button>

                    {/* Raccourci 4 : Mon Profil */}
                    <button
                      type="button"
                      onClick={() => navigateToClientTab('PROFILE')}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#4A433D] hover:bg-[#FAF8F5] hover:text-[#14110F] transition text-left"
                    >
                      <User className="w-4 h-4 text-[#7A7068]" />
                      <span>Mon Profil</span>
                    </button>

                    {/* Raccourci 5 : Vérifier un Ticket */}
                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        setIsTicketVerificationOpen(true);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#4A433D] hover:bg-[#FAF8F5] hover:text-[#14110F] transition text-left"
                    >
                      <ShieldCheck className="w-4 h-4 text-[#166534]" />
                      <span>Vérifier un Billet</span>
                    </button>

                    <div className="pt-1 mt-1 border-t border-[#F3ECE2]">
                      <button
                        type="button"
                        onClick={() => {
                          logoutUser();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#C62828] hover:bg-[#FEF2F2] transition text-left"
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
                className="inline-flex items-center gap-2 h-9 px-4 sm:px-5 rounded-full bg-white hover:bg-[#FAF8F5] border border-[#D9D0C6] hover:border-[#14110F] text-xs font-bold text-[#14110F] shadow-xs transition active:scale-95"
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

              <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-[#F3ECE2]">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openUserDashboard();
                  }}
                  className="py-2 px-2 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] text-[11px] font-bold text-[#14110F] text-center"
                >
                  Dashboard
                </button>
                <button
                  type="button"
                  onClick={() => navigateToClientTab('WALLET')}
                  className="py-2 px-2 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] text-[11px] font-bold text-[#14110F] text-center"
                >
                  Portefeuille
                </button>
                <button
                  type="button"
                  onClick={() => navigateToClientTab('TICKETS')}
                  className="py-2 px-2 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] text-[11px] font-bold text-[#14110F] text-center"
                >
                  Mes Tickets
                </button>
              </div>
            </div>
          ) : (
            <div>
              <button
                type="button"
                onClick={() => {
                  setAuthModalMode('LOGIN');
                  setIsAuthModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full min-h-[44px] py-2.5 px-4 rounded-full bg-[#14110F] hover:bg-[#2A2420] text-xs font-bold text-[#FBF6EE] text-center shadow-xs flex items-center justify-center gap-2 transition"
              >
                <User className="w-4 h-4 text-[#FF6A2B]" />
                <span>Se connecter / Mon Compte</span>
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
              Événements
            </button>

            {/* Sections regroupées sous À Propos */}
            <div className="pt-2 pb-1 space-y-1">
              <span className="px-3 text-[11px] font-bold text-[#7A7068] uppercase tracking-wider block">
                À Propos
              </span>
              <button
                type="button"
                onClick={() => scrollToSection('cashless-section')}
                className="w-full text-left py-2 px-3 rounded-xl text-xs font-medium text-[#4A433D] hover:bg-white flex items-center gap-2.5"
              >
                <span className="w-2 h-2 rounded-full bg-[#FF6A2B]" />
                Comment ça marche
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('tarifs')}
                className="w-full text-left py-2 px-3 rounded-xl text-xs font-medium text-[#4A433D] hover:bg-white flex items-center gap-2.5"
              >
                <span className="w-2 h-2 rounded-full bg-[#FFC21A]" />
                Tarifs & Pass
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('tarifs')}
                className="w-full text-left py-2 px-3 rounded-xl text-xs font-medium text-[#4A433D] hover:bg-white flex items-center gap-2.5"
              >
                <span className="w-2 h-2 rounded-full bg-[#0E5A8A]" />
                Nos Solutions
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
