import React, { useState } from 'react';
import { Search, SlidersHorizontal, Check, PlusCircle, Sparkles, Filter } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ActivityType } from '../../types';

interface TicketmasterSearchHeaderProps {
  onSearchChange?: (query: string) => void;
  onFilterClick?: (category: string) => void;
  onSearchClick?: () => void;
}

export const FILTER_CATEGORIES = [
  'Tous les types',
  'Événement',
  'Donation',
  'Concert',
  'Festival',
  'Conférence'
] as const;

export const TicketmasterSearchHeader: React.FC<TicketmasterSearchHeaderProps> = ({
  onSearchChange,
  onFilterClick,
  onSearchClick,
}) => {
  const { 
    openPublishModal, 
    selectedActivityTypeFilter, 
    setSelectedActivityTypeFilter,
    publishedEvents 
  } = useApp();

  const [query, setQuery] = useState('');
  const [guidanceMessage, setGuidanceMessage] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (onSearchChange) {
      onSearchChange(val);
    }
  };

  const handleCategorySelect = (category: string) => {
    setSelectedActivityTypeFilter(category);
    if (onFilterClick) {
      onFilterClick(category);
    }
  };

  const executeSearch = (searchQuery?: string) => {
    const activeQ = searchQuery !== undefined ? searchQuery : query;
    const catInfo = selectedActivityTypeFilter !== 'Tous les types' ? ` • ${selectedActivityTypeFilter}` : '';
    const msg = activeQ.trim() 
      ? `Recherche pour « ${activeQ} »${catInfo}...` 
      : `Filtre actif : ${selectedActivityTypeFilter || 'Toutes les activités'}`;
    
    setGuidanceMessage(msg);

    setTimeout(() => {
      const el = document.getElementById('evenements');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
      setTimeout(() => setGuidanceMessage(null), 3000);
    }, 200);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch();
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-2 space-y-3">
      
      {/* Barre Principale de Recherche et Actions : Contour Braise (#FF6A2B) et Intérieur Blanc */}
      <div className="bg-white rounded-2xl md:rounded-full border-2 border-[#FF6A2B] shadow-sm hover:shadow-md transition-all p-1.5 sm:p-2">
        <form
          onSubmit={handleSearchSubmit}
          className="flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-[#F3ECE2]"
        >
          {/* Champ 1 : Recherche Texte (Fond Blanc) */}
          <div className="flex-1 flex items-center gap-3 px-4 py-2 bg-white rounded-xl md:rounded-l-full">
            <div className="w-8 h-8 rounded-full bg-[#FBF6EE] flex items-center justify-center shrink-0">
              <Search className="w-4 h-4 text-[#7A7068]" />
            </div>
            <div className="flex-1 text-left min-w-0 bg-white">
              <label htmlFor="search-input" className="block text-[10px] font-semibold uppercase tracking-wider text-[#7A7068]">
                Rechercher une activité
              </label>
              <input
                id="search-input"
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="Ex : Congo Food Week, Rumba Live, Cantines, Sommet..."
                className="w-full bg-white text-xs sm:text-sm font-medium text-[#14110F] placeholder:text-[#7A7068] focus:outline-none"
              />
            </div>
            {query && (
              <button
                type="button"
                onClick={() => { setQuery(''); if (onSearchChange) onSearchChange(''); }}
                className="text-[#7A7068] hover:text-[#14110F] text-xs px-2 font-medium"
              >
                Effacer
              </button>
            )}
          </div>

          {/* Champ 2 : Filtre Requis (Événement, Donation, Concert, Festival, Conférence) */}
          <div className="flex items-center gap-3 px-4 py-2 bg-white hover:bg-[#FBF6EE]/60 transition md:w-64 shrink-0">
            <div className="w-8 h-8 rounded-full bg-[#FBF6EE] flex items-center justify-center shrink-0">
              <SlidersHorizontal className="w-4 h-4 text-[#FF6A2B]" />
            </div>
            <div className="flex-1 text-left">
              <label htmlFor="category-filter" className="block text-[10px] font-semibold uppercase tracking-wider text-[#7A7068]">
                Filtre par type
              </label>
              <select
                id="category-filter"
                value={selectedActivityTypeFilter}
                onChange={(e) => handleCategorySelect(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm font-semibold text-[#14110F] focus:outline-none cursor-pointer pr-2 truncate"
              >
                {FILTER_CATEGORIES.map((cat, idx) => (
                  <option key={idx} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Champ 3 : Boutons d'Action (Rechercher + Publier) */}
          <div className="px-2 pt-1 md:pt-0 shrink-0 flex items-center gap-2">
            <button
              type="submit"
              className="flex-1 md:flex-initial h-11 px-6 rounded-xl md:rounded-full bg-[#FF6A2B] hover:bg-[#E24E10] text-[#14110F] font-bold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Search className="w-4 h-4 text-[#14110F]" />
              <span>Rechercher</span>
            </button>

            {/* Bouton Publier avec sélection de type d'activité */}
            <button
              type="button"
              onClick={() => openPublishModal()}
              className="flex-1 md:flex-initial h-11 px-5 rounded-xl md:rounded-full bg-[#14110F] hover:bg-[#2A2420] text-[#FFC21A] font-bold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95 shrink-0"
              title="Publier un Événement, une Donation, un Concert, un Festival ou une Conférence"
            >
              <PlusCircle className="w-4 h-4 text-[#FFC21A]" />
              <span>Publier</span>
            </button>
          </div>
        </form>
      </div>

      {/* Barre de Filtres Rapides (Pills) : evenement, donation, concert, festival, conference */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 no-scrollbar">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A7068] flex items-center gap-1.5 shrink-0 pl-1 mr-1">
          <Filter className="w-3.5 h-3.5 text-[#FF6A2B]" />
          <span>Filtres :</span>
        </span>

        {FILTER_CATEGORIES.map((cat) => {
          const isSelected = selectedActivityTypeFilter === cat;
          const count = cat === 'Tous les types' 
            ? publishedEvents.length 
            : publishedEvents.filter(e => e.activityType === cat).length;

          return (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategorySelect(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 active:scale-95 ${
                isSelected
                  ? 'bg-[#14110F] text-[#FFC21A] shadow-xs'
                  : 'bg-white hover:bg-[#F3ECE2] text-[#4A433D] border border-[#D9D0C6]'
              }`}
            >
              <span>{cat === 'Tous les types' ? 'Tous' : cat}</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                isSelected ? 'bg-white/20 text-[#FFC21A]' : 'bg-[#FBF6EE] text-[#7A7068]'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Guidance Message Banner */}
      {guidanceMessage && (
        <div className="px-4 py-2 rounded-xl bg-[#E2F3E9] border border-[#167A42]/20 text-xs text-[#167A42] font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <Check className="w-4 h-4 text-[#167A42] shrink-0" />
          <span>{guidanceMessage}</span>
        </div>
      )}

    </div>
  );
};
