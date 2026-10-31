import React, { useState } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  Check, 
  PlusCircle, 
  MapPin, 
  Filter,
  ShieldCheck 
} from 'lucide-react';
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

export const CONGO_CITIES = [
  'Toutes les villes',
  'Kinshasa',
  'Lubumbashi',
  'Goma',
  'Kisangani',
  'Matadi',
  'Kolwezi',
  'Bukavu'
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
    selectedRegionFilter,
    setSelectedRegionFilter,
    publishedEvents,
    setIsTicketVerificationOpen,
    currentUser,
    setIsAuthModalOpen,
    setAuthModalMode
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

  const handleCitySelect = (city: string) => {
    setSelectedRegionFilter(city);
    const cityInfo = city !== 'Toutes les villes' ? ` à ${city}` : ' dans toute la RDC';
    setGuidanceMessage(`Filtrage activé${cityInfo}.`);
    setTimeout(() => setGuidanceMessage(null), 3000);
  };

  const handlePublishClick = () => {
    if (!currentUser) {
      setAuthModalMode('LOGIN');
      setIsAuthModalOpen(true);
    } else {
      openPublishModal();
    }
  };

  const executeSearch = (searchQuery?: string) => {
    const activeQ = searchQuery !== undefined ? searchQuery : query;
    const catInfo = selectedActivityTypeFilter !== 'Tous les types' ? ` • ${selectedActivityTypeFilter}` : '';
    const cityInfo = selectedRegionFilter !== 'Toutes les villes' ? ` • ${selectedRegionFilter}` : '';
    const msg = activeQ.trim() 
      ? `Recherche : « ${activeQ} »${catInfo}${cityInfo}...` 
      : `Filtres actifs : ${selectedActivityTypeFilter}${cityInfo}`;
    
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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-3 pb-2 space-y-3">
      
      {/* Barre Principale de Recherche — Style épuré et sobre inspiré de Tickera & Weezevent */}
      <div className="bg-white rounded-2xl md:rounded-full border border-[#D9D0C6] hover:border-[#14110F]/40 shadow-xs hover:shadow-sm transition-all p-1.5 sm:p-2">
        <form
          onSubmit={handleSearchSubmit}
          className="flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-[#ECE7DE]"
        >
          {/* Champ 1 : Recherche Texte */}
          <div className="flex-1 flex items-center gap-3 px-4 py-2 bg-white rounded-xl md:rounded-l-full">
            <div className="w-7 h-7 rounded-full bg-[#FAF8F5] flex items-center justify-center shrink-0">
              <Search className="w-3.5 h-3.5 text-[#7A7068]" />
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

          {/* Champ 2 : Sélecteur de Région / Ville (Kinshasa, Lubumbashi, Kisangani, Goma, Matadi...) */}
          <div className="flex items-center gap-3 px-4 py-2 bg-white hover:bg-[#FAF8F5] transition md:w-56 shrink-0">
            <div className="w-7 h-7 rounded-full bg-[#FAF8F5] flex items-center justify-center shrink-0">
              <MapPin className="w-3.5 h-3.5 text-[#FF6A2B]" />
            </div>
            <div className="flex-1 text-left">
              <label htmlFor="region-filter" className="block text-[10px] font-semibold uppercase tracking-wider text-[#7A7068]">
                Région / Ville
              </label>
              <select
                id="region-filter"
                value={selectedRegionFilter}
                onChange={(e) => handleCitySelect(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm font-semibold text-[#14110F] focus:outline-none cursor-pointer pr-2 truncate"
              >
                {CONGO_CITIES.map((city, idx) => (
                  <option key={idx} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Champ 3 : Filtre par Type d'Activité (Événement, Donation, Concert, Festival, Conférence) */}
          <div className="flex items-center gap-3 px-4 py-2 bg-white hover:bg-[#FAF8F5] transition md:w-56 shrink-0">
            <div className="w-7 h-7 rounded-full bg-[#FAF8F5] flex items-center justify-center shrink-0">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#14110F]" />
            </div>
            <div className="flex-1 text-left">
              <label htmlFor="category-filter" className="block text-[10px] font-semibold uppercase tracking-wider text-[#7A7068]">
                Type d'activité
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

          {/* Champ 4 : Actions (Rechercher + Publier + Vérifier Ticket) */}
          <div className="px-2 pt-1 md:pt-0 shrink-0 flex items-center gap-2">
            <button
              type="submit"
              className="flex-1 md:flex-initial h-10 px-5 rounded-xl md:rounded-full bg-[#14110F] hover:bg-[#2A2420] text-[#FBF6EE] font-bold text-xs uppercase tracking-wider shadow-xs transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Search className="w-3.5 h-3.5 text-[#FBF6EE]" />
              <span>Rechercher</span>
            </button>

            <button
              type="button"
              onClick={handlePublishClick}
              className="flex-1 md:flex-initial h-10 px-4 rounded-xl md:rounded-full bg-[#FF6A2B] hover:bg-[#E24E10] text-[#14110F] font-bold text-xs uppercase tracking-wider shadow-xs transition-all flex items-center justify-center gap-1.5 active:scale-95 shrink-0"
              title="Publier un Événement, une Donation, un Concert, un Festival ou une Conférence"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#14110F]" />
              <span>Publier</span>
            </button>
          </div>
        </form>
      </div>

      {/* Barre Secondaire : Filtres Rapides (Pills) & Outil Vérification de Billet */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
        
        {/* Pills de Catégories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A7068] flex items-center gap-1 shrink-0 mr-1">
            <Filter className="w-3 h-3 text-[#7A7068]" />
            <span>Filtres :</span>
          </span>

          {FILTER_CATEGORIES.map((cat) => {
            const isSelected = selectedActivityTypeFilter === cat;
            const count = cat === 'Tous les types' 
              ? (selectedRegionFilter === 'Toutes les villes'
                  ? publishedEvents.length
                  : publishedEvents.filter(e => e.city.toLowerCase().includes(selectedRegionFilter.toLowerCase())).length)
              : publishedEvents.filter(e => {
                  const matchesCat = e.activityType === cat;
                  const matchesCity = selectedRegionFilter === 'Toutes les villes' || e.city.toLowerCase().includes(selectedRegionFilter.toLowerCase());
                  return matchesCat && matchesCity;
                }).length;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategorySelect(cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 active:scale-95 ${
                  isSelected
                    ? 'bg-[#14110F] text-[#FBF6EE] shadow-xs'
                    : 'bg-white hover:bg-[#FAF8F5] text-[#4A433D] border border-[#D9D0C6]'
                }`}
              >
                <span>{cat === 'Tous les types' ? 'Tous' : cat}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-white/20 text-[#FFC21A]' : 'bg-[#FAF8F5] text-[#7A7068]'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Outil Rapide : Vérifier un Ticket */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsTicketVerificationOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white hover:bg-[#FAF8F5] border border-[#D9D0C6] text-xs font-semibold text-[#14110F] shadow-xs transition active:scale-95"
            title="Vérifier la validité et l'authenticité d'un ticket VUKA Pay"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#166534]" />
            <span>Vérifier un ticket</span>
          </button>
        </div>

      </div>

      {/* Message de confirmation ou filtrage actif */}
      {guidanceMessage && (
        <div className="px-4 py-2 rounded-xl bg-[#E2F3E9] border border-[#167A42]/20 text-xs text-[#167A42] font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <Check className="w-3.5 h-3.5 text-[#167A42] shrink-0" />
          <span>{guidanceMessage}</span>
        </div>
      )}

    </div>
  );
};
