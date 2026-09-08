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
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Clôture Journalière & Payouts B2C</span>
          </div>
          <h3 className="text-2xl font-black text-white">
            Rapport Financier & Reversements M-Pesa
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Génération de l'état de fin de journée pour les 23 stands et la Fondation Congolicious
          </p>
        </div>

        {/* Financial Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
            <div className="text-[10px] uppercase font-bold text-slate-400">Chiffre d'Affaires Brut</div>
            <div className="text-xl font-black text-white font-mono mt-1">
              {formatUSD(report.totalGrossUSD)}
            </div>
            <div className="text-[10px] text-slate-500 font-mono">≈ {formatCDF(report.totalGrossUSD)}</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-[#FF5722]/30 text-center">
            <div className="text-[10px] uppercase font-bold text-[#FF5722] flex items-center justify-center gap-1">
              <Heart className="w-3 h-3 fill-[#FF5722]" />
              <span>Commission 10% Fdt</span>
            </div>
            <div className="text-xl font-black text-[#FF5722] font-mono mt-1">
              {formatUSD(report.totalCommissionUSD)}
            </div>
            <div className="text-[10px] text-slate-400 font-mono">Fondation Congolicious</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 text-center">
            <div className="text-[10px] uppercase font-bold text-emerald-400">Net Standiers (90%)</div>
            <div className="text-xl font-black text-emerald-400 font-mono mt-1">
              {formatUSD(report.totalPayoutDueUSD)}
            </div>
            <div className="text-[10px] text-slate-400 font-mono">23 Stands Éligibles</div>
          </div>
        </div>

        {/* Stands Table Preview */}
        <div className="mb-6 border border-slate-800 rounded-2xl overflow-hidden max-h-56 overflow-y-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 text-[10px] uppercase font-bold sticky top-0">
              <tr>
                <th className="py-2.5 px-3">Stand</th>
                <th className="py-2.5 px-3">Numéro M-Pesa</th>
                <th className="py-2.5 px-3 text-right">Net Reversé (90%)</th>
                <th className="py-2.5 px-3 text-right">Statut B2C</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {report.standBreakdown.map((s) => (
                <tr key={s.standId} className="hover:bg-slate-800/40">
                  <td className="py-2 px-3 font-semibold text-white">{s.standName}</td>
                  <td className="py-2 px-3 font-mono text-[11px] text-slate-400">{s.phoneMpesa}</td>
                  <td className="py-2 px-3 text-right font-mono font-bold text-emerald-400">
                    {formatUSD(s.netPayoutUSD)}
                  </td>
                  <td className="py-2 px-3 text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400">
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
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 text-white font-bold text-sm uppercase tracking-wider shadow-lg transition flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Envoi groupé M-Pesa B2C vers 23 comptes en cours...</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-4 h-4" />
                  <span>Déclencher le Payout Groupé ({formatUSD(report.totalPayoutDueUSD)})</span>
                </>
              )}
            </button>
          ) : (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-center font-bold text-sm">
              Reversements M-Pesa B2C exécutés avec succès vers les 23 stands !
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-800">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Rapport scellé & horodaté Vodacom RDC</span>
            </span>
            <button
              onClick={() => window.print()}
              className="text-slate-400 hover:text-white flex items-center gap-1 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer l'état de clôture</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
