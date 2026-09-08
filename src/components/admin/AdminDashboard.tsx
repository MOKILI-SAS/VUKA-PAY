import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatUSD, formatCDF, formatDateTime } from '../../utils/formatters';
import { 
  Building2, 
  TrendingUp, 
  Heart, 
  Users, 
  Package, 
  Receipt, 
  CheckCircle2, 
  Smartphone, 
  ShieldAlert, 
  RefreshCw,
  Trophy,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { StockRequestsView } from './StockRequestsView';
import { StandPerformance } from './StandPerformance';
import { DayClosingPayoutModal } from './DayClosingPayoutModal';
import { DailyClosingReport } from '../../types';

export const AdminDashboard: React.FC = () => {
  const { 
    totalMerchantNetUSD,
    totalFoundationCommissionUSD, 
    stands, 
    stockRequests, 
    transactions,
    purchasedTickets,
    totalAttendeesEntered,
    executeDailyClosingAndPayout
  } = useApp();

  const [activeTab, setActiveTab] = useState<'STOCKS' | 'STANDS' | 'AUDIT'>('STOCKS');
  const [closingModalOpen, setClosingModalOpen] = useState(false);
  const [closingReport, setClosingReport] = useState<DailyClosingReport | null>(null);

  const pendingRequestsCount = stockRequests.filter(r => r.status === 'PENDING').length;
  const totalVolumeUSD = totalMerchantNetUSD + totalFoundationCommissionUSD;
  const netDueToStandsUSD = totalMerchantNetUSD;

  const handleOpenClosing = () => {
    const report = executeDailyClosingAndPayout();
    setClosingReport(report);
    setClosingModalOpen(true);
  };

  return (
    <div className="py-8 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center font-black text-2xl">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white">Super Admin & Trésorerie Centrale</h2>
              <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] font-bold">
                Congo Food Week 6
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Supervision financière, validation des stocks et reversements quotidiens M-Pesa B2C
            </p>
          </div>
        </div>

        {/* Global Action Trigger: Clôture */}
        <button
          onClick={handleOpenClosing}
          className="py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg transition flex items-center justify-center gap-2"
        >
          <Smartphone className="w-4 h-4" />
          <span>Clôture Journalière & Payouts B2C</span>
        </button>
      </div>

      {/* 4 Key Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Volume Brut Cashless */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Volume Cashless Brut</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">
            {formatUSD(totalVolumeUSD)}
          </div>
          <div className="text-xs text-[#FFB300] font-mono mt-1">
            ≈ {formatCDF(totalVolumeUSD)}
          </div>
        </div>

        {/* Metric 2: Fondation Congolicious 10% */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-[#FF5722]/30 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#FF5722] uppercase tracking-wider flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 fill-[#FF5722]" />
              <span>10% Fdt Congolicious</span>
            </span>
          </div>
          <div className="text-3xl font-black text-[#FF5722] font-mono">
            {formatUSD(totalFoundationCommissionUSD)}
          </div>
          <div className="text-xs text-slate-400 font-mono mt-1">
            Reversé pour les œuvres sociales
          </div>
        </div>

        {/* Metric 3: Net Dû Standiers 90% */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Net Dû aux 23 Stands (90%)</span>
            <Building2 className="w-4 h-4 text-[#00D2FF]" />
          </div>
          <div className="text-3xl font-black text-emerald-400 font-mono">
            {formatUSD(netDueToStandsUSD)}
          </div>
          <div className="text-xs text-slate-400 font-mono mt-1">
            Reversement par M-Pesa B2C
          </div>
        </div>

        {/* Metric 4: Festivaliers Présents */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Affluence en Direct</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">
            {totalAttendeesEntered}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Sur {purchasedTickets.length} billets émis
          </div>
        </div>

      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('STOCKS')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'STOCKS'
              ? 'bg-[#FF5722] text-white shadow-vuka'
              : 'text-slate-400 hover:text-white bg-slate-900/60'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Validation Réassorts</span>
          {pendingRequestsCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-white text-slate-950 text-[10px] font-black">
              {pendingRequestsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('STANDS')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'STANDS'
              ? 'bg-[#FFB300] text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white bg-slate-900/60'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Classement 23 Stands</span>
        </button>

        <button
          onClick={() => setActiveTab('AUDIT')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'AUDIT'
              ? 'bg-purple-600 text-white'
              : 'text-slate-400 hover:text-white bg-slate-900/60'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Journal d'Audit ({transactions.length})</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'STOCKS' && <StockRequestsView />}
        {activeTab === 'STANDS' && <StandPerformance />}
        {activeTab === 'AUDIT' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white">Journal Cryptographique de Toutes les Transactions</h3>
            <div className="divide-y divide-slate-800 max-h-[500px] overflow-y-auto">
              {transactions.map(tx => (
                <div key={tx.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white flex items-center gap-2">
                      <span className="font-mono">{tx.id}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {tx.type} • {tx.paymentMethod}
                      </span>
                      {tx.offlineGenerated && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                          Sync Offline
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                      {formatDateTime(tx.timestamp)} • Stand: {tx.standName || 'N/A'} • Festivalier: {tx.festivalierPhone}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono font-bold text-white text-sm">{formatUSD(tx.amountUSD)}</div>
                    {tx.commissionAmountUSD > 0 && (
                      <div className="text-[10px] text-[#FF5722] font-mono">
                        10% Fdt: {formatUSD(tx.commissionAmountUSD)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Day Closing Modal */}
      {closingModalOpen && closingReport && (
        <DayClosingPayoutModal
          report={closingReport}
          onClose={() => setClosingModalOpen(false)}
        />
      )}

    </div>
  );
};
