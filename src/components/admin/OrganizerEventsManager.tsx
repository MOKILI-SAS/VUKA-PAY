import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { VukaPublishedEvent } from '../../types';
import { formatUSD, formatCDF } from '../../utils/formatters';
import { 
  Calendar, 
  MapPin, 
  Ticket, 
  Users, 
  DollarSign, 
  PlusCircle, 
  CheckCircle2, 
  TrendingUp, 
  Building2, 
  Clock, 
  QrCode,
  ArrowRight
} from 'lucide-react';

export const OrganizerEventsManager: React.FC = () => {
  const { publishedEvents, addOrganizerEvent, setAppViewMode } = useApp();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('CONCERT LIVE & MUSIQUE');
  const [dateStr, setDateStr] = useState('');
  const [location, setLocation] = useState('');
  const [city, setCity] = useState('Kinshasa, Gombe');
  const [priceUSD, setPriceUSD] = useState('15');
  const [capacity, setCapacity] = useState('2000');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dateStr.trim() || !location.trim()) return;

    const numPrice = Number(priceUSD) || 10;
    const numCapacity = Number(capacity) || 1000;

    addOrganizerEvent({
      title: title.trim(),
      category: category.toUpperCase(),
      badge: 'BILLETTERIE OUVERTE',
      dateStr: dateStr.trim(),
      location: location.trim(),
      city: city.trim(),
      priceFrom: `Dès ${numPrice} $ (${(numPrice * 2750).toLocaleString()} CDF)`,
      status: 'OPEN',
      totalCapacity: numCapacity,
      organizerName: 'Mon Organisation',
      isFeatured: false
    });

    // Reset
    setTitle('');
    setDateStr('');
    setLocation('');
    setShowCreateForm(false);
    setSuccessMessage(`L'événement « ${title.trim()} » a été publié avec succès sur VUKA Pay !`);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-[24px] bg-white border border-[#D9D0C6] shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFE3D3] text-[#14110F] text-xs font-bold uppercase tracking-wider mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A2B]" />
            <span>Pilotage Organisateur VUKA</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-[#14110F] font-heading">
            Gestion & Suivi en Direct de vos Événements
          </h3>
          <p className="text-xs text-[#7A7068] mt-0.5">
            Publiez vos événements, suivez vos quotas de billetterie et visualisez les flux d'entrées scannées en temps réel.
          </p>
        </div>

        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#FF6A2B] hover:bg-[#E24E10] text-[#14110F] font-bold text-xs uppercase tracking-wider shadow-sm transition active:scale-95 shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-[#14110F]" />
          <span>{showCreateForm ? 'Fermer le formulaire' : 'Poster un nouvel événement'}</span>
        </button>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-[#E2F3E9] border border-[#167A42]/20 text-xs text-[#167A42] font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Creation Form Panel */}
      {showCreateForm && (
        <div className="p-6 sm:p-8 rounded-[28px] bg-white border-2 border-[#FF6A2B] shadow-lg animate-in slide-in-from-top-4 duration-200">
          <div className="mb-6">
            <h4 className="text-lg font-bold text-[#14110F] font-heading">
              Formulaire de Publication d'Événement
            </h4>
            <p className="text-xs text-[#7A7068] mt-0.5">
              Remplissez les informations ci-dessous pour ouvrir immédiatement la billetterie sur VUKA Pay.
            </p>
          </div>

          <form onSubmit={handleCreateSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Titre */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#14110F] uppercase tracking-wider mb-1.5">
                Nom officiel de l'événement *
              </label>
              <input
                type="text"
                required
                placeholder="Ex : Kinshasa Fashion & Music Night 2026"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FBF6EE] border border-[#D9D0C6] focus:border-[#FF6A2B] focus:bg-white text-xs font-semibold text-[#14110F] outline-none"
              />
            </div>

            {/* Catégorie */}
            <div>
              <label className="block text-xs font-bold text-[#14110F] uppercase tracking-wider mb-1.5">
                Catégorie d'événement
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FBF6EE] border border-[#D9D0C6] focus:border-[#FF6A2B] focus:bg-white text-xs font-semibold text-[#14110F] outline-none cursor-pointer"
              >
                <option value="CONCERT LIVE & MUSIQUE">Concert Live & Musique</option>
                <option value="GASTRONOMIE & FOIRES">Gastronomie & Foires</option>
                <option value="INNOVATION & SALONS PRO">Innovation & Salons Pro</option>
                <option value="FESTIVAL CULTUREL">Festival Culturel</option>
                <option value="GALA & SOIRÉE PRIVÉE">Gala & Soirée Privée</option>
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-bold text-[#14110F] uppercase tracking-wider mb-1.5">
                Date(s) & Période *
              </label>
              <input
                type="text"
                required
                placeholder="Ex : 18 – 20 Décembre 2026"
                value={dateStr}
                onChange={(e) => setDateStr(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FBF6EE] border border-[#D9D0C6] focus:border-[#FF6A2B] focus:bg-white text-xs font-semibold text-[#14110F] outline-none"
              />
            </div>

            {/* Lieu */}
            <div>
              <label className="block text-xs font-bold text-[#14110F] uppercase tracking-wider mb-1.5">
                Lieu précis *
              </label>
              <input
                type="text"
                required
                placeholder="Ex : Showbuzz, Académie des Beaux-Arts..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FBF6EE] border border-[#D9D0C6] focus:border-[#FF6A2B] focus:bg-white text-xs font-semibold text-[#14110F] outline-none"
              />
            </div>

            {/* Ville */}
            <div>
              <label className="block text-xs font-bold text-[#14110F] uppercase tracking-wider mb-1.5">
                Ville / Commune
              </label>
              <input
                type="text"
                required
                placeholder="Ex : Kinshasa, Gombe"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FBF6EE] border border-[#D9D0C6] focus:border-[#FF6A2B] focus:bg-white text-xs font-semibold text-[#14110F] outline-none"
              />
            </div>

            {/* Tarif initial */}
            <div>
              <label className="block text-xs font-bold text-[#14110F] uppercase tracking-wider mb-1.5">
                Prix d'entrée de base ($ USD)
              </label>
              <input
                type="number"
                min="1"
                required
                placeholder="15"
                value={priceUSD}
                onChange={(e) => setPriceUSD(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FBF6EE] border border-[#D9D0C6] focus:border-[#FF6A2B] focus:bg-white text-xs font-mono font-bold text-[#14110F] outline-none"
              />
            </div>

            {/* Capacité maximale */}
            <div>
              <label className="block text-xs font-bold text-[#14110F] uppercase tracking-wider mb-1.5">
                Jauge / Capacité maximale (places)
              </label>
              <input
                type="number"
                min="50"
                required
                placeholder="2000"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FBF6EE] border border-[#D9D0C6] focus:border-[#FF6A2B] focus:bg-white text-xs font-mono font-bold text-[#14110F] outline-none"
              />
            </div>

            <div className="md:col-span-2 pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-5 py-2.5 rounded-full bg-[#F3ECE2] text-[#4A433D] font-semibold text-xs transition"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-[#FF6A2B] hover:bg-[#E24E10] text-[#14110F] font-bold text-xs uppercase tracking-wider transition active:scale-95 shadow-sm"
              >
                Publier sur VUKA Pay
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Real-time Tracking Cards List */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-[#14110F] uppercase tracking-wider">
          Déroulement & Statistiques en Direct ({publishedEvents.length} Événements)
        </h4>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {publishedEvents.map((evt) => {
            const fillRate = evt.totalCapacity > 0 ? Math.round((evt.ticketsSold / evt.totalCapacity) * 100) : 0;
            return (
              <div
                key={evt.id}
                className="p-6 rounded-[24px] bg-white border border-[#D9D0C6] shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  {/* Top Badge & Status */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FFE3D3] text-[#14110F] uppercase tracking-wider border border-[#FF6A2B]/20">
                      {evt.category}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#E2F3E9] text-[#167A42]">
                      {evt.status === 'OPEN' ? 'En vente active' : 'À venir'}
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-[#14110F] font-heading leading-snug">
                    {evt.title}
                  </h4>

                  <div className="mt-2 space-y-1 text-xs text-[#7A7068]">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#FF6A2B]" />
                      <span>{evt.dateStr}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#7A7068]" />
                      <span>{evt.location} • {evt.city}</span>
                    </div>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="pt-4 border-t border-[#F3ECE2] grid grid-cols-3 gap-3 text-center">
                  <div className="p-2.5 rounded-xl bg-[#FBF6EE]">
                    <span className="block text-[10px] font-semibold text-[#7A7068] uppercase">Ventes</span>
                    <div className="text-base font-bold text-[#14110F] font-mono tnum mt-0.5">
                      {evt.ticketsSold} / {evt.totalCapacity}
                    </div>
                    <div className="text-[10px] text-[#FF6A2B] font-bold font-mono">
                      {fillRate}% jauge
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#FBF6EE]">
                    <span className="block text-[10px] font-semibold text-[#7A7068] uppercase">Recettes</span>
                    <div className="text-base font-bold text-[#167A42] font-mono tnum mt-0.5">
                      {formatUSD(evt.revenueUSD)}
                    </div>
                    <div className="text-[10px] text-[#7A7068] font-mono">
                      ≈ {formatCDF(evt.revenueUSD)}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#FBF6EE]">
                    <span className="block text-[10px] font-semibold text-[#7A7068] uppercase">Entrées Portes</span>
                    <div className="text-base font-bold text-[#0E5A8A] font-mono tnum mt-0.5">
                      {evt.scannedEntries}
                    </div>
                    <div className="text-[10px] text-[#7A7068]">
                      scannées en direct
                    </div>
                  </div>
                </div>

                {/* Bottom Progress Bar */}
                <div>
                  <div className="w-full bg-[#F3ECE2] rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-[#FF6A2B] h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(fillRate, 100)}%` }}
                    />
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
