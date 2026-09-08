import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Zap, Heart, Ticket } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Hero: React.FC<{ onExploreTickets: () => void }> = ({ onExploreTickets }) => {
  const { setCurrentRole } = useApp();

  return (
    <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-32">
      {/* Glow Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-[#FF5722]/20 via-[#FFB300]/15 to-transparent blur-3xl -z-10 pointer-events-none rounded-full" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-[#00D2FF]/10 blur-3xl -z-10 pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Eyebrow Tag Weezevent-Style */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/90 border border-slate-700/80 shadow-lg backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-[#FF5722] animate-ping" />
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              Édition Pilote : Congo Food Week 6 (Kinshasa)
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-xs text-[#FFB300] font-semibold">100% Cashless Souverain</span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08] mb-6">
            L'Événementiel Africain{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5722] via-[#FF8A00] to-[#FFB300]">
              Passe à la Vitesse Supérieure.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Billetterie intelligente, contrôle d'accès instantané et paiement cashless par QR Code dynamique ou bracelet RFID. Conçu pour résister aux coupures grâce au mode <span className="text-white font-semibold underline decoration-[#FF5722]">Offline-First</span> et synchronisé par Starlink.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={onExploreTickets}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#FF5722] to-[#FF7A00] hover:from-[#E64A19] hover:to-[#F57C00] text-white font-bold text-base shadow-vuka hover:shadow-glow transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-3 group"
            >
              <Ticket className="w-5 h-5 text-white" />
              <span>Acheter un Pass CFW 6</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => setCurrentRole('FESTIVALIER')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-white font-semibold text-base transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5 text-[#FFB300]" />
              <span>Tester le VUKA Wallet</span>
            </button>
          </div>

          {/* 4 Chiffres Clés du Projet */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
              <div className="text-3xl font-black text-white font-mono">25 000</div>
              <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Participants Attendus</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
              <div className="text-3xl font-black text-[#FFB300] font-mono">23 Stands</div>
              <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Exposants Équipés POS</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
              <div className="text-3xl font-black text-[#10B981] font-mono">&lt; 500ms</div>
              <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Temps d'Encaissement</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
              <div className="text-3xl font-black text-[#FF5722] font-mono">10% Solidaire</div>
              <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Fondation Congolicious</div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
