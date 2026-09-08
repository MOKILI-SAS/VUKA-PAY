import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatUSD, formatCDF } from '../../utils/formatters';
import { Store, TrendingUp, Trophy, Search, Heart } from 'lucide-react';

export const StandPerformance: React.FC = () => {
  const { stands } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  // Trier les stands par chiffre d'affaires décroissant
  const sortedStands = [...stands].sort((a, b) => b.totalSalesUSD - a.totalSalesUSD);

  const filtered = sortedStands.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.number.toString().includes(searchTerm) ||
    s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#FFB300]" />
            <span>Classement & Performance des 23 Stands</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Suivi des ventes, volume de commandes et déduction de la commission solidaire 10%
          </p>
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filtrer un stand ou numéro..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF5722]"
          />
        </div>
      </div>

      {/* Table / List View */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Rang & Stand</th>
                <th className="py-3.5 px-4">Responsable & Contact M-Pesa</th>
                <th className="py-3.5 px-4 text-center">Commandes</th>
                <th className="py-3.5 px-4 text-right">CA Brut</th>
                <th className="py-3.5 px-4 text-right text-[#FF5722]">Comm. 10% Fdt</th>
                <th className="py-3.5 px-4 text-right text-emerald-400">Net Dû Stand (90%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filtered.map((stand, index) => {
                const commission = stand.totalSalesUSD * 0.10;
                const netPayout = stand.totalSalesUSD - commission;

                return (
                  <tr key={stand.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
                          index === 0 ? 'bg-[#FFB300] text-slate-950 font-black' :
                          index === 1 ? 'bg-slate-300 text-slate-950' :
                          index === 2 ? 'bg-amber-700 text-white' :
                          'bg-slate-800 text-slate-400'
                        }`}>
                          {index + 1}
                        </span>
                        <div>
                          <div className="font-bold text-white text-sm">{stand.name}</div>
                          <div className="text-[10px] text-slate-400">Stand #{stand.number.toString().padStart(2, '0')} • {stand.category}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-slate-300">{stand.ownerName}</div>
                      <div className="text-[10px] font-mono text-slate-500">{stand.ownerPhoneMpesa}</div>
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono">
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-bold">
                        {stand.transactionsCount}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-white text-sm">
                      <div>{formatUSD(stand.totalSalesUSD)}</div>
                      <div className="text-[10px] text-slate-500 font-normal">≈ {formatCDF(stand.totalSalesUSD)}</div>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-[#FF5722]">
                      -{formatUSD(commission)}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-black text-emerald-400 text-sm">
                      {formatUSD(netPayout)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
