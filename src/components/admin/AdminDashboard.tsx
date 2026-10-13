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
  Calendar
} from 'lucide-react';
import { StockRequestsView } from './StockRequestsView';
import { StandPerformance } from './StandPerformance';
import { DayClosingPayoutModal } from './DayClosingPayoutModal';
import { OrganizerEventsManager } from './OrganizerEventsManager';
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

  const [activeTab, setActiveTab] = useState<'EVENTS' | 'STOCKS' | 'STANDS' | 'AUDIT'>('EVENTS');
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
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-[28px] bg-white border border-[#E5E0D8] shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#FFE3D3] border border-[#FF6A2B]/20 text-[#FF6A2B] flex items-center justify-center font-black text-2xl">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-[#14110F] font-poppins">Super Admin & Trésorerie Centrale</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-[#FFE3D3] text-[#FF6A2B] border border-[#FF6A2B]/20 text-[10px] font-bold">
                Congo Food Week 6
              </span>
            </div>
            <p className="text-xs text-[#9C9488] font-mono mt-0.5">
              Supervision financière, validation des stocks et reversements quotidiens M-Pesa B2C
            </p>
          </div>
        </div>

        {/* Global Action Trigger: Clôture */}
        <button
          onClick={handleOpenClosing}
          className="py-3.5 px-6 rounded-full bg-[#FF6A2B] hover:bg-[#E24E10] text-[#14110F] font-bold text-xs uppercase tracking-wider shadow-md transition flex items-center justify-center gap-2 active:scale-95"
        >
          <Smartphone className="w-4 h-4 text-[#14110F]" />
          <span>Clôture Journalière & Payouts B2C</span>
        </button>
      </div>

      {/* 4 Key Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Volume Brut Cashless */}
        <div className="p-5 rounded-[24px] bg-white border border-[#E5E0D8] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#9C9488] uppercase tracking-wider">Volume Cashless Brut</span>
            <TrendingUp className="w-4 h-4 text-[#0E5A8A]" />
          </div>
          <div className="text-3xl font-black text-[#14110F] font-mono">
            {formatUSD(totalVolumeUSD)}
          </div>
          <div className="text-xs text-[#FF6A2B] font-mono font-bold mt-1">
            ≈ {formatCDF(totalVolumeUSD)}
          </div>
        </div>

        {/* Metric 2: Fondation Congolicious 10% */}
        <div className="p-5 rounded-[24px] bg-white border border-[#E5E0D8] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#FF6A2B] uppercase tracking-wider flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-[#FF6A2B]" />
              <span>10% Fdt Congolicious</span>
            </span>
          </div>
          <div className="text-3xl font-black text-[#FF6A2B] font-mono">
            {formatUSD(totalFoundationCommissionUSD)}
          </div>
          <div className="text-xs text-[#9C9488] font-medium mt-1">
            Reversé pour les œuvres sociales
          </div>
        </div>

        {/* Metric 3: Net Dû Standiers 90% */}
        <div className="p-5 rounded-[24px] bg-white border border-[#E5E0D8] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#9C9488] uppercase tracking-wider">Net Dû aux 23 Stands (90%)</span>
            <Building2 className="w-4 h-4 text-[#167A42]" />
          </div>
          <div className="text-3xl font-black text-[#167A42] font-mono">
            {formatUSD(netDueToStandsUSD)}
          </div>
          <div className="text-xs text-[#9C9488] font-medium mt-1">
            Reversement par M-Pesa B2C
          </div>
        </div>

        {/* Metric 4: Festivaliers Présents */}
        <div className="p-5 rounded-[24px] bg-white border border-[#E5E0D8] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#9C9488] uppercase tracking-wider">Affluence en Direct</span>
            <Users className="w-4 h-4 text-[#14110F]" />
          </div>
          <div className="text-3xl font-black text-[#14110F] font-mono">
            {totalAttendeesEntered}
          </div>
          <div className="text-xs text-[#9C9488] font-medium mt-1">
            Sur {purchasedTickets.length} billets émis
          </div>
        </div>

      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E5E0D8] pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('EVENTS')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition shrink-0 ${
            activeTab === 'EVENTS'
              ? 'bg-[#FF6A2B] text-[#14110F] shadow-sm font-black'
              : 'text-[#4A443D] hover:text-[#14110F] bg-white border border-[#E5E0D8]'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Mes Événements & Déroulement</span>
        </button>

        <button
          onClick={() => setActiveTab('STOCKS')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition shrink-0 ${
            activeTab === 'STOCKS'
              ? 'bg-[#FF6A2B] text-[#14110F] shadow-sm font-black'
              : 'text-[#4A443D] hover:text-[#14110F] bg-white border border-[#E5E0D8]'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Validation Réassorts</span>
          {pendingRequestsCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-[#14110F] text-[#FFC21A] text-[10px] font-black">
              {pendingRequestsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('STANDS')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition shrink-0 ${
            activeTab === 'STANDS'
              ? 'bg-[#FFC21A] text-[#14110F] shadow-sm font-black'
              : 'text-[#4A443D] hover:text-[#14110F] bg-white border border-[#E5E0D8]'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Classement 23 Stands</span>
        </button>

        <button
          onClick={() => setActiveTab('AUDIT')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition shrink-0 ${
            activeTab === 'AUDIT'
              ? 'bg-[#14110F] text-white font-bold'
              : 'text-[#4A443D] hover:text-[#14110F] bg-white border border-[#E5E0D8]'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Journal d'Audit ({transactions.length})</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'EVENTS' && <OrganizerEventsManager />}
        {activeTab === 'STOCKS' && <StockRequestsView />}
        {activeTab === 'STANDS' && <StandPerformance />}
        {activeTab === 'AUDIT' && (
          <div className="bg-white border border-[#E5E0D8] rounded-[28px] p-6 shadow-sm space-y-4">
            <h3 className="text-base font-black text-[#14110F] font-poppins">Journal Cryptographique de Toutes les Transactions</h3>
            <div className="divide-y divide-[#E5E0D8] max-h-[500px] overflow-y-auto">
              {transactions.map(tx => (
                <div key={tx.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-[#14110F] flex items-center gap-2">
                      <span className="font-mono">{tx.id}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F5F3EF] text-[#4A443D]">
                        {tx.type} • {tx.paymentMethod}
                      </span>
                      {tx.offlineGenerated && (
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-bold">
                          Sync Offline
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#9C9488] mt-0.5 font-mono">
                      {formatDateTime(tx.timestamp)} • Stand: {tx.standName || 'N/A'} • Festivalier: {tx.festivalierPhone}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono font-black text-[#14110F] text-sm">{formatUSD(tx.amountUSD)}</div>
                    {tx.commissionAmountUSD > 0 && (
                      <div className="text-[10px] text-[#FF6A2B] font-mono font-bold">
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
