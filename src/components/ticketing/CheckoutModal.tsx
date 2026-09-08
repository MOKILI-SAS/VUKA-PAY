import React, { useState } from 'react';
import { TicketDefinition, PurchasedTicket } from '../../types';
import { useApp } from '../../context/AppContext';
import { formatUSD, formatCDF } from '../../utils/formatters';
import { X, ShieldCheck, CheckCircle2, ArrowRight, Smartphone, AlertCircle, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { TicketPassView } from './TicketPassView';

interface CheckoutModalProps {
  ticket: TicketDefinition | null;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ ticket, onClose }) => {
  const { buyTicket } = useApp();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+24381');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [purchasedTicket, setPurchasedTicket] = useState<PurchasedTicket | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!ticket) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Veuillez renseigner votre nom complet.');
      return;
    }
    if (phone.length < 10) {
      setError('Numéro M-Pesa invalide (ex: +243812345678).');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const bought = await buyTicket(ticket.id, name, phone, email || `${name.toLowerCase().replace(/\s+/g, '.')}@email.cd`);
      
      // Tir de confettis de célébration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Fallback sans effet si bloqué
      }

      setPurchasedTicket(bought);
    } catch (err: any) {
      setError(err?.message || "Une erreur est survenue lors de l'achat.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {purchasedTicket ? (
          <div>
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 text-[#10B981] rounded-2xl flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-white">Félicitations !</h3>
              <p className="text-sm text-slate-400">
                Votre paiement M-Pesa a été validé avec succès. Voici votre Pass officiel :
              </p>
            </div>

            {/* Visual Digital Ticket */}
            <TicketPassView ticket={purchasedTicket} />

            <div className="mt-6 flex justify-center">
              <button
                onClick={onClose}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#FF5722] to-[#FF7A00] text-white font-bold text-sm shadow-vuka"
              >
                Terminer & Retourner à la vitrine
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF5722]/10 text-[#FF5722] text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Paiement M-Pesa Sécurisé</span>
              </div>
              <h3 className="text-2xl font-black text-white">
                Finaliser l'achat de votre Pass
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Le montant sera prélevé via Vodacom M-Pesa sans frais additionnels cachés.
              </p>
            </div>

            {/* Ticket Summary Card */}
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 mb-6 flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-white">{ticket.name}</div>
                <div className="text-xs text-slate-400">{ticket.dayLabel || 'Accès 6 Jours'}</div>
              </div>
              <div className="text-right">
                <div className="text-xl font-black text-white font-mono">{formatUSD(ticket.priceUSD)}</div>
                <div className="text-xs text-[#FFB300] font-mono">≈ {formatCDF(ticket.priceUSD)}</div>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Nom et Prénom du titulaire *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Jonathan Kalonji"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#FF5722]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider flex items-center justify-between">
                  <span>Numéro Vodacom M-Pesa (RDC) *</span>
                  <span className="text-[10px] text-slate-400 font-normal">Format: +243...</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    required
                    placeholder="+243 81 234 56 78"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white font-mono placeholder-slate-500 text-sm focus:outline-none focus:border-[#FF5722]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Adresse Email (optionnelle, pour recevoir le PDF)
                </label>
                <input
                  type="email"
                  placeholder="jonathan@exemple.cd"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#FF5722]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#FF5722] to-[#FF7A00] hover:from-[#E64A19] hover:to-[#F57C00] disabled:opacity-50 text-white font-black text-sm shadow-vuka transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Validation M-Pesa en cours...</span>
                    </>
                  ) : (
                    <>
                      <span>Payer {formatUSD(ticket.priceUSD)} via M-Pesa</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 mt-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                <span>Paiement 100% sécurisé crypté de bout en bout</span>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
