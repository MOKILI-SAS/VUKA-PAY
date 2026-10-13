import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatUSD, formatCDF, formatDateTime } from '../../utils/formatters';
import { ArrowDownLeft, ArrowUpRight, Receipt, Store, Heart, CheckCircle2 } from 'lucide-react';

export const TransactionHistory: React.FC = () => {
  const { transactions, wallet } = useApp();

  // Filtrer les transactions de ce portefeuille
  const userTransactions = transactions.filter(t => 
    t.festivalierId === wallet.id || 
    t.festivalierPhone === wallet.phone
  );

  return (
    <div className="bg-white border border-[#E5E0D8] rounded-[28px] p-6 shadow-sm max-w-xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-black text-[#14110F] flex items-center gap-2 font-poppins">
            <Receipt className="w-5 h-5 text-[#FF6A2B]" />
            <span>Historique Cashless</span>
          </h3>
          <p className="text-xs text-[#9C9488] mt-0.5">
            Toutes vos recharges et consommations sur les stands du CFW6
          </p>
        </div>

        <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-[#F5F3EF] text-[#4A443D] font-bold border border-[#E5E0D8]">
          {userTransactions.length} transaction{userTransactions.length > 1 ? 's' : ''}
        </span>
      </div>

      {userTransactions.length === 0 ? (
        <div className="text-center py-12 text-[#9C9488] text-sm font-medium">
          Aucune transaction pour le moment.
        </div>
      ) : (
        <div className="space-y-3">
          {userTransactions.map((tx) => {
            const isTopup = tx.type === 'TOPUP';

            return (
              <div
                key={tx.id}
                className="p-4 rounded-2xl bg-[#FBF6EE] border border-[#E5E0D8] hover:border-[#FF6A2B]/30 transition space-y-2.5"
              >
                {/* Main Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isTopup 
                        ? 'bg-[#E3EEF6] text-[#0E5A8A] border border-[#0E5A8A]/20' 
                        : 'bg-[#FFE3D3] text-[#FF6A2B] border border-[#FF6A2B]/20'
                    }`}>
                      {isTopup ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                    </div>

                    <div>
                      <div className="text-sm font-black text-[#14110F] flex items-center gap-1.5 font-poppins">
                        {isTopup ? (
                          <span>Recharge M-Pesa C2B</span>
                        ) : (
                          <>
                            <Store className="w-3.5 h-3.5 text-[#FF6A2B]" />
                            <span>{tx.standName || 'Stand Exposant CFW6'}</span>
                          </>
                        )}
                      </div>
                      <div className="text-[11px] text-[#9C9488] font-mono">
                        {formatDateTime(tx.timestamp)} • {tx.id}
                      </div>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="text-right">
                    <div className={`text-base font-black font-mono ${
                      isTopup ? 'text-[#167A42]' : 'text-[#14110F]'
                    }`}>
                      {isTopup ? '+' : '-'}{formatUSD(tx.amountUSD)}
                    </div>
                    <div className="text-[11px] text-[#FF6A2B] font-mono font-bold">
                      ≈ {formatCDF(tx.amountUSD)}
                    </div>
                  </div>
                </div>

                {/* Items Purchased if Food / Drink */}
                {tx.items && tx.items.length > 0 && (
                  <div className="pt-2 border-t border-[#E5E0D8] text-xs text-[#4A443D] space-y-1">
                    <div className="text-[10px] uppercase font-bold text-[#9C9488]">Détail de la commande :</div>
                    {tx.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-[#14110F]">
                        <span>{item.quantity}x {item.productName}</span>
                        <span className="font-mono font-bold">{formatUSD(item.priceUSD * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Foundation Split Notice */}
                {tx.commissionAmountUSD > 0 && (
                  <div className="flex items-center gap-1.5 text-[10px] text-[#FF6A2B] bg-[#FFE3D3] px-2.5 py-1 rounded-lg font-bold border border-[#FF6A2B]/20">
                    <Heart className="w-3 h-3 text-[#FF6A2B] fill-[#FF6A2B]" />
                    <span>
                      Dont 10% ({formatUSD(tx.commissionAmountUSD)}) reversés à la Fondation Congolicious
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
