import React, { useState } from 'react';
import { Search, SlidersHorizontal, Check } from 'lucide-react';

interface TicketmasterSearchHeaderProps {
  onSearchChange?: (query: string) => void;
  onFilterClick?: (category: string) => void;
  onSearchClick?: () => void;
}

const SEARCH_CATEGORIES = [
  'Tous les événements',
  'Festivals & Gastronomie',
  'Concerts Live & Musique',
  'Pass & Billetterie',
  'Salons & Conférences',
  'Stands & Restauration'
];

export const TicketmasterSearchHeader: React.FC<TicketmasterSearchHeaderProps> = ({
  onSearchChange,
  onFilterClick,
  onSearchClick,
}) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(SEARCH_CATEGORIES[0]);
  const [guidanceMessage, setGuidanceMessage] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (onSearchChange) {
      onSearchChange(val);
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cat = e.target.value;
    setSelectedCategory(cat);
    if (onFilterClick) {
      onFilterClick(cat);
    }
  };

  const executeSearch = (searchQuery?: string) => {
    const activeQ = searchQuery !== undefined ? searchQuery : query;
    const catInfo = selectedCategory !== SEARCH_CATEGORIES[0] ? ` • ${selectedCategory}` : '';
    const msg = activeQ.trim() 
      ? `Recherche pour « ${activeQ} »${catInfo}... Redirection vers la billetterie` 
      : `Affichage des événements${catInfo}...`;
    
    setGuidanceMessage(msg);

    setTimeout(() => {
      if (onSearchClick) {
        onSearchClick();
      } else {
        const el = document.getElementById('billetterie');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
      setTimeout(() => setGuidanceMessage(null), 3000);
    }, 200);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch();
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-2">
      {/* Search Master Box: Contour Orange (#FF6A2B) et Intérieur Blanc */}
      <div className="bg-white rounded-2xl md:rounded-full border-2 border-[#FF6A2B] shadow-sm hover:shadow-md transition-all p-1.5 sm:p-2">
        <form
          onSubmit={handleSearchSubmit}
          className="flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-[#F3ECE2]"
        >
          {/* Champ 1 : Recherche Texte (Champ Blanc) */}
          <div className="flex-1 flex items-center gap-3 px-4 py-2 bg-white rounded-xl md:rounded-l-full">
            <div className="w-8 h-8 rounded-full bg-[#FBF6EE] flex items-center justify-center shrink-0">
              <Search className="w-4 h-4 text-[#7A7068]" />
            </div>
            <div className="flex-1 text-left min-w-0 bg-white">
              <label htmlFor="search-input" className="block text-[10px] font-semibold uppercase tracking-wider text-[#7A7068]">
                Rechercher un événement
              </label>
              <input
                id="search-input"
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="Ex : Congo Food Week, Pass Découverte, stand, concert..."
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

          {/* Champ 2 : Filtre de Catégories (Filtre d'élément de recherche) */}
          <div className="flex items-center gap-3 px-4 py-2 bg-white hover:bg-[#FBF6EE]/60 transition md:w-72 shrink-0">
            <div className="w-8 h-8 rounded-full bg-[#FBF6EE] flex items-center justify-center shrink-0">
              <SlidersHorizontal className="w-4 h-4 text-[#FF6A2B]" />
            </div>
            <div className="flex-1 text-left">
              <label htmlFor="category-filter" className="block text-[10px] font-semibold uppercase tracking-wider text-[#7A7068]">
                Filtre de recherche
              </label>
              <select
                id="category-filter"
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="w-full bg-transparent text-xs sm:text-sm font-semibold text-[#14110F] focus:outline-none cursor-pointer pr-2 truncate"
              >
                {SEARCH_CATEGORIES.map((cat, idx) => (
                  <option key={idx} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Champ 3 : Bouton de Recherche Orange */}
          <div className="px-2 pt-1 md:pt-0 shrink-0">
            <button
              type="submit"
              className="w-full md:w-auto h-11 px-7 rounded-xl md:rounded-full bg-[#FF6A2B] hover:bg-[#E24E10] text-[#14110F] font-bold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Search className="w-4 h-4 text-[#14110F]" />
              <span>Rechercher</span>
            </button>
          </div>
        </form>
      </div>

      {/* Guidance Message Banner */}
      {guidanceMessage && (
        <div className="mt-2.5 px-4 py-2 rounded-xl bg-[#E2F3E9] border border-[#167A42]/20 text-xs text-[#167A42] font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <Check className="w-4 h-4 text-[#167A42] shrink-0" />
          <span>{guidanceMessage}</span>
        </div>
      )}
    </div>
  );
};
