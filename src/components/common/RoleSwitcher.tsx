import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { Ticket, Wallet, Store, QrCode, ShieldCheck } from 'lucide-react';

export const RoleSwitcher: React.FC = () => {
  const { currentRole, setCurrentRole, stockRequests } = useApp();

  const pendingRequestsCount = stockRequests.filter(r => r.status === 'PENDING').length;

  const roles: { id: UserRole; title: string; desc: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'PUBLIC',
      title: 'Billetterie',
      desc: 'Landing & Tickets',
      icon: <Ticket className="w-4 h-4" />
    },
    {
      id: 'FESTIVALIER',
      title: 'VUKA Wallet',
      desc: 'QR dynamique 30s',
      icon: <Wallet className="w-4 h-4" />
    },
    {
      id: 'STAND_MANAGER',
      title: 'Caisse POS',
      desc: 'Sunmi V2S Offline',
      icon: <Store className="w-4 h-4" />
    },
    {
      id: 'STAFF_ACCESS',
      title: 'Contrôle Accès',
      desc: 'Scan Anti-Passback',
      icon: <QrCode className="w-4 h-4" />
    },
    {
      id: 'SUPER_ADMIN',
      title: 'Super Admin',
      desc: 'Trésorerie 10% & Payouts',
      icon: <ShieldCheck className="w-4 h-4" />,
      badge: pendingRequestsCount > 0 ? `${pendingRequestsCount}` : undefined
    }
  ];

  return (
    <aside aria-label="Simulateur de Rôles VUKA" className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-4 pointer-events-none">
      <div className="bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-full p-2 shadow-2xl shadow-slate-300/50 pointer-events-auto flex items-center justify-between gap-1 overflow-x-auto">
        <div className="hidden sm:flex items-center gap-2 pl-4 pr-3 text-xs font-black text-[#14110F] border-r border-slate-200 shrink-0">
          <span className="w-2 h-2 rounded-full bg-[#FF6A2B]" />
          <span>VUKA PRO</span>
        </div>

        <div className="flex items-center gap-1.5 w-full justify-around sm:justify-start">
          {roles.map(r => {
            const isActive = currentRole === r.id;
            return (
              <button
                key={r.id}
                onClick={() => setCurrentRole(r.id)}
                className={`relative flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-display font-bold transition-all shrink-0 ${
                  isActive
                    ? 'bg-[#FF6A2B] text-[#14110F] shadow-md shadow-[#FF6A2B]/20'
                    : 'text-slate-600 hover:text-[#14110F] hover:bg-[#FBF6EE]'
                }`}
              >
                {r.icon}
                <div className="text-left hidden md:block">
                  <div className="leading-tight">{r.title}</div>
                  <div className={`text-[10px] font-normal ${isActive ? 'text-[#14110F]/80' : 'text-slate-400'}`}>{r.desc}</div>
                </div>
                <div className="text-left md:hidden">
                  <span className="leading-tight">{r.title}</span>
                </div>
                {r.badge && (
                  <span className="ml-1 px-1.5 py-0.2 text-[9px] font-black bg-[#FFC21A] text-[#14110F] rounded-full animate-bounce">
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
