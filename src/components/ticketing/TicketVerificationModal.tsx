import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Ticket, 
  Calendar, 
  User, 
  QrCode,
  KeyRound,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PurchasedTicket } from '../../types';

export const TicketVerificationModal: React.FC = () => {
  const { 
    isTicketVerificationOpen, 
    setIsTicketVerificationOpen,
    verifyTicketByCode,
    purchasedTickets
  } = useApp();

  const [inputCode, setInputCode] = useState('');
  const [result, setResult] = useState<{
    searched: boolean;
    status: 'VALID' | 'ALREADY_USED' | 'NOT_FOUND';
    ticket?: PurchasedTicket;
    details?: string;
  }>({
    searched: false,
    status: 'NOT_FOUND'
  });

  if (!isTicketVerificationOpen) return null;

  const handleClose = () => {
    setIsTicketVerificationOpen(false);
    setInputCode('');
    setResult({ searched: false, status: 'NOT_FOUND' });
  };

  const handleVerify = (codeToVerify?: string) => {
    const code = codeToVerify || inputCode;
    if (!code.trim()) return;

    const res = verifyTicketByCode(code);
    setResult({
      searched: true,
      status: res.status,
      ticket: res.ticket,
      details: res.details
    });
  };

  const handleQuickTest = (ticket: PurchasedTicket) => {
    setInputCode(ticket.ticketId);
    handleVerify(ticket.ticketId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white rounded-[28px] border border-[#D9D0C6] shadow-2xl p-6 sm:p-8 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#FAF8F5] hover:bg-[#F3ECE2] text-[#7A7068] hover:text-[#14110F] flex items-center justify-center transition"
          aria-label="Fermer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-[#E2F3E9] text-[#166534] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#14110F] font-heading">
              Vérificateur de Billet Officiel
            </h3>
            <p className="text-xs text-[#7A7068]">
              Contrôle cryptographique d'authenticité et détection anti-fraude VUKA Pay
            </p>
          </div>
        </div>

        {/* Formulaire de Recherche de Billet */}
        <form 
          onSubmit={(e) => { e.preventDefault(); handleVerify(); }}
          className="space-y-3"
        >
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7A7068]">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="Ex : TCK-CFW6-1420 ou jeton QR"
              className="w-full pl-10 pr-24 py-3 rounded-xl border border-[#D9D0C6] focus:border-[#FF6A2B] bg-[#FAF8F5] focus:bg-white text-xs sm:text-sm font-mono font-medium text-[#14110F] focus:outline-none transition"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 bottom-1.5 px-4 rounded-lg bg-[#14110F] hover:bg-[#2A2420] text-[#FBF6EE] font-bold text-xs uppercase transition active:scale-95 flex items-center gap-1.5"
            >
              <span>Vérifier</span>
            </button>
          </div>
        </form>

        {/* Billets exemples pour test rapide */}
        {purchasedTickets.length > 0 && (
          <div className="mt-3 pt-3 border-t border-[#F3ECE2]">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7A7068] block mb-1.5">
              Tester avec un billet actif du registre :
            </span>
            <div className="flex flex-wrap gap-1.5">
              {purchasedTickets.slice(0, 3).map((t) => (
                <button
                  key={t.ticketId}
                  type="button"
                  onClick={() => handleQuickTest(t)}
                  className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] hover:bg-[#F3ECE2] border border-[#E5E0D8] text-[11px] font-mono font-semibold text-[#14110F] transition"
                >
                  {t.ticketId} ({t.ticketName.split(' ')[0]})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Résultat du Contrôle de Validité */}
        {result.searched && (
          <div className="mt-5 animate-in fade-in slide-in-from-top-2 duration-200">
            {result.status === 'VALID' && result.ticket && (
              <div className="p-4 rounded-2xl bg-[#F0FDF4] border border-[#86EFAC] space-y-3">
                <div className="flex items-center gap-2 text-[#166534]">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Billet Authentique & Valide
                  </span>
                </div>

                <div className="bg-white rounded-xl p-3 border border-[#DCFCE7] space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#7A7068]">Titulaire :</span>
                    <span className="font-bold text-[#14110F]">{result.ticket.buyerName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#7A7068]">Activité :</span>
                    <span className="font-semibold text-[#14110F]">{result.ticket.ticketName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#7A7068]">Référence :</span>
                    <span className="font-mono font-bold text-[#166534]">{result.ticket.ticketId}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#7A7068]">Date d'achat :</span>
                    <span className="font-mono text-[#7A7068]">
                      {new Date(result.ticket.purchaseDate).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-[#F3ECE2]">
                    <span className="text-[#7A7068]">Empreinte HMAC :</span>
                    <span className="font-mono text-[10px] text-[#7A7068] truncate max-w-[200px]">
                      {result.ticket.qrCodeToken.slice(0, 24)}...
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-[#166534] font-medium leading-relaxed">
                  Ce billet est en règle. L'accès aux portiques NFC / QR Sunmi V2S est certifié.
                </p>
              </div>
            )}

            {result.status === 'ALREADY_USED' && result.ticket && (
              <div className="p-4 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] space-y-2">
                <div className="flex items-center gap-2 text-[#B45309]">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Alerte : Billet Déjà Scanné
                  </span>
                </div>
                <p className="text-xs text-[#B45309] leading-relaxed">
                  {result.details}
                </p>
                <div className="text-[11px] font-mono text-[#7A7068]">
                  Titulaire : {result.ticket.buyerName} • Réf : {result.ticket.ticketId}
                </div>
              </div>
            )}

            {result.status === 'NOT_FOUND' && (
              <div className="p-4 rounded-2xl bg-[#FEF2F2] border border-[#FECACA] space-y-2">
                <div className="flex items-center gap-2 text-[#991B1B]">
                  <XCircle className="w-5 h-5 shrink-0" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Billet Non Reconnu
                  </span>
                </div>
                <p className="text-xs text-[#991B1B] leading-relaxed">
                  {result.details || 'Aucune référence correspondante n\'a été trouvée dans le registre.'}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="mt-5 pt-4 border-t border-[#F3ECE2] flex items-center justify-between text-xs text-[#7A7068]">
          <span className="flex items-center gap-1.5 font-medium">
            <KeyRound className="w-3.5 h-3.5 text-[#FF6A2B]" />
            Chiffrement SHA-256 HMAC
          </span>
          <button
            type="button"
            onClick={handleClose}
            className="text-[#14110F] font-bold hover:underline"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
};
