import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  ShieldCheck,
  Check
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
  'Conférence',
  'É-vote'
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
    selectedActivityTypeFilter, 
    setSelectedActivityTypeFilter,
    selectedRegionFilter,
    setSelectedRegionFilter,
    publishedEvents,
    setIsTicketVerificationOpen
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
    setGuidanceMessage(`Filtrage actif${cityInfo}.`);
    setTimeout(() => setGuidanceMessage(null), 3000);
  };

  const executeSearch = (searchQuery?: string) => {
    const activeQ = searchQuery !== undefined ? searchQuery : query;
    const catInfo = selectedActivityTypeFilter !== 'Tous les types' ? ` • ${selectedActivityTypeFilter}` : '';
    const cityInfo = selectedRegionFilter !== 'Toutes les villes' ? ` • ${selectedRegionFilter}` : '';
    const msg = activeQ.trim() 
      ? `Recherche pour « ${activeQ} »${catInfo}${cityInfo}...` 
      : `Filtres actifs : ${selectedActivityTypeFilter}${cityInfo}`;
    
    setGuidanceMessage(msg);

    setTimeout(() => {
      const el = document.getElementById('evenements');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
      setTimeout(() => setGuidanceMessage(null), 3000);
    }, 150);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch();
  };

  return (
    <div id="recherche-evenements" className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-2 space-y-3">
      
      {/* 1. BARRE DE RECHERCHE SIMPLE & ÉPURÉE (Style Eventbrite) */}
      <div className="bg-white rounded-full border border-[#D9D0C6] hover:border-[#14110F]/40 shadow-xs hover:shadow-sm transition-all p-1.5 sm:p-2">
        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center gap-3 px-4 py-1.5"
        >
          <Search className="w-4 h-4 text-[#7A7068] shrink-0" />
          
          <input
            id="search-input"
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Rechercher des événements, concerts, festivals, artistes ou villes..."
            className="w-full bg-white text-xs sm:text-sm font-medium text-[#14110F] placeholder:text-[#7A7068] focus:outline-none"
          />

          {query && (
            <button
              type="button"
              onClick={() => { setQuery(''); if (onSearchChange) onSearchChange(''); }}
              className="text-[#7A7068] hover:text-[#14110F] text-xs px-2 font-medium shrink-0"
            >
              Effacer
            </button>
          )}

          <button
            type="submit"
            className="h-9 px-5 rounded-full bg-[#14110F] hover:bg-[#2A2420] text-[#FBF6EE] font-bold text-xs uppercase tracking-wider transition active:scale-95 shrink-0"
          >
            Rechercher
          </button>
        </form>
      </div>

      {/* 2. LIGNE UNIFIÉE : FILTRES DE CATÉGORIES + SÉLECTEUR DE VILLE + VÉRIFIER TICKET */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-1">
        
        {/* Catégories (Tous, Événement, Donation, Concert, Festival, Conférence, É-vote) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
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
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 active:scale-95 ${
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

        {/* Côté Droit : Sélecteur de Région/Ville + Bouton Vérifier Ticket sur la même ligne */}
        <div className="flex items-center gap-2.5 shrink-0 self-start lg:self-auto">
          {/* Sélecteur de Région / Ville */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#D9D0C6] text-xs font-semibold text-[#14110F] shadow-xs">
            <MapPin className="w-3.5 h-3.5 text-[#FF6A2B] shrink-0" />
            <select
              value={selectedRegionFilter}
              onChange={(e) => handleCitySelect(e.target.value)}
              className="bg-transparent text-xs font-semibold text-[#14110F] focus:outline-none cursor-pointer pr-1"
            >
              {CONGO_CITIES.map((city, idx) => (
                <option key={idx} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Bouton Vérifier Ticket */}
          <button
            type="button"
            onClick={() => setIsTicketVerificationOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-[#FAF8F5] border border-[#D9D0C6] text-xs font-semibold text-[#14110F] shadow-xs transition active:scale-95"
            title="Vérifier la validité et l'authenticité d'un ticket VUKA Pay"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#166534]" />
            <span>Vérifier un ticket</span>
          </button>
        </div>

      </div>

      {/* Message de confirmation discret */}
      {guidanceMessage && (
        <div className="px-3.5 py-1.5 rounded-xl bg-[#E2F3E9] border border-[#167A42]/20 text-xs text-[#167A42] font-semibold flex items-center gap-2 animate-in fade-in duration-150">
          <Check className="w-3.5 h-3.5 text-[#166534] shrink-0" />
          <span>{guidanceMessage}</span>
        </div>
      )}

    </div>
  );
};
