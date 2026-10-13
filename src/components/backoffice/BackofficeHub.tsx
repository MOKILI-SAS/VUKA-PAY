import React from 'react';
import { useApp } from '../../context/AppContext';
import { BackofficeModule } from '../../types';
import { 
  Store, 
  QrCode, 
  ShieldCheck, 
  ArrowLeft, 
  Sparkles, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Globe,
  SlidersHorizontal,
  Layers
} from 'lucide-react';
import { POSTerminal } from '../pos/POSTerminal';
import { AccessControlView } from '../access/AccessControlView';
import { AdminDashboard } from '../admin/AdminDashboard';

export const BackofficeHub: React.FC = () => {
  const { 
    setAppViewMode, 
    activeBackofficeModule, 
    setActiveBackofficeModule,
    isOffline,
    setIsOffline,
    offlineQueueCount,
    syncOfflineQueue,
    stockRequests,
    totalAttendeesEntered
  } = useApp();

  const pendingRequestsCount = stockRequests.filter(r => r.status === 'PENDING').length;

  const modules: { id: BackofficeModule; title: string; subtitle: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'POS_TERMINAL',
      title: 'Caisse POS Commerçant',
      subtitle: '23 Stands Sunmi V2S Offline',
      icon: <Store className="w-4 h-4" />
    },
    {
      id: 'ACCESS_CONTROL',
      title: 'Contrôle d’Accès Portes',
      subtitle: `${totalAttendeesEntered} entrées scannées`,
      icon: <QrCode className="w-4 h-4" />
    },
    {
      id: 'SUPER_ADMIN',
      title: 'Console Super Admin',
      subtitle: 'Trésorerie 10% & Payouts',
      icon: <ShieldCheck className="w-4 h-4" />,
      badge: pendingRequestsCount > 0 ? `${pendingRequestsCount}` : undefined
    }
  ];

  return (
    <div className="min-h-screen bg-[#FBF6EE] text-[#14110F] flex flex-col">
      {/* 1. Pro Header Bar */}
      <header className="sticky top-0 z-40 bg-[#14110F] text-white border-b border-[#2A2420] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4 py-3">
          
          {/* Left Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FF6A2B] flex items-center justify-center font-black text-[#14110F] text-xl shadow-sm font-poppins">
              V
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight font-poppins">
                  vuka<span className="text-[#FF6A2B]">backoffice</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#2A2420] border border-[#38312B] text-[10px] font-black uppercase text-[#FFC21A] tracking-wider">
                  Staff Pro
                </span>
              </div>
              <p className="text-[10px] text-[#9C9488] font-mono hidden sm:block">
                Congo Food Week 6 • Plateforme d'Exploitation Sécurisée
              </p>
            </div>
          </div>

          {/* Center Connectivity & Starlink Status */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setIsOffline(!isOffline)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition border ${
                isOffline
                  ? 'bg-amber-950/60 border-amber-600/50 text-amber-300'
                  : 'bg-[#0E5A8A]/20 border-[#0E5A8A]/40 text-[#E3EEF6]'
              }`}
              title="Cliquer pour simuler coupure / rétablissement Starlink"
            >
              {isOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
              <span>{isOffline ? 'Mode Offline HMAC' : 'Liaison Starlink Active'}</span>
            </button>

            {offlineQueueCount > 0 && (
              <button
                onClick={() => syncOfflineQueue()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FF6A2B] text-[#14110F] text-xs font-bold animate-pulse hover:bg-[#E24E10] transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Synchroniser ({offlineQueueCount})</span>
              </button>
            )}
          </div>

          {/* Right: Exit to Public Website Button */}
          <button
            onClick={() => setAppViewMode('PUBLIC_LANDING')}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#2A2420] hover:bg-[#38312B] text-white font-bold text-xs uppercase tracking-wider border border-[#38312B] transition active:scale-95 shadow-sm"
          >
            <Globe className="w-3.5 h-3.5 text-[#FF6A2B]" />
            <span>Retour au Site Public</span>
          </button>

        </div>
      </header>

      {/* 2. Module Selector Sub-bar */}
      <div className="bg-white border-b border-[#E5E0D8] px-4 sm:px-6 lg:px-8 py-2.5 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto">
          <div className="flex items-center gap-2">
            {modules.map((m) => {
              const isActive = activeBackofficeModule === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setActiveBackofficeModule(m.id)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
                    isActive
                      ? 'bg-[#FF6A2B] text-[#14110F] shadow-md font-black'
                      : 'bg-[#F5F3EF] hover:bg-[#E5E0D8] text-[#4A443D]'
                  }`}
                >
                  <div className={isActive ? 'text-[#14110F]' : 'text-[#9C9488]'}>
                    {m.icon}
                  </div>
                  <div className="text-left">
                    <div className="leading-tight font-black font-poppins">{m.title}</div>
                    <div className={`text-[10px] font-normal ${isActive ? 'text-[#14110F]/80' : 'text-[#9C9488]'}`}>
                      {m.subtitle}
                    </div>
                  </div>
                  {m.badge && (
                    <span className="ml-1 px-1.5 py-0.2 text-[9px] font-black bg-[#14110F] text-[#FFC21A] rounded-full animate-bounce">
                      {m.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs text-[#9C9488] font-mono">
            <span>Terminal LAB3 Cloud</span>
            <span>•</span>
            <span>Auth RBAC M02</span>
          </div>
        </div>
      </div>

      {/* 3. Main Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeBackofficeModule === 'POS_TERMINAL' && <POSTerminal />}
        {activeBackofficeModule === 'ACCESS_CONTROL' && <AccessControlView />}
        {activeBackofficeModule === 'SUPER_ADMIN' && <AdminDashboard />}
      </main>

      {/* 4. Pro Footer */}
      <footer className="bg-white border-t border-[#E5E0D8] py-4 px-4 text-center text-xs text-[#9C9488]">
        <p>VUKA Backoffice v2.6 • Terminal d'administration réservé au personnel accrédité • <a href="https://mokili.io" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF6A2B]">Propulsé par MOKILI</a></p>
      </footer>
    </div>
  );
};
