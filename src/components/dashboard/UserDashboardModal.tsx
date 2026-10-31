import React, { useState } from 'react';
import { 
  X, 
  PlusCircle, 
  Store, 
  Calendar, 
  TrendingUp, 
  Ticket, 
  Wallet, 
  User, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Building2,
  Phone,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ActivityType } from '../../types';
import { formatUSD } from '../../utils/formatters';

export const UserDashboardModal: React.FC = () => {
  const { 
    isUserDashboardOpen, 
    setIsUserDashboardOpen,
    userDashboardInitialTab,
    openPublishModal,
    publishedEvents,
    standApplications,
    submitStandApplication,
    currentUser,
    setAppViewMode,
    setActiveClientTab,
    wallet,
    setActiveBackofficeModule
  } = useApp();

  const [activeTab, setActiveTab] = useState<'PUBLISH' | 'STANDIER' | 'MY_ACTIVITIES'>(userDashboardInitialTab || 'PUBLISH');

  // Standier form state
  const [selectedEventId, setSelectedEventId] = useState(publishedEvents[0]?.id || 'cfw-6');
  const [standName, setStandName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [phoneMpesa, setPhoneMpesa] = useState(currentUser?.phone || '+243 ');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isUserDashboardOpen) return null;

  const handleClose = () => {
    setIsUserDashboardOpen(false);
    setSuccessMessage(null);
  };

  const handlePublishType = (type: ActivityType) => {
    setIsUserDashboardOpen(false);
    openPublishModal(type);
  };

  const handleStandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!standName.trim() || !specialty.trim()) return;

    const chosenEvent = publishedEvents.find(e => e.id === selectedEventId) || publishedEvents[0];

    submitStandApplication({
      eventId: chosenEvent.id,
      eventName: chosenEvent.title,
      standName: standName.trim(),
      specialty: specialty.trim(),
      applicantName: currentUser?.name || 'Gérant Standier',
      applicantPhone: phoneMpesa.trim(),
      applicantEmail: currentUser?.email || 'gerant@standier.vuka.cd'
    });

    setSuccessMessage(`Votre candidature pour le stand « ${standName} » sur ${chosenEvent.title} a été soumise avec succès.`);
    setStandName('');
    setSpecialty('');
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const navigateToTab = (tab: 'TICKETS' | 'WALLET' | 'PROFILE') => {
    setIsUserDashboardOpen(false);
    setAppViewMode('CLIENT_PORTAL');
    setActiveClientTab(tab);
  };

  const launchPOSStandier = () => {
    setIsUserDashboardOpen(false);
    setActiveBackofficeModule('POS_TERMINAL');
    setAppViewMode('BACKOFFICE_STAFF');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-white rounded-[28px] border border-[#D9D0C6] shadow-2xl p-6 sm:p-8 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header du Dashboard */}
        <div className="flex items-start justify-between pb-4 border-b border-[#F3ECE2]">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF6A2B]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#FF6A2B]">
                Dashboard de Gestion
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#14110F] font-heading mt-1">
              Espace Organisateur & Standier
            </h2>
            <p className="text-xs text-[#7A7068]">
              Connecté en tant que <strong className="text-[#14110F]">{currentUser?.name || 'Utilisateur'}</strong> • {currentUser?.phone || currentUser?.email}
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-[#FAF8F5] hover:bg-[#F3ECE2] text-[#7A7068] hover:text-[#14110F] flex items-center justify-center transition"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation des 3 Onglets Principaux */}
        <div className="flex items-center gap-2 pt-3 pb-2 border-b border-[#F3ECE2] overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('PUBLISH')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'PUBLISH'
                ? 'bg-[#14110F] text-[#FBF6EE]'
                : 'bg-[#FAF8F5] text-[#4A433D] hover:bg-[#F3ECE2]'
            }`}
          >
            <PlusCircle className="w-4 h-4 text-[#FF6A2B]" />
            <span>Publier une Activité</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('STANDIER')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'STANDIER'
                ? 'bg-[#14110F] text-[#FBF6EE]'
                : 'bg-[#FAF8F5] text-[#4A433D] hover:bg-[#F3ECE2]'
            }`}
          >
            <Store className="w-4 h-4 text-[#FFC21A]" />
            <span>Espace Standier ({standApplications.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('MY_ACTIVITIES')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'MY_ACTIVITIES'
                ? 'bg-[#14110F] text-[#FBF6EE]'
                : 'bg-[#FAF8F5] text-[#4A433D] hover:bg-[#F3ECE2]'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-[#0E5A8A]" />
            <span>Activités & Billetterie ({publishedEvents.length})</span>
          </button>
        </div>

        {/* Contenu Déroulant selon l'onglet actif */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 no-scrollbar">
          
          {/* ONGLET 1 : PUBLIER UNE ACTIVITÉ */}
          {activeTab === 'PUBLISH' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-[#14110F] uppercase tracking-wider">
                  Choisissez le format d'activité à publier
                </h3>
                <p className="text-xs text-[#7A7068]">
                  Votre annonce sera immédiatement vérifiée et affichée sur la vitrine et dans le Mini-Hero.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  {
                    type: 'Festival' as ActivityType,
                    title: 'Festival & Foire',
                    desc: 'Grands rassemblements culinaires, artistiques et culturels avec multi-stands.',
                    color: '#FF6A2B'
                  },
                  {
                    type: 'Concert' as ActivityType,
                    title: 'Concert & Live Show',
                    desc: 'Spectacles musicaux, scènes ouvertes et shows pyrotechniques.',
                    color: '#FFC21A'
                  },
                  {
                    type: 'Donation' as ActivityType,
                    title: 'Donation & Campagne',
                    desc: 'Collectes solidaires, cantines scolaires et causes d\'impact.',
                    color: '#166534'
                  },
                  {
                    type: 'Conférence' as ActivityType,
                    title: 'Conférence & Sommet',
                    desc: 'Keynotes, forums économiques B2B et salons professionnels.',
                    color: '#0E5A8A'
                  },
                  {
                    type: 'Événement' as ActivityType,
                    title: 'Événement & Gala',
                    desc: 'Banquets diplomatiques, avant-premières et soirées privées.',
                    color: '#14110F'
                  }
                ].map((item) => (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => handlePublishType(item.type)}
                    className="p-4 rounded-2xl border border-[#E5E0D8] hover:border-[#14110F] bg-white hover:bg-[#FAF8F5] text-left transition-all shadow-xs hover:shadow-sm group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span 
                          className="w-2.5 h-2.5 rounded-full" 
                          style={{ backgroundColor: item.color }} 
                        />
                        <span className="text-[10px] font-bold text-[#7A7068] uppercase font-mono">
                          {item.type}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-[#14110F] group-hover:text-[#FF6A2B] transition-colors font-heading">
                        {item.title}
                      </h4>
                      <p className="text-xs text-[#7A7068] mt-1 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-[#F3ECE2] flex items-center justify-between text-xs font-bold text-[#FF6A2B]">
                      <span>Publier ce type</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ONGLET 2 : ESPACE STANDIER */}
          {activeTab === 'STANDIER' && (
            <div className="space-y-5">
              
              {/* Formulaire Candidature de Stand */}
              <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] space-y-3">
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-[#FF6A2B]" />
                  <h3 className="text-sm font-bold text-[#14110F] uppercase tracking-wider">
                    Postuler pour un Stand Exposant dans une activité
                  </h3>
                </div>
                <p className="text-xs text-[#7A7068]">
                  Vous êtes restaurateur, grillardier, traiteur ou artisan ? Déposez votre demande d'attribution de stand pour vendre avec les terminaux Sunmi V2S et le cashless VUKA.
                </p>

                {successMessage && (
                  <div className="p-3 rounded-xl bg-[#E2F3E9] text-[#166534] text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{successMessage}</span>
                  </div>
                )}

                <form onSubmit={handleStandSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#7A7068] mb-1">
                      Activité / Festival cible
                    </label>
                    <select
                      value={selectedEventId}
                      onChange={(e) => setSelectedEventId(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#D9D0C6] bg-white text-xs font-semibold text-[#14110F] focus:outline-none"
                    >
                      {publishedEvents.map((e) => (
                        <option key={e.id} value={e.id}>
                          {e.title} ({e.city})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#7A7068] mb-1">
                      Nom de l'Enseigne / Stand
                    </label>
                    <input
                      type="text"
                      value={standName}
                      onChange={(e) => setStandName(e.target.value)}
                      placeholder="Ex : Chez Ntemba Grillades"
                      className="w-full p-2.5 rounded-xl border border-[#D9D0C6] bg-white text-xs font-medium text-[#14110F] focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#7A7068] mb-1">
                      Spécialité culinaire ou produits
                    </label>
                    <input
                      type="text"
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value)}
                      placeholder="Ex : Capitaine Braisé, Kamundele, Cocktails"
                      className="w-full p-2.5 rounded-xl border border-[#D9D0C6] bg-white text-xs font-medium text-[#14110F] focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#7A7068] mb-1">
                      Numéro M-Pesa du Gérant (Payouts)
                    </label>
                    <input
                      type="text"
                      value={phoneMpesa}
                      onChange={(e) => setPhoneMpesa(e.target.value)}
                      placeholder="+243 81 234 5678"
                      className="w-full p-2.5 rounded-xl border border-[#D9D0C6] bg-white text-xs font-medium text-[#14110F] focus:outline-none"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2 pt-2 flex items-center justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-full bg-[#FF6A2B] hover:bg-[#E24E10] text-[#14110F] font-bold text-xs uppercase tracking-wider shadow-xs transition active:scale-95"
                    >
                      Déposer ma Candidature de Standier
                    </button>
                  </div>
                </form>
              </div>

              {/* Liste des Candidatures & Stands Existants */}
              <div>
                <h4 className="text-xs font-bold text-[#14110F] uppercase tracking-wider mb-2">
                  Mes Stands & Candidatures Déposées
                </h4>

                <div className="space-y-2">
                  {standApplications.map((app) => (
                    <div 
                      key={app.id} 
                      className="p-3.5 rounded-xl border border-[#E5E0D8] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[#14110F]">{app.standName}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            app.status === 'APPROVED' 
                              ? 'bg-[#E2F3E9] text-[#166534]' 
                              : 'bg-[#FFFBEB] text-[#B45309]'
                          }`}>
                            {app.status === 'APPROVED' ? `Stand Validé (N° ${app.allocatedStandNumber || 1})` : 'En Attente de Validation'}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#7A7068] mt-0.5">
                          {app.eventName} • Spécialité : {app.specialty}
                        </div>
                      </div>

                      {app.status === 'APPROVED' && (
                        <button
                          type="button"
                          onClick={launchPOSStandier}
                          className="px-3.5 py-1.5 rounded-lg bg-[#14110F] hover:bg-[#2A2420] text-[#FFC21A] text-xs font-semibold transition active:scale-95 shrink-0 flex items-center gap-1.5"
                        >
                          <Store className="w-3.5 h-3.5 text-[#FFC21A]" />
                          <span>Ouvrir Caisse POS Stand</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ONGLET 3 : MES ACTIVITÉS & STATISTIQUES */}
          {activeTab === 'MY_ACTIVITIES' && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-[#14110F] uppercase tracking-wider">
                Activités sous votre supervision
              </h3>

              <div className="space-y-2">
                {publishedEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-4 rounded-2xl border border-[#E5E0D8] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-[#FAF8F5] border border-[#E5E0D8] text-[10px] font-bold uppercase text-[#7A7068]">
                          {evt.activityType}
                        </span>
                        <h4 className="font-bold text-sm text-[#14110F]">{evt.title}</h4>
                      </div>
                      <div className="text-xs text-[#7A7068]">
                        {evt.dateStr} • {evt.location} ({evt.city})
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F3ECE2]">
                      <div>
                        <div className="text-[10px] text-[#7A7068] uppercase font-semibold">Billets vendus</div>
                        <div className="font-bold text-[#14110F] font-mono">{evt.ticketsSold} / {evt.totalCapacity}</div>
                      </div>

                      <div>
                        <div className="text-[10px] text-[#7A7068] uppercase font-semibold">Recettes</div>
                        <div className="font-bold text-[#FF6A2B] font-mono">{formatUSD(evt.revenueUSD)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer avec Raccourcis Rapides (Portefeuille, Mes Tickets, Mon Profil) */}
        <div className="pt-3 border-t border-[#F3ECE2] flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigateToTab('WALLET')}
              className="px-3 py-1.5 rounded-lg bg-[#FAF8F5] hover:bg-[#F3ECE2] text-[#14110F] font-semibold transition flex items-center gap-1.5"
            >
              <Wallet className="w-3.5 h-3.5 text-[#FF6A2B]" />
              <span>Portefeuille ({formatUSD(wallet.balanceUSD)})</span>
            </button>

            <button
              type="button"
              onClick={() => navigateToTab('TICKETS')}
              className="px-3 py-1.5 rounded-lg bg-[#FAF8F5] hover:bg-[#F3ECE2] text-[#14110F] font-semibold transition flex items-center gap-1.5"
            >
              <Ticket className="w-3.5 h-3.5 text-[#FF6A2B]" />
              <span>Mes Tickets</span>
            </button>

            <button
              type="button"
              onClick={() => navigateToTab('PROFILE')}
              className="px-3 py-1.5 rounded-lg bg-[#FAF8F5] hover:bg-[#F3ECE2] text-[#14110F] font-semibold transition flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5 text-[#7A7068]" />
              <span>Mon Profil</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="text-[#7A7068] hover:text-[#14110F] font-bold"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
};
