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
      <div className="relative w-full max-w-sm bg-white text-[#14110F] rounded-3xl p-6 shadow-2xl font-mono text-xs my-8 border-4 border-[#14110F]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-[#F5F3EF] text-[#9C9488] hover:text-[#14110F] hover:bg-[#E5E0D8] transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Thermal Header */}
        <div className="text-center pb-4 border-b-2 border-dashed border-[#E5E0D8]">
          <div className="font-black text-lg tracking-wider font-poppins">VUKA PAY • POS</div>
          <div className="font-bold text-sm mt-0.5">{stand?.name || transaction.standName}</div>
          <div className="text-[10px] text-[#4A443D]">Stand #{stand?.number.toString().padStart(2, '0') || '01'} • Kinshasa CFW6</div>
          <div className="text-[10px] text-[#9C9488] mt-1">{formatDateTime(transaction.timestamp)}</div>
          <div className="text-[9px] text-[#9C9488] mt-0.5 font-bold">TICKET #{transaction.id}</div>
        </div>

        {/* Offline Badge if applicable */}
        {transaction.offlineGenerated && (
          <div className="my-2 p-1.5 text-center bg-amber-100 text-amber-800 font-bold text-[10px] rounded border border-amber-300">
            * ENCAISSÉ EN MODE DÉGRADÉ HORS-LIGNE *
          </div>
        )}

        {/* Items List */}
        <div className="py-3 border-b-2 border-dashed border-[#E5E0D8] space-y-2">
          {transaction.items && transaction.items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-start">
              <div>
                <div className="font-bold text-[#14110F]">{item.productName}</div>
                <div className="text-[10px] text-[#9C9488]">{item.quantity} x {formatUSD(item.priceUSD)}</div>
              </div>
              <div className="font-bold text-right text-[#14110F]">{formatUSD(item.priceUSD * item.quantity)}</div>
            </div>
          ))}
        </div>

        {/* Financial Summary */}
        <div className="py-3 border-b-2 border-dashed border-[#E5E0D8] space-y-1.5">
          <div className="flex justify-between text-sm font-black">
            <span>TOTAL PAYÉ :</span>
            <span>{formatUSD(transaction.amountUSD)}</span>
          </div>
          <div className="flex justify-between text-xs text-[#4A443D] font-bold">
            <span>ÉQUIVALENT CDF :</span>
            <span>{formatCDF(transaction.amountUSD)}</span>
          </div>
          <div className="flex justify-between text-[10px] text-[#9C9488] pt-1">
            <span>Mode de règlement :</span>
            <span>{transaction.paymentMethod === 'WALLET_QR_DYNAMIC' ? 'QR Code Dynamique' : 'Bracelet RFID'}</span>
          </div>
        </div>

        {/* Split Solidaire 10% Fondation Congolicious */}
        <div className="py-2.5 bg-[#FBF6EE] rounded-xl my-3 p-2.5 border border-[#E5E0D8] text-[10px] space-y-1">
          <div className="flex items-center gap-1 font-bold text-[#FF6A2B]">
            <Heart className="w-3 h-3 fill-[#FF6A2B]" />
            <span>MODÈLE SOLIDAIRE (CFW6) :</span>
          </div>
          <div className="flex justify-between text-[#4A443D]">
            <span>Part Standier (90%) :</span>
            <span className="font-bold text-[#14110F]">{formatUSD(transaction.merchantNetUSD)}</span>
          </div>
          <div className="flex justify-between text-[#FF6A2B] font-bold">
            <span>Fondation Congolicious (10%) :</span>
            <span>{formatUSD(transaction.commissionAmountUSD)}</span>
          </div>
        </div>

        {/* Thermal Footer */}
        <div className="text-center pt-2 space-y-2">
          <div className="text-[10px] text-[#4A443D]">
            Merci pour votre commande au Congo Food Week 6 !
          </div>
          <div className="text-[9px] font-bold text-[#9C9488]">
            Propulsé par MOKILI (mokili.io) • Terminal Sunmi V2S
          </div>

          <div className="pt-2 flex items-center justify-center gap-2">
            <button
              onClick={handlePrintThermal}
              className="flex-1 py-2 rounded-xl bg-[#14110F] text-white font-bold flex items-center justify-center gap-1.5 hover:bg-[#2A2420] transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer</span>
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-2 rounded-xl bg-[#F5F3EF] text-[#14110F] font-bold hover:bg-[#E5E0D8] transition"
            >
              Nouvelle Vente
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
