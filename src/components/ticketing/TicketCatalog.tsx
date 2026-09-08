import React from 'react';
import { useApp } from '../../context/AppContext';
import { TicketDefinition } from '../../types';
import { formatUSD, formatCDF } from '../../utils/formatters';
import { Ticket, Check, Sparkles, Clock, Calendar, Users } from 'lucide-react';

export const TicketCatalog: React.FC<{ onBuyClick: (ticket: TicketDefinition) => void }> = ({ onBuyClick }) => {
  const { tickets } = useApp();

  return (
    <section id="billetterie" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Title & Context */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF5722]/10 border border-[#FF5722]/20 text-xs font-bold text-[#FF5722] uppercase tracking-wider mb-4">
          <Ticket className="w-3.5 h-3.5" />
          <span>VUKA Ticket — Billetterie Officielle</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
          Choisissez votre Pass pour le Congo Food Week 6
        </h2>
        <p className="text-slate-400 text-sm sm:text-base">
          Chaque pass donne droit à un bracelet sécurisé à puce RFID pour régler vos consommations sur les 23 stands sans espèces. Les fonds non dépensés sont remboursables.
        </p>
      </div>

      {/* Grid of Tickets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
        {tickets.map((t) => {
          const isFeatured = t.category === '6_DAYS_PREMIUM';
          return (
            <div
              key={t.id}
              className={`relative rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 ${
                isFeatured
                  ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-[#121829] border-2 border-[#FF5722] shadow-vuka lg:-translate-y-2'
                  : 'bg-slate-900/60 border border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Popular Badge */}
              {isFeatured && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#FF5722] to-[#FF7A00] text-[11px] font-black uppercase tracking-wider text-white shadow-md flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  <span>Le Plus Populaire • Pass 6 Jours</span>
                </div>
              )}

              <div>
                {/* Header Card */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                      style={{ backgroundColor: t.color }}
                      title={`Couleur du bracelet physique : ${t.name}`}
                    />
                    <span className="text-xs font-mono font-bold text-slate-400">
                      {t.dayLabel || 'Accès 6 Jours'}
                    </span>
                  </div>

                  <span className="text-[11px] font-medium text-slate-400 px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700">
                    Reste : {t.remainingQuantity}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 leading-tight">
                  {t.name}
                </h3>

                <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                  {t.description}
                </p>

                {/* Price Display */}
                <div className="mb-6 p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-white font-mono">
                      {formatUSD(t.priceUSD)}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">/ participant</span>
                  </div>
                  <div className="text-xs text-[#FFB300] font-mono mt-0.5">
                    ≈ {formatCDF(t.priceUSD)}
                  </div>
                </div>

                {/* Feature List */}
                <ul className="space-y-2.5 mb-8 text-xs text-slate-300">
                  {t.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onBuyClick(t)}
                className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                  isFeatured
                    ? 'bg-gradient-to-r from-[#FF5722] to-[#FF7A00] hover:from-[#E64A19] hover:to-[#F57C00] text-white shadow-vuka'
                    : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                }`}
              >
                <Ticket className="w-4 h-4" />
                <span>Prendre mon Pass</span>
              </button>
            </div>
          );
        })}
      </div>

    </section>
  );
};
