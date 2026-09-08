import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { 
  Ticket, 
  Wallet, 
  Store, 
  QrCode, 
  ShieldCheck, 
  Wifi, 
  WifiOff, 
  Menu, 
  X,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { formatUSD } from '../../utils/formatters';

export const Header: React.FC = () => {
  const { 
    currentRole, 
    setCurrentRole, 
    wallet, 
    stands, 
    activeStandId,
    isOffline, 
    setIsOffline,
    offlineQueueCount,
    syncOfflineQueue
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const activeStand = stands.find(s => s.id === activeStandId);

  const handleSync = async () => {
    setIsSyncing(true);
    await syncOfflineQueue();
    setIsSyncing(false);
  };

  const navItems: { role: UserRole; label: string; icon: React.ReactNode; badgeColor: string }[] = [
    { role: 'PUBLIC', label: 'Vitrine & Billets', icon: <Ticket className="w-4 h-4" />, badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    { role: 'FESTIVALIER', label: 'VUKA Wallet', icon: <Wallet className="w-4 h-4" />, badgeColor: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
    { role: 'STAND_MANAGER', label: 'Caisse POS Stand', icon: <Store className="w-4 h-4" />, badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    { role: 'STAFF_ACCESS', label: 'Contrôle Accès', icon: <QrCode className="w-4 h-4" />, badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    { role: 'SUPER_ADMIN', label: 'Super Admin', icon: <ShieldCheck className="w-4 h-4" />, badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0A0D17]/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo VUKA */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentRole('PUBLIC')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF5722] via-[#FF7A00] to-[#FFB300] flex items-center justify-center font-black text-white shadow-vuka text-xl tracking-wider">
              V
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  VUKA<span className="text-[#FF5722]">Pay</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold rounded-md bg-[#FF5722]/10 text-[#FF5722] border border-[#FF5722]/20 uppercase">
                  CFW 6
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono tracking-wider">100% CASHLESS RDC</p>
            </div>
          </div>

          {/* Navigation Rôles Desktop (Inspiration Weezevent Tabs) */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
            {navItems.map(item => {
              const isActive = currentRole === item.role;
              return (
                <button
                  key={item.role}
                  onClick={() => setCurrentRole(item.role)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive 
                      ? 'bg-gradient-to-r from-[#FF5722] to-[#FF7A00] text-white shadow-vuka' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Status Bar / Actions */}
          <div className="flex items-center gap-3">
            
            {/* Context Widget (Wallet solde ou Stand actif) */}
            {currentRole === 'FESTIVALIER' && (
              <div 
                onClick={() => setCurrentRole('FESTIVALIER')}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-[#FF5722]/30 text-xs cursor-pointer hover:border-[#FF5722] transition"
              >
                <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></div>
                <span className="text-slate-400 font-medium">Solde :</span>
                <span className="font-bold text-white font-mono">{formatUSD(wallet.balanceUSD)}</span>
              </div>
            )}

            {currentRole === 'STAND_MANAGER' && activeStand && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-[#FFB300]/30 text-xs">
                <Store className="w-3.5 h-3.5 text-[#FFB300]" />
                <span className="font-medium text-slate-300 truncate max-w-[140px]">{activeStand.name}</span>
              </div>
            )}

            {/* Offline Simulation Toggle & Starlink Status */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsOffline(!isOffline)}
                title={isOffline ? "Mode hors-ligne actif (cliquez pour reconnecter Starlink)" : "En ligne via Starlink (cliquez pour tester le mode hors-ligne)"}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                  isOffline
                    ? 'bg-red-500/10 text-red-400 border-red-500/30'
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                }`}
              >
                {isOffline ? (
                  <>
                    <WifiOff className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                    <span className="hidden sm:inline">Offline</span>
                  </>
                ) : (
                  <>
                    <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="hidden sm:inline">Starlink OK</span>
                  </>
                )}
              </button>

              {/* Offline Queue Badge & Sync Button */}
              {offlineQueueCount > 0 && (
                <button
                  onClick={handleSync}
                  disabled={isOffline || isSyncing}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-[#FFB300] text-slate-950 hover:bg-[#FFA000] disabled:opacity-50 transition shadow-sm"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Synchro ({offlineQueueCount})</span>
                </button>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-[#0A0D17] px-4 py-4 space-y-2">
          <div className="text-xs font-bold text-slate-500 uppercase px-2 mb-2">Choisir une interface</div>
          {navItems.map(item => {
            const isActive = currentRole === item.role;
            return (
              <button
                key={item.role}
                onClick={() => {
                  setCurrentRole(item.role);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-semibold transition ${
                  isActive 
                    ? 'bg-gradient-to-r from-[#FF5722] to-[#FF7A00] text-white shadow-vuka' 
                    : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                <ArrowRight className="w-4 h-4 opacity-50" />
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
