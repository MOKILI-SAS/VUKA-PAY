import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { Ticket, Wallet, Store, QrCode, ShieldCheck, Sparkles } from 'lucide-react';

export const RoleSwitcher: React.FC = () => {
  const { currentRole, setCurrentRole, stockRequests } = useApp();

  const pendingRequestsCount = stockRequests.filter(r => r.status === 'PENDING').length;

  const roles: { id: UserRole; title: string; desc: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'PUBLIC',
      title: '1. Vitrine & Billets',
      desc: 'Inspiration Weezevent & Achat Pass',
      icon: <Ticket className="w-4 h-4 text-blue-400" />
    },
    {
      id: 'FESTIVALIER',
      title: '2. VUKA Wallet',
      desc: 'Recharge M-Pesa & QR dynamique 30s',
      icon: <Wallet className="w-4 h-4 text-[#FF5722]" />
    },
    {
      id: 'STAND_MANAGER',
      title: '3. Caisse POS Stand',
      desc: 'Sunmi V2S / Mobile & Offline-First',
      icon: <Store className="w-4 h-4 text-[#FFB300]" />
    },
    {
      id: 'STAFF_ACCESS',
      title: '4. Contrôle d’Accès',
      desc: 'Scan entrées, Anti-Passback & RFID',
      icon: <QrCode className="w-4 h-4 text-[#10B981]" />
    },
    {
      id: 'SUPER_ADMIN',
      title: '5. Super Admin',
      desc: 'Trésorerie, Comm. 10% & Réassorts',
      icon: <ShieldCheck className="w-4 h-4 text-purple-400" />,
      badge: pendingRequestsCount > 0 ? `${pendingRequestsCount} réassort` : undefined
    }
  ];

  return (
    <aside aria-label="Simulateur de Rôles VUKA" className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-4 pointer-events-none">
      <div className="bg-[#0A0D17]/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-2 shadow-2xl pointer-events-auto flex items-center justify-between gap-1 overflow-x-auto">
        <div className="hidden sm:flex items-center gap-2 pl-3 pr-2 text-xs font-bold text-slate-400 border-r border-slate-800 shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-[#FF5722]" />
          <span>SIMULATEUR DE RÔLES</span>
        </div>

        <div className="flex items-center gap-1.5 w-full justify-around sm:justify-start">
          {roles.map(r => {
            const isActive = currentRole === r.id;
            return (
              <button
                key={r.id}
                onClick={() => setCurrentRole(r.id)}
                className={`relative flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                  isActive
                    ? 'bg-slate-800 text-white ring-2 ring-[#FF5722] shadow-lg'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                {r.icon}
                <div className="text-left hidden md:block">
                  <div className="leading-tight">{r.title}</div>
                  <div className="text-[10px] text-slate-500 font-normal">{r.desc}</div>
                </div>
                <div className="text-left md:hidden">
                  <span className="leading-tight">{r.title.split('.')[1] || r.title}</span>
                </div>
                {r.badge && (
                  <span className="ml-1 px-1.5 py-0.5 text-[9px] font-bold bg-[#FF5722] text-white rounded-full animate-bounce">
                    {r.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
