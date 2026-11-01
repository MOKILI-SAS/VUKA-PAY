import React, { useState, useEffect, useMemo } from 'react';
import { TicketDefinition, PurchasedTicket, VukaPublishedEvent } from '../../types';
import { useApp } from '../../context/AppContext';
import { formatUSD, formatCDF } from '../../utils/formatters';
import { X, ShieldCheck, CheckCircle2, ArrowRight, Smartphone, Mail, User, AlertCircle, LogIn, Calendar, MapPin } from 'lucide-react';
import confetti from 'canvas-confetti';
import { TicketPassView } from './TicketPassView';

interface EventTierOption {
  id: string;
  name: string;
  description: string;
  priceUSD: number;
  dayLabel?: string;
  badge?: string;
}

interface CheckoutModalProps {
  event?: VukaPublishedEvent | null;
  ticket?: TicketDefinition | null;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ event, ticket, onClose }) => {
  const { 
    currentUser, 
    buyTicket, 
    tickets,
    publishedEvents,
    setIsAuthModalOpen, 
    setAuthModalMode,
    setAppViewMode,
    setActiveClientTab
  } = useApp();

  // Identifier l'événement actif
  const activeEvent: VukaPublishedEvent | null = useMemo(() => {
    if (event) return event;
    if (ticket) {
      return publishedEvents.find(e => e.id === 'cfw-6') || null;
    }
    return publishedEvents[0] || null;
  }, [event, ticket, publishedEvents]);

  // Détection multi-jours et extraction du tarif de base
  const { isMultiDay, isDonation, availableTiers } = useMemo(() => {
    if (!activeEvent) {
      return {
        isMultiDay: false,
        isDonation: false,
        availableTiers: tickets.map(t => ({
          id: t.id,
          name: t.name,
          description: t.description,
          priceUSD: t.priceUSD,
          dayLabel: t.dayLabel || 'Accès Officiel'
        }))
      };
    }

    const isDonationEvent = activeEvent.activityType === 'Donation';
    const dateStrLower = (activeEvent.dateStr || '').toLowerCase();
    const isMultiDayEvent = 
      dateStrLower.includes(' au ') || 
      dateStrLower.includes(' - ') || 
      activeEvent.activityType === 'Festival';

    // Extraire le prix numérique depuis priceFrom (ex: "Dès 15 $ (41 250 CDF)" -> 15)
    const priceMatch = (activeEvent.priceFrom || '').match(/(\d+)\s*\$/);
    const basePrice = priceMatch ? parseInt(priceMatch[1], 10) : 10;

    // 1. Événement Congo Food Week 6 (festival officiel phare)
    if (activeEvent.id === 'cfw-6') {
      const cfwTiers: EventTierOption[] = [
        {
          id: 'pass-j1',
          name: 'Pass Découverte (1 Jour au choix)',
          description: 'Accès complet au site du festival pour 1 journée, aux 23 stands et aux concerts.',
          priceUSD: 5,
          dayLabel: 'Accès 1 Jour'
        },
        {
          id: 'pass-6-days',
          name: 'Pass 6 Jours Intégral',
          description: 'Accès illimité du mardi 22 au dimanche 27 sept. Bracelet RFID inclus.',
          priceUSD: 20,
          dayLabel: 'Pass 6 Jours',
          badge: 'Meilleure Vente'
        },
        {
          id: 'pass-vip-lounge',
          name: 'Pass VIP Lounge & Coupe-File',
          description: 'Entrée prioritaire Porte VIP, lounge climatisé et dégustations offertes.',
          priceUSD: 50,
          dayLabel: 'Coupe-File VIP',
          badge: 'Privilège'
        }
      ];
      return { isMultiDay: true, isDonation: false, availableTiers: cfwTiers };
    }

    // 2. Événement de Donation solidaire
    if (isDonationEvent) {
      const donationTiers: EventTierOption[] = [
        {
          id: `${activeEvent.id}-don-std`,
          name: 'Don Standard Solidaire',
          description: 'Financement direct d’un repas scolaire nutritif en milieu défavorisé.',
          priceUSD: Math.max(2, basePrice),
          dayLabel: 'Don Ponctuel'
        },
        {
          id: `${activeEvent.id}-don-soutien`,
          name: 'Don de Soutien Semaine',
          description: 'Prise en charge d’un panier repas hebdomadaire pour un enfant.',
          priceUSD: Math.max(10, basePrice * 5),
          dayLabel: 'Soutien Hebdo',
          badge: 'Impact Recommandé'
        },
        {
          id: `${activeEvent.id}-don-bienfaiteur`,
          name: 'Don Grand Bienfaiteur',
          description: 'Financement mensuel complet pour une classe rurale.',
          priceUSD: Math.max(50, basePrice * 25),
          dayLabel: 'Grand Bienfaiteur'
        }
      ];
      return { isMultiDay: false, isDonation: true, availableTiers: donationTiers };
    }

    // 3. Événement Multi-Jours (Festival, Salon sur plusieurs dates)
    if (isMultiDayEvent) {
      const multiTiers: EventTierOption[] = [
        {
          id: `${activeEvent.id}-tier-day`,
          name: 'Pass 1 Jour / Découverte',
          description: 'Accès valable pour une journée complète au choix de l’événement.',
          priceUSD: basePrice,
          dayLabel: 'Accès 1 Jour'
        },
        {
          id: `${activeEvent.id}-tier-all`,
          name: 'Pass Intégral Multi-Jours',
          description: `Accès illimité pour l'ensemble des journées (${activeEvent.dateStr}).`,
          priceUSD: Math.round(basePrice * 2.2),
          dayLabel: 'Toutes les Journées',
          badge: 'Recommandé'
        },
        {
          id: `${activeEvent.id}-tier-vip`,
          name: 'Pass VIP & Accès Prioritaire',
          description: 'Coupe-file express, accès salon privé et privilèges réservés.',
          priceUSD: Math.round(basePrice * 4.2),
          dayLabel: 'Privilège VIP'
        }
      ];
      return { isMultiDay: true, isDonation: false, availableTiers: multiTiers };
    }

    // 4. Événement d'une seule journée (Concert d'un soir, Gala, Soirée d'Honneur)
    const singleTiers: EventTierOption[] = [
      {
        id: `${activeEvent.id}-tier-std`,
        name: 'Entrée Standard',
        description: 'Billet d’accès officiel standard pour la date de l’événement.',
        priceUSD: basePrice,
        dayLabel: activeEvent.dateStr || 'Billet Unique'
      },
      {
        id: `${activeEvent.id}-tier-vip`,
        name: 'Accès Carré VIP / Table Privilège',
        description: 'Emplacement d’honneur prioritaire, coupe-file et cocktail d’accueil.',
        priceUSD: Math.round(basePrice * 2.5),
        dayLabel: 'Carré Privilège',
        badge: 'VIP'
      }
    ];
    return { isMultiDay: false, isDonation: false, availableTiers: singleTiers };
  }, [activeEvent, tickets]);

  const [selectedTierId, setSelectedTierId] = useState<string>(() => {
    if (ticket && activeEvent?.id === 'cfw-6') return ticket.id;
    return availableTiers[0]?.id || '';
  });

  useEffect(() => {
    if (availableTiers.length > 0 && !availableTiers.some(t => t.id === selectedTierId)) {
      setSelectedTierId(availableTiers[0].id);
    }
  }, [availableTiers, selectedTierId]);

  const currentTier = useMemo(() => {
    return availableTiers.find(t => t.id === selectedTierId) || availableTiers[0] || {
      id: 'default',
      name: 'Entrée Standard',
      description: 'Accès officiel VUKA Pay',
      priceUSD: 10,
      dayLabel: 'Billet'
    };
  }, [availableTiers, selectedTierId]);

  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '+243 ');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [loading, setLoading] = useState(false);
  const [purchasedTicket, setPurchasedTicket] = useState<PurchasedTicket | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      if (!name) setName(currentUser.name);
      if (!phone || phone === '+243 ') setPhone(currentUser.phone);
      if (!email) setEmail(currentUser.email);
    }
  }, [currentUser]);

  if (!activeEvent && !ticket) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Veuillez renseigner votre nom complet.');
      return;
    }

    const cleanPhone = phone.trim();
    if (cleanPhone.length < 10) {
      setError('Numéro WhatsApp / Téléphone obligatoire invalide (ex: +243 81 234 5678).');
      return;
    }

    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setError('Adresse email valide obligatoire (pour recevoir votre billet PDF & QR code).');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const bought = await buyTicket(
        currentTier.id, 
        name.trim(), 
        cleanPhone, 
        cleanEmail,
        {
          eventId: activeEvent?.id,
          eventTitle: activeEvent?.title,
          tierName: currentTier.name,
          priceUSD: currentTier.priceUSD
        }
      );
      
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Fallback
      }

      setPurchasedTicket(bought);
    } catch (err: any) {
      setError(err?.message || "Une erreur est survenue lors du paiement.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoToTickets = () => {
    setAppViewMode('CLIENT_PORTAL');
    setActiveClientTab('TICKETS');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-lg bg-white border border-[#D9D0C6] rounded-[24px] sm:rounded-[28px] p-5 sm:p-6 shadow-2xl my-auto max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#F3ECE2] text-[#7A7068] hover:text-[#14110F] transition"
          aria-label="Fermer"
        >
          <X className="w-4 h-4" />
        </button>

        {purchasedTicket ? (
          <div>
            {/* Header Succès Compact */}
            <div className="text-center mb-4">
              <div className="w-11 h-11 bg-[#E2F3E9] border border-[#167A42]/20 text-[#167A42] rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#14110F] font-heading">
                Billet Émis avec Succès !
              </h3>
              <p className="text-xs text-[#4A433D] mt-1 max-w-sm mx-auto">
                Votre Pass officiel a été généré et envoyé à votre <strong>WhatsApp ({purchasedTicket.buyerPhone})</strong> et à votre <strong>Email ({purchasedTicket.buyerEmail})</strong>.
              </p>
            </div>

            {/* Visual Digital Ticket Pass View avec les 4 actions cohérentes */}
            <TicketPassView ticket={purchasedTicket} />

            {/* Action Principale - Voir dans mon espace */}
            <div className="mt-5 flex flex-col sm:flex-row gap-2.5 justify-center">
              <button
                type="button"
                onClick={handleGoToTickets}
                className="w-full sm:w-auto flex-1 py-3 px-5 rounded-full bg-[#FF6A2B] hover:bg-[#E24E10] text-[#14110F] font-bold text-xs uppercase tracking-wider shadow-sm transition active:scale-95 text-center flex items-center justify-center gap-2"
              >
                <span>Voir dans mon espace</span>
                <ArrowRight className="w-4 h-4 text-[#14110F]" />
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto py-3 px-5 rounded-full bg-[#F3ECE2] hover:bg-[#D9D0C6] text-[#14110F] font-semibold text-xs uppercase tracking-wider transition active:scale-95 text-center"
              >
                Terminer
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Header avec rappel de l'activité */}
            <div className="mb-4 pr-6">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FFE3D3] text-[#14110F] border border-[#FF6A2B]/20 inline-block mb-1">
                {activeEvent?.activityType || 'Billetterie'} • Paiement Sécurisé
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#14110F] font-heading leading-tight truncate">
                {activeEvent?.title || 'Réservation de Billet'}
              </h3>
              <div className="flex flex-wrap items-center gap-3 text-xs text-[#7A7068] mt-1">
                {activeEvent?.dateStr && (
                  <span className="inline-flex items-center gap-1 font-medium text-[#FF6A2B]">
                    <Calendar className="w-3 h-3" />
                    <span>{activeEvent.dateStr}</span>
                  </span>
                )}
                {activeEvent?.city && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{activeEvent.location || activeEvent.city}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Connecté vs Non-connecté Banner */}
            {currentUser ? (
              <div className="p-2.5 rounded-xl bg-[#E2F3E9] border border-[#167A42]/20 mb-4 flex items-center justify-between text-xs text-[#167A42]">
                <div className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span className="truncate">Connecté : <strong>{currentUser.name}</strong></span>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-[#FBF6EE] border border-[#D9D0C6] mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="text-[#4A433D]">
                  <span className="font-semibold text-[#14110F]">Déjà un compte ?</span> Connectez-vous pour retrouver vos billets.
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalMode('LOGIN');
                    setIsAuthModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1 font-bold text-[#FF6A2B] hover:text-[#E24E10] self-start sm:self-auto uppercase tracking-wider text-[11px]"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Se connecter</span>
                </button>
              </div>
            )}

            {/* Ticket Selector / Summary Card — Adapté au type d'événement */}
            <div className="p-3.5 rounded-2xl bg-[#FBF6EE] border border-[#D9D0C6] mb-4 space-y-2.5">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="text-xs sm:text-sm font-bold text-[#14110F] font-heading truncate">
                    {currentTier.name}
                  </div>
                  <div className="text-[11px] text-[#7A7068] truncate">
                    {currentTier.dayLabel || currentTier.description}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-lg sm:text-xl font-bold text-[#FF6A2B] font-mono tnum">
                    {formatUSD(currentTier.priceUSD)}
                  </div>
                  <div className="text-[10px] text-[#7A7068] font-mono">
                    ≈ {formatCDF(currentTier.priceUSD)}
                  </div>
                </div>
              </div>

              {/* Sélecteur de Formule ou de Type de Billet */}
              {availableTiers.length > 1 && (
                <div className="pt-2 border-t border-[#D9D0C6]/60">
                  <label htmlFor="modal-ticket-switcher" className="text-[10px] font-bold uppercase tracking-wider text-[#7A7068] block mb-1">
                    {isDonation 
                      ? 'Niveau de Don Solidaire' 
                      : (isMultiDay ? 'Formule de Pass (Multi-Jours)' : 'Type de Billet')}
                  </label>
                  <select
                    id="modal-ticket-switcher"
                    value={currentTier.id}
                    onChange={(e) => setSelectedTierId(e.target.value)}
                    className="w-full bg-white border border-[#D9D0C6] rounded-xl px-3 py-2 text-xs font-semibold text-[#14110F] focus:outline-none focus:border-[#FF6A2B] cursor-pointer"
                  >
                    {availableTiers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} — {formatUSD(t.priceUSD)} (≈ {formatCDF(t.priceUSD)})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-3 p-2.5 rounded-xl bg-red-50 border border-red-200 text-[#C62828] text-xs flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Nom */}
              <div>
                <label className="block text-[11px] font-bold text-[#14110F] mb-1 uppercase tracking-wider">
                  Nom et Prénom du titulaire *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#7A7068]">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Ex : Serge Mwamba"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[#D9D0C6] text-[#14110F] placeholder-[#7A7068] text-xs focus:outline-none focus:border-[#FF6A2B]"
                  />
                </div>
              </div>

              {/* WhatsApp / Phone OBLIGATOIRE */}
              <div>
                <label className="block text-[11px] font-bold text-[#14110F] mb-1 uppercase tracking-wider flex items-center justify-between">
                  <span>Numéro WhatsApp / Mobile Money (Obligatoire) *</span>
                  <span className="text-[10px] text-[#7A7068] font-normal">Format RDC</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#7A7068]">
                    <Smartphone className="w-4 h-4 text-[#FF6A2B]" />
                  </div>
                  <input
                    type="tel"
                    required
                    placeholder="+243 81 234 56 78"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[#D9D0C6] text-[#14110F] font-mono placeholder-[#7A7068] text-xs focus:outline-none focus:border-[#FF6A2B]"
                  />
                </div>
                <p className="text-[10px] text-[#7A7068] mt-0.5">
                  Votre pass électronique et le code d'accès sécurisé y seront envoyés instantanément.
                </p>
              </div>

              {/* Email OBLIGATOIRE */}
              <div>
                <label className="block text-[11px] font-bold text-[#14110F] mb-1 uppercase tracking-wider">
                  Adresse Email (Obligatoire) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#7A7068]">
                    <Mail className="w-4 h-4 text-[#FF6A2B]" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="serge@exemple.cd"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[#D9D0C6] text-[#14110F] placeholder-[#7A7068] text-xs focus:outline-none focus:border-[#FF6A2B]"
                  />
                </div>
              </div>

              <div className="pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-full bg-[#FF6A2B] hover:bg-[#E24E10] disabled:opacity-50 text-[#14110F] font-bold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  {loading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-[#14110F] border-t-transparent rounded-full animate-spin" />
                      <span>Validation du paiement en cours...</span>
                    </>
                  ) : (
                    <>
                      <span>
                        {isDonation 
                          ? `Confirmer le Don de ${formatUSD(currentTier.priceUSD)}` 
                          : `Régler ${formatUSD(currentTier.priceUSD)} & Obtenir mon Billet`}
                      </span>
                      <ArrowRight className="w-4 h-4 text-[#14110F]" />
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#7A7068] pt-1">
                <ShieldCheck className="w-3 h-3 text-[#167A42]" />
                <span>Paiement 100% sécurisé et garanti par VUKA Pay</span>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
