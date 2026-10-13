import React from 'react';
import { useApp } from '../../context/AppContext';
import { TicketDefinition } from '../../types';
import { formatUSD, formatCDF } from '../../utils/formatters';
import { Ticket, Check, Clock, Calendar, Users } from 'lucide-react';

export const TicketCatalog: React.FC<{ onBuyClick: (ticket: TicketDefinition) => void }> = ({ onBuyClick }) => {
  const { tickets } = useApp();

  return (
    <section id="billetterie" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white rounded-[24px] my-8 border border-[#D9D0C6] shadow-level1">
      
      {/* Title & Context */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFE3D3] border border-[#FF6A2B]/20 text-xs font-bold text-[#14110F] uppercase tracking-wider mb-4">
          <Ticket className="w-3.5 h-3.5 text-[#FF6A2B]" />
          <span>VUKA Ticket — Billetterie Officielle CFW 6</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-bold text-[#14110F] tracking-tight mb-4 font-heading">
          Choisissez votre Pass pour le Congo Food Week 6
        </h2>
        <p className="text-[#7A7068] text-sm sm:text-base">
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
              className={`relative rounded-[20px] p-7 flex flex-col justify-between transition-all duration-300 ${
                isFeatured
                  ? 'bg-white border-2 border-[#FF6A2B] shadow-level2 lg:-translate-y-2'
                  : 'bg-[#FBF6EE] border border-[#D9D0C6] hover:border-[#FF6A2B]/50 shadow-level1'
              }`}
            >
              {/* Popular Badge */}
              {isFeatured && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#FFC21A] text-[11px] font-bold uppercase tracking-wider text-[#14110F] shadow-sm">
                  <span>Le Plus Populaire • Pass 6 Jours</span>
                </div>
              )}

              <div>
                {/* Header Card */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full border border-[#D9D0C6] shadow-sm"
                      style={{ backgroundColor: t.color }}
                      title={`Couleur du bracelet physique : ${t.name}`}
                    />
                    <span className="text-xs font-mono font-bold text-[#7A7068]">
                      {t.dayLabel || 'Accès 6 Jours'}
                    </span>
                  </div>

                  <span className="text-[11px] font-semibold text-[#4A433D] px-2.5 py-1 rounded-full bg-white border border-[#D9D0C6]">
                    Reste : {t.remainingQuantity}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[#14110F] mb-2 leading-tight font-heading">
                  {t.name}
                </h3>

                <p className="text-xs text-[#7A7068] mb-6 leading-relaxed">
                  {t.description}
                </p>

                {/* Price Display */}
                <div className="mb-6 p-4 rounded-[12px] bg-white border border-[#D9D0C6]">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-[#14110F] font-mono tnum">
                      {formatUSD(t.priceUSD)}
                    </span>
                    <span className="text-xs text-[#7A7068] font-semibold">/ participant</span>
                  </div>
                  <div className="text-xs text-[#FF6A2B] font-bold font-mono tnum mt-0.5">
                    ≈ {formatCDF(t.priceUSD)}
                  </div>
                </div>

                {/* Feature List */}
                <ul className="space-y-2.5 mb-8 text-xs text-[#4A433D] font-medium">
                  {t.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#FF6A2B] shrink-0 mt-0.5 stroke-[2.5]" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button Pill — Règle : Texte Nuit sur Braise */}
              <button
                onClick={() => onBuyClick(t)}
                className={`w-full py-3.5 px-4 rounded-full font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                  isFeatured
                    ? 'bg-[#FF6A2B] hover:bg-[#E24E10] text-[#14110F] shadow-sm active:scale-95'
                    : 'bg-white hover:bg-[#FFE3D3] hover:border-[#FF6A2B] text-[#14110F] border border-[#D9D0C6] active:scale-95'
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
