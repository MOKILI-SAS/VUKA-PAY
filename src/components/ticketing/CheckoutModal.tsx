import React, { useState, useMemo, useEffect } from 'react';
import { 
  X, 
  Smartphone, 
  Mail, 
  User, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Calendar,
  MapPin,
  LogIn,
  Plus,
  Minus,
  Share2,
  Copy,
  Printer,
  Wallet,
  CreditCard,
  QrCode
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { TicketDefinition, PurchasedTicket, VukaPublishedEvent } from '../../types';
import { formatUSD, formatCDF } from '../../utils/formatters';
import { TicketPassView } from './TicketPassView';

interface CheckoutModalProps {
  event?: VukaPublishedEvent | null;
  ticket?: TicketDefinition | null;
  onClose: () => void;
}

interface EventTierOption {
  id: string;
  name: string;
  description: string;
  priceUSD: number;
  dayLabel?: string;
  badge?: string;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ event, ticket, onClose }) => {
  const { 
    buyTickets, 
    tickets, 
    publishedEvents, 
    currentUser, 
    setIsAuthModalOpen, 
    setAuthModalMode,
    setAppViewMode,
    setActiveClientTab,
    wallet
  } = useApp();

  const activeEvent = useMemo(() => {
    if (event) return event;
    if (ticket) {
      return publishedEvents.find(e => e.id === 'cfw-6') || publishedEvents[0];
    }
    return null;
  }, [event, ticket, publishedEvents]);

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
      activeEvent.isMultiDay ||
      dateStrLower.includes(' au ') || 
      dateStrLower.includes(' - ') || 
      activeEvent.activityType === 'Festival';

    const priceMatch = (activeEvent.priceFrom || '').match(/(\d+)\s*\$/);
    const basePrice = priceMatch ? parseInt(priceMatch[1], 10) : 10;

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

    if (activeEvent.tiers && activeEvent.tiers.length > 0) {
      return {
        isMultiDay: isMultiDayEvent,
        isDonation: isDonationEvent,
        availableTiers: activeEvent.tiers.map(t => ({
          id: t.id,
          name: t.name,
          description: t.description || 'Billet officiel',
          priceUSD: t.priceUSD,
          dayLabel: t.dayLabel || 'Billet'
        }))
      };
    }

    if (isDonationEvent) {
      const donationTiers: EventTierOption[] = [
        { id: `${activeEvent.id}-tier-repas`, name: 'Don 1 Enfant (1 semaine de repas)', description: 'Finance 5 déjeuners équilibrés pour un écolier en milieu rural.', priceUSD: 5, dayLabel: 'Impact Direct' },
        { id: `${activeEvent.id}-tier-cantine`, name: 'Don Cantine Solidaire (1 mois de repas)', description: 'Approvisionnement vivres pour la cantine partenaire.', priceUSD: 20, dayLabel: 'Soutien Clé' },
        { id: `${activeEvent.id}-tier-parrain`, name: 'Grand Mécène (1 trimestre scolaire)', description: 'Parrainage complet de la cantine et fournitures d’hygiène.', priceUSD: 50, dayLabel: 'Mécénat' }
      ];
      return { isMultiDay: false, isDonation: true, availableTiers: donationTiers };
    }

    if (isMultiDayEvent) {
      const multiTiers: EventTierOption[] = [
        { id: `${activeEvent.id}-tier-day`, name: 'Pass Journée Unique', description: 'Accès valable pour une journée complète au choix.', priceUSD: basePrice, dayLabel: '1 Jour' },
        { id: `${activeEvent.id}-tier-full`, name: 'Pass Intégral Multi-Jours', description: 'Accès illimité à l’ensemble des journées de l’événement.', priceUSD: Math.round(basePrice * 2.2), dayLabel: 'Accès Intégral', badge: 'Recommandé' },
        { id: `${activeEvent.id}-tier-vip`, name: 'Pass VIP & Accès Privilège', description: 'Accès lounge exclusif, coupe-file et cocktail d’accueil.', priceUSD: Math.round(basePrice * 4), dayLabel: 'VIP Lounge', badge: 'VIP' }
      ];
      return { isMultiDay: true, isDonation: false, availableTiers: multiTiers };
    }

    const singleTiers: EventTierOption[] = [
      { id: `${activeEvent.id}-tier-standard`, name: 'Entrée Standard', description: 'Accès officiel à l’ensemble de l’activité.', priceUSD: basePrice, dayLabel: 'Entrée Simple' },
      { id: `${activeEvent.id}-tier-vip`, name: 'Accès Carré VIP / Table Privilège', description: 'Emplacement d’honneur prioritaire, coupe-file et cocktail d’accueil.', priceUSD: Math.round(basePrice * 2.5), dayLabel: 'Carré Privilège', badge: 'VIP' }
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

  // Quantité (1 à 10 places)
  const [quantity, setQuantity] = useState<number>(1);

  // Nombre de jours (pour les événements de plusieurs jours)
  const isMultiDayEvent = isMultiDay;
  const maxDaysCount = activeEvent?.daysCount || 6;
  const [daysCount, setDaysCount] = useState<number>(1);

  // Prix unitaire effectif selon les jours sélectionnés
  const effectiveUnitPrice = useMemo(() => {
    if (isMultiDayEvent && !currentTier.id.includes('full') && !currentTier.id.includes('6-days')) {
      return currentTier.priceUSD * daysCount;
    }
    return currentTier.priceUSD;
  }, [isMultiDayEvent, currentTier, daysCount]);

  // Mode de paiement : Vuka Wallet, Visa, Mobile Money
  const totalAmountUSD = effectiveUnitPrice * quantity;
  const canPayWithWallet = wallet.balanceUSD >= totalAmountUSD;
  const [paymentMethod, setPaymentMethod] = useState<'WALLET' | 'VISA' | 'MOBILE_MONEY'>(canPayWithWallet ? 'WALLET' : 'MOBILE_MONEY');

  // Sous-questions Mobile Money & Carte Visa
  const [mobileOperator, setMobileOperator] = useState<'MPESA' | 'ORANGE' | 'AIRTEL' | 'AFRIMONEY'>('MPESA');
  const [cardHolder, setCardHolder] = useState(currentUser?.name || '');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const [name, setName] = useState(currentUser?.name || '');
  const [countryCode, setCountryCode] = useState('+243');
  const [phone, setPhone] = useState(currentUser?.phone ? currentUser.phone.replace(/^\+\d+\s*/, '') : '81 234 56 78');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [loading, setLoading] = useState(false);
  const [purchasedTicketsList, setPurchasedTicketsList] = useState<PurchasedTicket[]>([]);
  const [selectedResultIndex, setSelectedResultIndex] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      if (!name) setName(currentUser.name);
      if (!phone || phone === '+243 ') setPhone(currentUser.phone);
      if (!email) setEmail(currentUser.email);
      if (!cardHolder) setCardHolder(currentUser.name);
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

    const fullPhone = phone.startsWith('+') ? phone.trim() : `${countryCode} ${phone.trim()}`;
    if (phone.trim().length < 6) {
      setError('Numéro WhatsApp / Téléphone obligatoire invalide.');
      return;
    }

    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setError('Adresse email valide obligatoire (pour recevoir vos billets officiels).');
      return;
    }

    if (paymentMethod === 'WALLET' && !canPayWithWallet) {
      setError(`Solde insuffisant dans votre portefeuille Vuka (${formatUSD(wallet.balanceUSD)}). Veuillez recharger votre portefeuille ou choisir un autre moyen.`);
      return;
    }

    if (paymentMethod === 'VISA') {
      if (!cardHolder.trim()) {
        setError('Veuillez renseigner le nom figurant sur la carte bancaire.');
        return;
      }
      if (cardNumber.replace(/\s/g, '').length < 15) {
        setError('Numéro de carte bancaire invalide (16 chiffres requis).');
        return;
      }
      if (!cardExpiry.includes('/') || cardExpiry.trim().length < 5) {
        setError('Date d’expiration de carte invalide (format MM/AA).');
        return;
      }
      if (cardCvv.trim().length < 3) {
        setError('Code de sécurité CVV invalide (3 chiffres).');
        return;
      }
    }

    try {
      setLoading(true);
      setError(null);

      const boughtList = await buyTickets(
        currentTier.id, 
        quantity,
        name.trim(), 
        fullPhone, 
        cleanEmail,
        paymentMethod,
        {
          eventId: activeEvent?.id,
          eventTitle: activeEvent?.title,
          tierName: isMultiDayEvent && daysCount > 1 ? `${currentTier.name} (${daysCount} Jours)` : currentTier.name,
          priceUSD: effectiveUnitPrice
        }
      );
      
      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 }
        });
      } catch {
        // Fallback
      }

      setPurchasedTicketsList(boughtList);
      setSelectedResultIndex(0);
    } catch (err: any) {
      setError(err?.message || "Une erreur est survenue lors de l'émission des billets.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoToTickets = () => {
    setAppViewMode('CLIENT_PORTAL');
    setActiveClientTab('TICKETS');
    onClose();
  };

  const handleSendWhatsApp = (tck: PurchasedTicket) => {
    const text = encodeURIComponent(
      `Billet Officiel VUKA Pay\n` +
      `Activité : ${tck.ticketName}\n` +
      `Titulaire : ${tck.buyerName}\n` +
      `Référence Sécurisée : ${tck.ticketId}\n` +
      `Prix Réglé : ${formatUSD(tck.pricePaidUSD)}\n` +
      `Présentez ce code aux portes ou au contrôle RFID.`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
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

        {purchasedTicketsList.length > 0 ? (
          <div className="space-y-4">
            {/* Header Succès Multi-Billets */}
            <div className="text-center">
              <div className="w-12 h-12 bg-[#E2F3E9] border border-[#167A42]/20 text-[#167A42] rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#14110F] font-heading">
                {purchasedTicketsList.length > 1 
                  ? `${purchasedTicketsList.length} Billets Émis avec Succès !` 
                  : 'Billet Émis avec Succès !'}
              </h3>
              <p className="text-xs text-[#7A7068] mt-1 max-w-sm mx-auto">
                Vos billets sont rattachés à votre compte et envoyés à votre <strong>WhatsApp ({purchasedTicketsList[0].buyerPhone})</strong>.
              </p>
            </div>

            {/* Sélecteur de billet si achat multiple */}
            {purchasedTicketsList.length > 1 && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar justify-start sm:justify-center">
                {purchasedTicketsList.map((t, idx) => (
                  <button
                    key={t.ticketId}
                    type="button"
                    onClick={() => setSelectedResultIndex(idx)}
                    className={`px-3 py-1 rounded-full text-xs font-heading font-bold transition shrink-0 ${
                      selectedResultIndex === idx
                        ? 'bg-[#14110F] text-white shadow-xs'
                        : 'bg-[#FAF8F5] text-[#7A7068] border border-[#E5E0D8]'
                    }`}
                  >
                    Place {idx + 1}
                  </button>
                ))}
              </div>
            )}

            {/* Vue détaillée du pass sélectionné */}
            <div className="p-3 bg-[#FAF8F5] rounded-2xl border border-[#E5E0D8]">
              <TicketPassView ticket={purchasedTicketsList[selectedResultIndex]} />
            </div>

            {/* Action WhatsApp individuelle pour ce billet */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleSendWhatsApp(purchasedTicketsList[selectedResultIndex])}
                className="flex-1 py-2.5 px-4 rounded-full bg-[#167A42] hover:bg-[#126335] text-white font-heading font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-xs"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Envoyer ce Billet sur WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleGoToTickets}
                className="py-2.5 px-5 rounded-full bg-[#FF6A2B] hover:bg-[#e0561d] text-[#14110F] font-heading font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span>Voir tous mes billets</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#14110F]" />
              </button>
            </div>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={onClose}
                className="text-xs text-[#7A7068] hover:text-[#14110F] font-heading underline"
              >
                Fermer
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
              <div className="p-2.5 rounded-xl bg-[#E2F3E9] border border-[#167A42]/20 mb-3 flex items-center justify-between text-xs text-[#167A42]">
                <div className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span className="truncate">Compte vérifié : <strong>{currentUser.name}</strong></span>
                </div>
                <span className="font-mono text-[11px] font-bold text-[#14110F]">
                  Solde: {formatUSD(wallet.balanceUSD)}
                </span>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-[#FBF6EE] border border-[#D9D0C6] mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
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

            {/* Ticket Selector & Quantity Card */}
            <div className="p-3.5 rounded-2xl bg-[#FBF6EE] border border-[#D9D0C6] mb-3 space-y-3">
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
                  <div className="text-base sm:text-lg font-bold text-[#14110F] font-mono tnum">
                    {formatUSD(currentTier.priceUSD)} <span className="text-xs text-[#7A7068] font-normal">/ place</span>
                  </div>
                </div>
              </div>

              {/* Sélecteur de Formule */}
              {availableTiers.length > 1 && (
                <div className="pt-2 border-t border-[#D9D0C6]/60">
                  <label htmlFor="modal-ticket-switcher" className="text-[10px] font-bold uppercase tracking-wider text-[#7A7068] block mb-1">
                    {isDonation ? 'Niveau de Don Solidaire' : (isMultiDay ? 'Formule de Pass' : 'Type de Billet')}
                  </label>
                  <select
                    id="modal-ticket-switcher"
                    value={currentTier.id}
                    onChange={(e) => setSelectedTierId(e.target.value)}
                    className="w-full bg-white border border-[#D9D0C6] rounded-xl px-3 py-2 text-xs font-semibold text-[#14110F] focus:outline-none focus:border-[#FF6A2B] cursor-pointer"
                  >
                    {availableTiers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} — {formatUSD(t.priceUSD)}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* SÉLECTEUR DE QUANTITÉ (Enfants, Famille, Amis) */}
              <div className="pt-2 border-t border-[#D9D0C6]/60 flex items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-heading font-bold text-[#14110F] block">
                    Nombre de places
                  </span>
                  <span className="text-[10px] text-[#7A7068] block">
                    Pour vous, vos enfants ou proches
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="w-8 h-8 rounded-full bg-white border border-[#D9D0C6] text-[#14110F] hover:bg-[#F3ECE2] flex items-center justify-center transition disabled:opacity-30 active:scale-95"
                    aria-label="Diminuer la quantité"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>

                  <span className="w-8 text-center font-heading font-black text-sm text-[#14110F] font-mono">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() => setQuantity(q => Math.min(10, q + 1))}
                    disabled={quantity >= 10}
                    className="w-8 h-8 rounded-full bg-[#14110F] text-white hover:bg-[#2A2420] flex items-center justify-center transition disabled:opacity-30 active:scale-95"
                    aria-label="Augmenter la quantité"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#FF6A2B]" />
                  </button>
                </div>
              </div>

              {/* SÉLECTEUR DU NOMBRE DE JOURS (Uniquement pour les événements sur plusieurs jours) */}
              {isMultiDayEvent && (
                <div className="pt-2 border-t border-[#D9D0C6]/60 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-heading font-bold text-[#14110F] block">
                      Nombre de jours
                    </span>
                    <span className="text-[10px] text-[#7A7068] block">
                      Journées de présence au festival
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setDaysCount(d => Math.max(1, d - 1))}
                      disabled={daysCount <= 1}
                      className="w-8 h-8 rounded-full bg-white border border-[#D9D0C6] text-[#14110F] hover:bg-[#F3ECE2] flex items-center justify-center transition disabled:opacity-30 active:scale-95"
                      aria-label="Diminuer les jours"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>

                    <span className="w-8 text-center font-heading font-black text-sm text-[#14110F] font-mono">
                      {daysCount}
                    </span>

                    <button
                      type="button"
                      onClick={() => setDaysCount(d => Math.min(maxDaysCount, d + 1))}
                      disabled={daysCount >= maxDaysCount}
                      className="w-8 h-8 rounded-full bg-[#14110F] text-white hover:bg-[#2A2420] flex items-center justify-center transition disabled:opacity-30 active:scale-95"
                      aria-label="Augmenter les jours"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#FF6A2B]" />
                    </button>
                  </div>
                </div>
              )}

              {/* TOTAL GLOBAL CALCULÉ */}
              <div className="pt-2 border-t border-[#D9D0C6]/60 flex items-center justify-between">
                <span className="text-xs font-bold text-[#7A7068] uppercase font-mono">
                  Total à régler ({quantity} place{quantity > 1 ? 's' : ''}{isMultiDayEvent && daysCount > 1 ? ` • ${daysCount}j` : ''})
                </span>
                <div className="text-right">
                  <div className="text-lg font-black text-[#FF6A2B] font-mono tabular-nums">
                    {formatUSD(totalAmountUSD)}
                  </div>
                  <div className="text-[10px] text-[#7A7068] font-mono">
                    ≈ {formatCDF(totalAmountUSD)}
                  </div>
                </div>
              </div>
            </div>

            {/* SÉLECTEUR DU MODE DE PAIEMENT : VUKA WALLET, VISA, MOBILE MONEY */}
            <div className="mb-3 space-y-2">
              <label className="block text-[11px] font-bold text-[#14110F] uppercase tracking-wider">
                Mode de Paiement
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {/* Option 1 : Vuka Wallet */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('WALLET')}
                  className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                    paymentMethod === 'WALLET'
                      ? 'bg-[#14110F] text-white border-[#14110F] shadow-xs'
                      : 'bg-white hover:bg-[#FAF8F5] text-[#14110F] border-[#D9D0C6]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-heading font-bold">Vuka Wallet</span>
                    <Wallet className={`w-3.5 h-3.5 ${paymentMethod === 'WALLET' ? 'text-[#FF6A2B]' : 'text-slate-400'}`} />
                  </div>
                  <span className="text-[10px] font-mono">
                    Solde: {formatUSD(wallet.balanceUSD)}
                  </span>
                </button>

                {/* Option 2 : Visa */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('VISA')}
                  className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                    paymentMethod === 'VISA'
                      ? 'bg-[#14110F] text-white border-[#14110F] shadow-xs'
                      : 'bg-white hover:bg-[#FAF8F5] text-[#14110F] border-[#D9D0C6]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-heading font-bold">Visa</span>
                    <CreditCard className={`w-3.5 h-3.5 ${paymentMethod === 'VISA' ? 'text-[#FF6A2B]' : 'text-slate-400'}`} />
                  </div>
                  <span className="text-[10px] font-mono">
                    Carte Bancaire
                  </span>
                </button>

                {/* Option 3 : Mobile Money */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('MOBILE_MONEY')}
                  className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                    paymentMethod === 'MOBILE_MONEY'
                      ? 'bg-[#14110F] text-white border-[#14110F] shadow-xs'
                      : 'bg-white hover:bg-[#FAF8F5] text-[#14110F] border-[#D9D0C6]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-heading font-bold">Mobile Money</span>
                    <Smartphone className={`w-3.5 h-3.5 ${paymentMethod === 'MOBILE_MONEY' ? 'text-[#FF6A2B]' : 'text-slate-400'}`} />
                  </div>
                  <span className="text-[10px] font-mono">
                    Paiement Mobile
                  </span>
                </button>
              </div>

              {/* Sous-questions selon le mode de paiement sélectionné */}
              {paymentMethod === 'WALLET' && (
                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#D9D0C6] text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-[#14110F]">
                    <span>Paiement Cashless Direct</span>
                    <span className="text-[#FF6A2B] font-mono">{formatUSD(totalAmountUSD)}</span>
                  </div>
                  <p className="text-[10px] text-[#7A7068]">
                    Le montant sera instantanément prélevé de votre solde disponible. Aucun frais de passerelle.
                  </p>
                  {!canPayWithWallet && (
                    <p className="text-[10px] text-[#C62828] font-bold">
                      Solde insuffisant ({formatUSD(wallet.balanceUSD)}). Veuillez recharger votre portefeuille ou choisir Visa / Mobile Money.
                    </p>
                  )}
                </div>
              )}

              {paymentMethod === 'MOBILE_MONEY' && (
                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#D9D0C6] space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#14110F] block">
                    Quel Mobile Money souhaitez-vous utiliser ?
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {[
                      { id: 'MPESA', label: 'Vodacom M-Pesa' },
                      { id: 'ORANGE', label: 'Orange Money' },
                      { id: 'AIRTEL', label: 'Airtel Money' },
                      { id: 'AFRIMONEY', label: 'AfriMoney' }
                    ].map(op => (
                      <button
                        key={op.id}
                        type="button"
                        onClick={() => setMobileOperator(op.id as any)}
                        className={`py-2 px-1 text-center rounded-lg text-xs font-bold transition border ${
                          mobileOperator === op.id
                            ? 'bg-[#14110F] text-white border-[#14110F]'
                            : 'bg-white text-[#14110F] border-[#D9D0C6] hover:bg-[#F3ECE2]'
                        }`}
                      >
                        {op.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-[#7A7068]">
                    Une invitation de paiement push sera envoyée sur votre numéro pour saisir votre code secret.
                  </p>
                </div>
              )}

              {paymentMethod === 'VISA' && (
                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#D9D0C6] space-y-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#14110F] block">
                    Coordonnées de votre Carte Bancaire
                  </span>
                  <div>
                    <label className="text-[10px] font-bold text-[#7A7068] uppercase block mb-1">Nom sur la Carte</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex : Christian Mwamba"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#D9D0C6] text-xs font-bold text-[#14110F] focus:outline-none focus:border-[#FF6A2B]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#7A7068] uppercase block mb-1">Numéro de Carte (16 chiffres)</label>
                    <input
                      type="text"
                      required
                      maxLength={19}
                      placeholder="4000 1234 5678 9010"
                      value={cardNumber}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
                        setCardNumber(val);
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#D9D0C6] text-xs font-mono font-bold text-[#14110F] focus:outline-none focus:border-[#FF6A2B]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-[#7A7068] uppercase block mb-1">Expiration (MM/AA)</label>
                      <input
                        type="text"
                        required
                        maxLength={5}
                        placeholder="12/28"
                        value={cardExpiry}
                        onChange={(e) => {
                          let val = e.target.value.replace(/\D/g, '');
                          if (val.length >= 2) val = val.slice(0, 2) + '/' + val.slice(2, 4);
                          setCardExpiry(val);
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-white border border-[#D9D0C6] text-xs font-mono font-bold text-center text-[#14110F] focus:outline-none focus:border-[#FF6A2B]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-[#7A7068] uppercase block mb-1">CVV (3 chiffres)</label>
                      <input
                        type="password"
                        required
                        maxLength={4}
                        placeholder="123"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                        className="w-full px-3 py-2 rounded-lg bg-white border border-[#D9D0C6] text-xs font-mono font-bold text-center text-[#14110F] focus:outline-none focus:border-[#FF6A2B]"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-[#167A42] font-mono">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Paiement sécurisé crypté SSL 256 bits & 3D Secure</span>
                  </div>
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

            {/* Formulaire acheteur */}
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Nom */}
              <div>
                <label className="block text-[11px] font-bold text-[#14110F] mb-1 uppercase tracking-wider">
                  Nom complet de l'acheteur *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#7A7068]">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Ex : Monyanyo Mabwa"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[#D9D0C6] text-[#14110F] placeholder-[#7A7068] text-xs focus:outline-none focus:border-[#FF6A2B]"
                  />
                </div>
              </div>

              {/* WhatsApp / Phone OBLIGATOIRE avec Sélecteur Code Pays */}
              <div>
                <label className="block text-[11px] font-bold text-[#14110F] mb-1 uppercase tracking-wider">
                  Numéro WhatsApp / Mobile Money (Obligatoire) *
                </label>
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-28 px-2 py-2 rounded-xl bg-white border border-[#D9D0C6] text-[#14110F] text-xs font-bold focus:outline-none focus:border-[#FF6A2B] shrink-0"
                  >
                    <option value="+243">🇨🇩 +243 (RDC)</option>
                    <option value="+33">🇫🇷 +33 (FR)</option>
                    <option value="+32">🇧🇪 +32 (BE)</option>
                    <option value="+1">🇺🇸 +1 (US/CA)</option>
                    <option value="+44">🇬🇧 +44 (UK)</option>
                    <option value="+242">🇨🇬 +242 (CG)</option>
                    <option value="+237">🇨🇲 +237 (CM)</option>
                    <option value="+225">🇨🇮 +225 (CI)</option>
                    <option value="+221">🇸🇳 +221 (SN)</option>
                    <option value="+250">🇷🇼 +250 (RW)</option>
                    <option value="+254">🇰🇪 +254 (KE)</option>
                    <option value="+27">🇿🇦 +27 (ZA)</option>
                    <option value="+244">🇦🇴 +244 (AO)</option>
                  </select>
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#7A7068]">
                      <Smartphone className="w-4 h-4 text-[#FF6A2B]" />
                    </div>
                    <input
                      type="tel"
                      required
                      placeholder="81 234 56 78"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[#D9D0C6] text-[#14110F] font-mono placeholder-[#7A7068] text-xs focus:outline-none focus:border-[#FF6A2B]"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-[#7A7068] mt-0.5">
                  Vos {quantity} billets électroniques et codes d'accès sécurisés y seront expédiés.
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
                    placeholder="contact@vuka.cd"
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
                      <span>Émission des {quantity} billets en cours...</span>
                    </>
                  ) : (
                    <>
                      <span>
                        Régler {formatUSD(totalAmountUSD)} via {paymentMethod === 'WALLET' ? 'Vuka Wallet' : (paymentMethod === 'VISA' ? 'Carte Visa' : 'Mobile Money')}
                      </span>
                      <ArrowRight className="w-4 h-4 text-[#14110F]" />
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#7A7068] pt-1">
                <ShieldCheck className="w-3 h-3 text-[#167A42]" />
                <span>Paiement 100% sécurisé et garanti par VUKA Pay • Billets individuels avec RFID</span>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
