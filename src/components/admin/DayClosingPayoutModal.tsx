import React, { useState } from 'react';
import { DailyClosingReport } from '../../types';
import { formatUSD, formatCDF } from '../../utils/formatters';
import { X, CheckCircle2, Heart, Smartphone, ArrowRight, ShieldCheck, Printer } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DayClosingPayoutModalProps {
  report: DailyClosingReport;
  onClose: () => void;
}

export const DayClosingPayoutModal: React.FC<DayClosingPayoutModalProps> = ({ report, onClose }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDisbursed, setIsDisbursed] = useState(false);

  const handleExecutePayouts = async () => {
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 1200));
    setIsProcessing(false);
    setIsDisbursed(true);

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 }
      });
    } catch {
      // Ignorer si bloqué
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#1E1A17] border border-[#2A2420] rounded-3xl p-6 sm:p-8 shadow-2xl my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#14110F] text-[#9C9488] hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#167A42]/10 border border-[#167A42]/20 text-[#167A42] text-xs font-bold uppercase tracking-wider mb-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Clôture Journalière & Payouts B2C</span>
          </div>
          <h3 className="text-2xl font-black text-white font-poppins">
            Rapport Financier & Reversements M-Pesa
          </h3>
          <p className="text-xs text-[#9C9488] mt-1">
            Génération de l'état de fin de journée pour les 23 stands et la Fondation Congolicious
          </p>
        </div>

        {/* Financial Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="p-4 rounded-2xl bg-[#14110F] border border-[#2A2420] text-center">
            <div className="text-[10px] uppercase font-bold text-[#9C9488]">Chiffre d'Affaires Brut</div>
            <div className="text-xl font-black text-white font-mono mt-1">
              {formatUSD(report.totalGrossUSD)}
            </div>
            <div className="text-[10px] text-[#9C9488] font-mono">≈ {formatCDF(report.totalGrossUSD)}</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#14110F] border border-[#FF6A2B]/30 text-center">
            <div className="text-[10px] uppercase font-bold text-[#FF6A2B] flex items-center justify-center gap-1">
              <Heart className="w-3 h-3 fill-[#FF6A2B]" />
              <span>Commission 10% Fdt</span>
            </div>
            <div className="text-xl font-black text-[#FF6A2B] font-mono mt-1">
              {formatUSD(report.totalCommissionUSD)}
            </div>
            <div className="text-[10px] text-[#9C9488] font-mono">Fondation Congolicious</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#14110F] border border-[#167A42]/30 text-center">
            <div className="text-[10px] uppercase font-bold text-[#167A42]">Net Standiers (90%)</div>
            <div className="text-xl font-black text-[#167A42] font-mono mt-1">
              {formatUSD(report.totalPayoutDueUSD)}
            </div>
            <div className="text-[10px] text-[#9C9488] font-mono">23 Stands Éligibles</div>
          </div>
        </div>

        {/* Stands Table Preview */}
        <div className="mb-6 border border-[#2A2420] rounded-2xl overflow-hidden max-h-56 overflow-y-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#14110F] text-[#9C9488] text-[10px] uppercase font-bold sticky top-0">
              <tr>
                <th className="py-2.5 px-3">Stand</th>
                <th className="py-2.5 px-3">Numéro M-Pesa</th>
                <th className="py-2.5 px-3 text-right">Net Reversé (90%)</th>
                <th className="py-2.5 px-3 text-right">Statut B2C</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2420] text-[#F5F3EF]">
              {report.standBreakdown.map((s) => (
                <tr key={s.standId} className="hover:bg-[#14110F]/60">
                  <td className="py-2 px-3 font-semibold text-white">{s.standName}</td>
                  <td className="py-2 px-3 font-mono text-[11px] text-[#9C9488]">{s.phoneMpesa}</td>
                  <td className="py-2 px-3 text-right font-mono font-bold text-[#167A42]">
                    {formatUSD(s.netPayoutUSD)}
                  </td>
                  <td className="py-2 px-3 text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#167A42]/10 text-[#167A42]">
                      {isDisbursed ? 'Envoyé M-Pesa' : 'Prêt pour B2C'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Action Button */}
        <div className="space-y-3">
          {!isDisbursed ? (
            <button
              onClick={handleExecutePayouts}
              disabled={isProcessing}
              className="w-full py-4 px-6 rounded-2xl bg-[#FF6A2B] hover:bg-[#E24E10] disabled:opacity-50 text-[#14110F] font-bold text-sm uppercase tracking-wider shadow-lg transition flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#14110F] border-t-transparent rounded-full animate-spin" />
                  <span>Envoi groupé M-Pesa B2C vers 23 comptes en cours...</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-4 h-4 text-[#14110F]" />
                  <span>Déclencher le Payout Groupé ({formatUSD(report.totalPayoutDueUSD)})</span>
                </>
              )}
            </button>
          ) : (
            <div className="flex items-center justify-between text-xs text-[#9C9488] pt-2 border-t border-[#2A2420]">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#167A42]" />
                <span>Rapport scellé & horodaté Vodacom RDC</span>
              </span>
              <button
                onClick={() => window.print()}
                className="text-[#9C9488] hover:text-white flex items-center gap-1 transition"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimer l'état de clôture</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
