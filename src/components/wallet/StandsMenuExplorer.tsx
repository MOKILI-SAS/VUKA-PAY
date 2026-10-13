import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatUSD, formatCDF } from '../../utils/formatters';
import { Utensils, Search, MapPin, Store, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export const StandsMenuExplorer: React.FC = () => {
  const { stands, menuItems, setCurrentRole, setActiveStandId } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

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
          <h3 className="text-xl font-black text-[#14110F] flex items-center gap-2 font-poppins">
            <Store className="w-5 h-5 text-[#FF6A2B]" />
            <span>Les 23 Stands Exposants du CFW6</span>
          </h3>
          <p className="text-xs text-[#9C9488] mt-0.5">
            Découvrez les menus, spécialités et passez commande directement aux stands
          </p>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-[#9C9488] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher un stand, grillade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-full bg-white border border-[#E5E0D8] text-xs text-[#14110F] placeholder-[#9C9488] focus:outline-none focus:border-[#FF6A2B] shadow-sm"
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
              className="p-5 rounded-[28px] bg-white border border-[#E5E0D8] hover:border-[#FF6A2B]/40 hover:shadow-md transition flex flex-col justify-between shadow-sm"
            >
              <div>
                {/* Header Stand */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#FFE3D3] text-[#FF6A2B] border border-[#FF6A2B]/20">
                      Stand #{stand.number.toString().padStart(2, '0')}
                    </span>
                    <h4 className="text-base font-black text-[#14110F] mt-1.5 leading-snug font-poppins">
                      {stand.name}
                    </h4>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-[#167A42] bg-[#167A42]/10 px-2 py-0.5 rounded-full border border-[#167A42]/20 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#167A42] animate-pulse"></span>
                    <span>Ouvert</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-[#9C9488] mb-4 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#FF6A2B] shrink-0" />
                  <span className="truncate">{stand.locationZone}</span>
                </div>

                {/* Specialties preview */}
                <div className="space-y-2 mb-6">
                  <div className="text-[10px] font-bold text-[#9C9488] uppercase tracking-wider">Spécialités au menu :</div>
                  {standItems.length > 0 ? (
                    standItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-xs p-2 rounded-xl bg-[#FBF6EE] border border-[#E5E0D8]">
                        <div>
                          <div className="font-bold text-[#14110F]">{item.name}</div>
                          <div className="text-[10px] text-[#9C9488]">
                            Stock : {item.currentStock > 0 ? `${item.currentStock} dispo` : <span className="text-[#C62828] font-bold">Rupture</span>}
                          </div>
                        </div>
                        <div className="text-right font-mono font-black text-[#14110F]">
                          <div>{formatUSD(item.priceUSD)}</div>
                          <div className="text-[9px] text-[#FF6A2B] font-bold">≈ {formatCDF(item.priceUSD)}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-[#9C9488] italic p-2">
                      Menu disponible sur le terminal de caisse du stand.
                    </div>
                  )}
                </div>
              </div>

              {/* Action to switch role and test this stand POS */}
              <button
                onClick={() => handleTestStandPOS(stand.id)}
                className="w-full py-2.5 px-3 rounded-full bg-[#FBF6EE] hover:bg-[#FFE3D3] hover:border-[#FF6A2B] hover:text-[#14110F] border border-[#E5E0D8] text-xs font-bold text-[#14110F] transition flex items-center justify-center gap-2 group active:scale-95"
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
