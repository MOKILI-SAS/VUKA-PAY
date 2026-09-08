import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatUSD, formatCDF } from '../../utils/formatters';
import { Utensils, Search, MapPin, Store, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export const StandsMenuExplorer: React.FC = () => {
  const { stands, menuItems, setCurrentRole, setActiveStandId } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const filteredStands = stands.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.locationZone.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleTestStandPOS = (standId: string) => {
    setActiveStandId(standId);
    setCurrentRole('STAND_MANAGER');
  };

  return (
    <div className="space-y-6">
      
      {/* Search & Stats Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Store className="w-5 h-5 text-[#FFB300]" />
            <span>Les 23 Stands Exposants du CFW6</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Découvrez les menus, spécialités et passez commande directement aux stands
          </p>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher un stand, grillade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF5722]"
          />
        </div>
      </div>

      {/* Grid of Stands */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStands.map((stand) => {
          const standItems = menuItems.filter(m => m.standId === stand.id);

          return (
            <div
              key={stand.id}
              className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between shadow-lg"
            >
              <div>
                {/* Header Stand */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-800 text-[#FFB300] border border-slate-700">
                      Stand #{stand.number.toString().padStart(2, '0')}
                    </span>
                    <h4 className="text-base font-bold text-white mt-1.5 leading-snug">
                      {stand.name}
                    </h4>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Ouvert</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-4">
                  <MapPin className="w-3.5 h-3.5 text-[#FF5722] shrink-0" />
                  <span className="truncate">{stand.locationZone}</span>
                </div>

                {/* Specialties preview */}
                <div className="space-y-2 mb-6">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Spécialités au menu :</div>
                  {standItems.length > 0 ? (
                    standItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-950/60 border border-slate-800/60">
                        <div>
                          <div className="font-medium text-slate-200">{item.name}</div>
                          <div className="text-[10px] text-slate-400">
                            Stock : {item.currentStock > 0 ? `${item.currentStock} dispo` : <span className="text-red-400">Rupture</span>}
                          </div>
                        </div>
                        <div className="text-right font-mono font-bold text-white">
                          <div>{formatUSD(item.priceUSD)}</div>
                          <div className="text-[9px] text-[#FFB300] font-normal">≈ {formatCDF(item.priceUSD)}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-slate-500 italic p-2">
                      Menu disponible sur le terminal de caisse du stand.
                    </div>
                  )}
                </div>
              </div>

              {/* Action to switch role and test this stand POS */}
              <button
                onClick={() => handleTestStandPOS(stand.id)}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition flex items-center justify-center gap-2 group"
              >
                <span>Tester la caisse POS de ce stand</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
};
