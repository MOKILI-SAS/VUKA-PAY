import React, { useState, useEffect } from 'react';
import { TicketDefinition, PurchasedTicket } from '../../types';
import { useApp } from '../../context/AppContext';
import { formatUSD, formatCDF } from '../../utils/formatters';
import { X, ShieldCheck, CheckCircle2, ArrowRight, Smartphone, Mail, User, AlertCircle, LogIn } from 'lucide-react';
import confetti from 'canvas-confetti';
import { TicketPassView } from './TicketPassView';

interface CheckoutModalProps {
  ticket: TicketDefinition | null;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ ticket, onClose }) => {
  const { 
    currentUser, 
    buyTicket, 
    setIsAuthModalOpen, 
    setAuthModalMode,
    setAppViewMode,
    setActiveClientTab
  } = useApp();

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

  if (!ticket) return null;

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
      const bought = await buyTicket(ticket.id, name.trim(), cleanPhone, cleanEmail);
      
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
      setError(err?.message || "Une erreur est survenue lors de l'achat.");
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white border border-[#D9D0C6] rounded-[28px] p-6 sm:p-8 shadow-2xl my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#F3ECE2] text-[#7A7068] hover:text-[#14110F] transition"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {purchasedTicket ? (
          <div>
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-[#E2F3E9] border border-[#167A42]/20 text-[#167A42] rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-[#14110F] font-heading">Billet Émis avec Succès !</h3>
              <p className="text-xs sm:text-sm text-[#4A433D] mt-1 max-w-md mx-auto">
                Votre Pass officiel a été généré et envoyé à votre <strong>WhatsApp ({purchasedTicket.buyerPhone})</strong> et à votre <strong>Email ({purchasedTicket.buyerEmail})</strong>.
              </p>
            </div>

            {/* Visual Digital Ticket */}
            <TicketPassView ticket={purchasedTicket} />

            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleGoToTickets}
                className="w-full sm:w-auto flex-1 py-3.5 px-6 rounded-full bg-[#FF6A2B] hover:bg-[#E24E10] text-[#14110F] font-bold text-xs uppercase tracking-wider shadow-sm transition active:scale-95 text-center flex items-center justify-center gap-2"
              >
                <span>Voir dans mon Espace Festivalier</span>
                <ArrowRight className="w-4 h-4 text-[#14110F]" />
              </button>

              <button
                onClick={onClose}
                className="w-full sm:w-auto py-3.5 px-6 rounded-full bg-[#F3ECE2] hover:bg-[#D9D0C6] text-[#14110F] font-semibold text-xs uppercase tracking-wider transition active:scale-95 text-center"
              >
                Terminer
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFE3D3] text-[#14110F] text-xs font-bold uppercase tracking-wider mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A2B]" />
                <span>Paiement M-Pesa & Billetterie Officielle</span>
              </div>
              <h3 className="text-2xl font-bold text-[#14110F] font-heading">
                Finaliser l'achat de votre Pass
              </h3>
              <p className="text-xs text-[#7A7068] mt-1">
                Le montant sera réglé en toute sécurité sans frais cachés.
              </p>
            </div>

            {/* Connecté vs Non-connecté Banner */}
            {currentUser ? (
              <div className="p-3 rounded-xl bg-[#E2F3E9] border border-[#167A42]/20 mb-5 flex items-center justify-between text-xs text-[#167A42]">
                <div className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Connecté : <strong>{currentUser.name}</strong> ({currentUser.email})</span>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-[#FBF6EE] border border-[#D9D0C6] mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="text-[#4A433D]">
                  <span className="font-semibold text-[#14110F]">Déjà un compte ?</span> Connectez-vous pour retrouver vos billets.
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalMode('LOGIN');
                    setIsAuthModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 font-bold text-[#FF6A2B] hover:text-[#E24E10] self-start sm:self-auto uppercase tracking-wider text-[11px]"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Se connecter</span>
                </button>
              </div>
            )}

            {/* Ticket Summary Card */}
            <div className="p-4 rounded-2xl bg-[#FBF6EE] border border-[#D9D0C6] mb-5 flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-[#14110F] font-heading">{ticket.name}</div>
                <div className="text-xs text-[#7A7068]">{ticket.dayLabel || 'Accès 6 Jours'}</div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-[#FF6A2B] font-mono tnum">{formatUSD(ticket.priceUSD)}</div>
                <div className="text-xs text-[#7A7068] font-mono">≈ {formatCDF(ticket.priceUSD)}</div>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-[#C62828] text-xs flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nom */}
              <div>
                <label className="block text-xs font-bold text-[#14110F] mb-1.5 uppercase tracking-wider">
                  Nom et Prénom du titulaire *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7A7068]">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Ex : Serge Mwamba"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#D9D0C6] text-[#14110F] placeholder-[#7A7068] text-sm focus:outline-none focus:border-[#FF6A2B]"
                  />
                </div>
              </div>

              {/* WhatsApp / Phone OBLIGATOIRE */}
              <div>
                <label className="block text-xs font-bold text-[#14110F] mb-1 uppercase tracking-wider flex items-center justify-between">
                  <span>Numéro WhatsApp / Mobile Money (Obligatoire) *</span>
                  <span className="text-[10px] text-[#7A7068] font-normal">Format international</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7A7068]">
                    <Smartphone className="w-4 h-4 text-[#FF6A2B]" />
                  </div>
                  <input
                    type="tel"
                    required
                    placeholder="+243 81 234 56 78"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#D9D0C6] text-[#14110F] font-mono placeholder-[#7A7068] text-sm focus:outline-none focus:border-[#FF6A2B]"
                  />
                </div>
                <p className="text-[10px] text-[#7A7068] mt-1">
                  Votre pass électronique et le lien d'accès sécurisé y seront envoyés par WhatsApp / SMS.
                </p>
              </div>

              {/* Email OBLIGATOIRE */}
              <div>
                <label className="block text-xs font-bold text-[#14110F] mb-1 uppercase tracking-wider">
                  Adresse Email (Obligatoire) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7A7068]">
                    <Mail className="w-4 h-4 text-[#FF6A2B]" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="serge@exemple.cd"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#D9D0C6] text-[#14110F] placeholder-[#7A7068] text-sm focus:outline-none focus:border-[#FF6A2B]"
                  />
                </div>
                <p className="text-[10px] text-[#7A7068] mt-1">
                  Votre pass PDF officiel avec QR code et reçu d'achat y seront transmis instantanément.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 rounded-full bg-[#FF6A2B] hover:bg-[#E24E10] disabled:opacity-50 text-[#14110F] font-bold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#14110F] border-t-transparent rounded-full animate-spin" />
                      <span>Validation du billet en cours...</span>
                    </>
                  ) : (
                    <>
                      <span>Payer {formatUSD(ticket.priceUSD)} & Obtenir mon Billet</span>
                      <ArrowRight className="w-4 h-4 text-[#14110F]" />
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#7A7068] mt-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#167A42]" />
                <span>Paiement 100% sécurisé crypté de bout en bout</span>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
