import React from 'react';
import { CashlessTransaction, Stand } from '../../types';
import { formatUSD, formatCDF, formatDateTime } from '../../utils/formatters';
import { X, Printer, CheckCircle2, Heart, Share2, ShieldCheck } from 'lucide-react';

interface POSReceiptModalProps {
  transaction: CashlessTransaction | null;
  stand: Stand | undefined;
  onClose: () => void;
}

export const POSReceiptModal: React.FC<POSReceiptModalProps> = ({ transaction, stand, onClose }) => {
  if (!transaction) return null;

  const handlePrintThermal = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-sm bg-white text-slate-900 rounded-3xl p-6 shadow-2xl font-mono text-xs my-8 border-4 border-slate-900">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 text-slate-500 hover:text-black hover:bg-slate-200 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Thermal Header */}
        <div className="text-center pb-4 border-b-2 border-dashed border-slate-300">
          <div className="font-black text-lg tracking-wider">VUKA PAY • POS</div>
          <div className="font-bold text-sm mt-0.5">{stand?.name || transaction.standName}</div>
          <div className="text-[10px] text-slate-600">Stand #{stand?.number.toString().padStart(2, '0') || '01'} • Kinshasa CFW6</div>
          <div className="text-[10px] text-slate-500 mt-1">{formatDateTime(transaction.timestamp)}</div>
          <div className="text-[9px] text-slate-400 mt-0.5 font-bold">TICKET #{transaction.id}</div>
        </div>

        {/* Offline Badge if applicable */}
        {transaction.offlineGenerated && (
          <div className="my-2 p-1.5 text-center bg-amber-100 text-amber-800 font-bold text-[10px] rounded border border-amber-300">
            * ENCAISSÉ EN MODE DÉGRADÉ HORS-LIGNE *
          </div>
        )}

        {/* Items List */}
        <div className="py-3 border-b-2 border-dashed border-slate-300 space-y-2">
          {transaction.items && transaction.items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-start">
              <div>
                <div className="font-bold">{item.productName}</div>
                <div className="text-[10px] text-slate-500">{item.quantity} x {formatUSD(item.priceUSD)}</div>
              </div>
              <div className="font-bold text-right">{formatUSD(item.priceUSD * item.quantity)}</div>
            </div>
          ))}
        </div>

        {/* Financial Summary */}
        <div className="py-3 border-b-2 border-dashed border-slate-300 space-y-1.5">
          <div className="flex justify-between text-sm font-black">
            <span>TOTAL PAYÉ :</span>
            <span>{formatUSD(transaction.amountUSD)}</span>
          </div>
          <div className="flex justify-between text-xs text-slate-600 font-bold">
            <span>ÉQUIVALENT CDF :</span>
            <span>{formatCDF(transaction.amountUSD)}</span>
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 pt-1">
            <span>Mode de règlement :</span>
            <span>{transaction.paymentMethod === 'WALLET_QR_DYNAMIC' ? 'QR Code Dynamique' : 'Bracelet RFID'}</span>
          </div>
        </div>

        {/* Split Solidaire 10% Fondation Congolicious */}
        <div className="py-2.5 bg-slate-50 rounded-xl my-3 p-2.5 border border-slate-200 text-[10px] space-y-1">
          <div className="flex items-center gap-1 font-bold text-[#FF5722]">
            <Heart className="w-3 h-3 fill-[#FF5722]" />
            <span>MODÈLE SOLIDAIRE (CFW6) :</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Part Standier (90%) :</span>
            <span className="font-bold">{formatUSD(transaction.merchantNetUSD)}</span>
          </div>
          <div className="flex justify-between text-[#FF5722] font-bold">
            <span>Fondation Congolicious (10%) :</span>
            <span>{formatUSD(transaction.commissionAmountUSD)}</span>
          </div>
        </div>

        {/* Thermal Footer */}
        <div className="text-center pt-2 space-y-2">
          <div className="text-[10px] text-slate-500">
            Merci pour votre commande au Congo Food Week 6 !
          </div>
          <div className="text-[9px] font-bold text-slate-400">
            Propulsé par MOKILI (mokili.io) • Terminal Sunmi V2S
          </div>

          <div className="pt-2 flex items-center justify-center gap-2">
            <button
              onClick={handlePrintThermal}
              className="flex-1 py-2 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center gap-1.5 hover:bg-slate-800 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer</span>
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-2 rounded-xl bg-slate-200 text-slate-800 font-bold hover:bg-slate-300 transition"
            >
              Nouvelle Vente
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
