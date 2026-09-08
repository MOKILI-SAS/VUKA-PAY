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
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl max-w-xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Receipt className="w-5 h-5 text-[#FF5722]" />
            <span>Historique Cashless</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Toutes vos recharges et consommations sur les stands du CFW6
          </p>
        </div>

        <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 font-bold border border-slate-700">
          {userTransactions.length} transaction{userTransactions.length > 1 ? 's' : ''}
        </span>
      </div>

      {userTransactions.length === 0 ? (
        <div className="text-center py-12 text-slate-500 text-sm">
          Aucune transaction pour le moment.
        </div>
      ) : (
        <div className="space-y-3">
          {userTransactions.map((tx) => {
            const isTopup = tx.type === 'TOPUP';

            return (
              <div
                key={tx.id}
                className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition space-y-2.5"
              >
                {/* Main Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isTopup 
                        ? 'bg-emerald-500/10 text-[#10B981] border border-emerald-500/20' 
                        : 'bg-orange-500/10 text-[#FF5722] border border-[#FF5722]/20'
                    }`}>
                      {isTopup ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                    </div>

                    <div>
                      <div className="text-sm font-bold text-white flex items-center gap-1.5">
                        {isTopup ? (
                          <span>Recharge M-Pesa C2B</span>
                        ) : (
                          <>
                            <Store className="w-3.5 h-3.5 text-[#FFB300]" />
                            <span>{tx.standName || 'Stand Exposant CFW6'}</span>
                          </>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {formatDateTime(tx.timestamp)} • {tx.id}
                      </div>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="text-right">
                    <div className={`text-base font-black font-mono ${
                      isTopup ? 'text-[#10B981]' : 'text-white'
                    }`}>
                      {isTopup ? '+' : '-'}{formatUSD(tx.amountUSD)}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      ≈ {formatCDF(tx.amountUSD)}
                    </div>
                  </div>
                </div>

                {/* Items Purchased if Food / Drink */}
                {tx.items && tx.items.length > 0 && (
                  <div className="pt-2 border-t border-slate-800/80 text-xs text-slate-400 space-y-1">
                    <div className="text-[10px] uppercase font-bold text-slate-500">Détail de la commande :</div>
                    {tx.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-slate-300">
                        <span>{item.quantity}x {item.productName}</span>
                        <span className="font-mono">{formatUSD(item.priceUSD * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Foundation Split Notice */}
                {tx.commissionAmountUSD > 0 && (
                  <div className="flex items-center gap-1.5 text-[10px] text-[#FFB300] bg-[#FFB300]/10 px-2.5 py-1 rounded-lg">
                    <Heart className="w-3 h-3 fill-[#FFB300]" />
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
