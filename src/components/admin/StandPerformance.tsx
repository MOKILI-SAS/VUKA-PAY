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
          <h3 className="text-lg font-bold text-white flex items-center gap-2 font-poppins">
            <Trophy className="w-5 h-5 text-[#FFC21A]" />
            <span>Classement & Performance des 23 Stands</span>
          </h3>
          <p className="text-xs text-[#9C9488] mt-0.5">
            Suivi des ventes, volume de commandes et déduction de la commission solidaire 10%
          </p>
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-[#9C9488] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filtrer un stand ou numéro..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#14110F] border border-[#2A2420] text-xs text-white placeholder-[#9C9488] focus:outline-none focus:border-[#FF6A2B]"
          />
        </div>
      </div>

      {/* Table / List View */}
      <div className="bg-[#1E1A17] border border-[#2A2420] rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#14110F] text-[#9C9488] uppercase font-bold text-[10px] tracking-wider border-b border-[#2A2420]">
              <tr>
                <th className="py-3.5 px-4">Rang & Stand</th>
                <th className="py-3.5 px-4">Responsable & Contact M-Pesa</th>
                <th className="py-3.5 px-4 text-center">Commandes</th>
                <th className="py-3.5 px-4 text-right">CA Brut</th>
                <th className="py-3.5 px-4 text-right text-[#FF6A2B]">Comm. 10% Fdt</th>
                <th className="py-3.5 px-4 text-right text-[#167A42]">Net Dû Stand (90%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2420] font-medium">
              {filtered.map((stand, index) => {
                const commission = stand.totalSalesUSD * 0.10;
                const netPayout = stand.totalSalesUSD - commission;

                return (
                  <tr key={stand.id} className="hover:bg-[#14110F]/50 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
                          index === 0 ? 'bg-[#FFC21A] text-[#14110F] font-black' :
                          index === 1 ? 'bg-slate-300 text-slate-950 font-bold' :
                          index === 2 ? 'bg-[#FF6A2B] text-[#14110F] font-bold' :
                          'bg-[#14110F] text-[#9C9488]'
                        }`}>
                          {index + 1}
                        </span>
                        <div>
                          <div className="font-bold text-white text-sm font-poppins">{stand.name}</div>
                          <div className="text-[10px] text-[#9C9488]">Stand #{stand.number.toString().padStart(2, '0')} • {stand.category}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-[#F5F3EF]">{stand.ownerName}</div>
                      <div className="text-[10px] font-mono text-[#9C9488]">{stand.ownerPhoneMpesa}</div>
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono">
                      <span className="px-2 py-0.5 rounded-md bg-[#14110F] text-[#F5F3EF] font-bold border border-[#2A2420]">
                        {stand.transactionsCount}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-white text-sm">
                      <div>{formatUSD(stand.totalSalesUSD)}</div>
                      <div className="text-[10px] text-[#9C9488] font-normal">≈ {formatCDF(stand.totalSalesUSD)}</div>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-[#FF6A2B]">
                      -{formatUSD(commission)}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-black text-[#167A42] text-sm">
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
