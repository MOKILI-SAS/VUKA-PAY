import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatUSD, formatCDF } from '../../utils/formatters';
import { 
  Wallet, 
  PlusCircle, 
  QrCode, 
  Receipt, 
  Radio, 
  Smartphone, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  UtensilsCrossed,
  ShieldCheck
} from 'lucide-react';
import { DynamicQRCode } from './DynamicQRCode';
import { TransactionHistory } from './TransactionHistory';
import { StandsMenuExplorer } from './StandsMenuExplorer';

export const WalletDashboard: React.FC = () => {
  const { wallet, topUpWallet, purchasedTickets } = useApp();
  
  const [activeTab, setActiveTab] = useState<'QR' | 'HISTORY' | 'STANDS'>('QR');
  const [topUpAmount, setTopUpAmount] = useState<number>(10);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isTopUpLoading, setIsTopUpLoading] = useState(false);
  const [topUpSuccess, setTopUpSuccess] = useState(false);

  // Billet lié au wallet
  const linkedTicket = purchasedTickets.find(t => t.ticketId === wallet.linkedTicketId) || purchasedTickets[0];

  const handleTopUp = async (amount: number) => {
    if (amount <= 0) return;
    setIsTopUpLoading(true);
    setTopUpSuccess(false);

    await topUpWallet(amount, wallet.phone);

    setIsTopUpLoading(false);
    setTopUpSuccess(true);
    setTimeout(() => setTopUpSuccess(false), 3000);
  };

  const quickPacks = [5, 10, 20, 50];

  return (
    <div className="py-8 px-4 sm:px-6 max-w-4xl mx-auto space-y-8">
      
      {/* Top Banner / User Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-[#141b2d] border border-slate-800 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FF5722] to-[#FFB300] flex items-center justify-center text-white font-black text-2xl shadow-vuka">
            {wallet.festivalierName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white">{wallet.festivalierName}</h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-[#10B981] border border-emerald-500/20 text-[10px] font-bold">
                Actif
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{wallet.phone}</p>
          </div>
        </div>

        {/* RFID Wristband Info */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
          <Radio className="w-5 h-5 text-[#00D2FF] shrink-0 animate-pulse" />
          <div className="text-xs">
            <div className="text-slate-400 font-medium">Bracelet RFID Associé</div>
            <div className="text-white font-mono font-bold">{wallet.rfidTagId || 'MIFARE-DESFIRE-8842'}</div>
          </div>
        </div>
      </div>

      {/* Main Solde & Top-Up Card */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        
        {/* Balance Card (2 cols) */}
        <div className="md:col-span-2 p-6 rounded-3xl bg-gradient-to-b from-slate-900 to-[#0e1424] border border-slate-800 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Solde Cashless Disponible
              </span>
              <div className="p-2 rounded-xl bg-[#FF5722]/10 text-[#FF5722]">
                <Wallet className="w-5 h-5" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-4xl sm:text-5xl font-black text-white font-mono">
                {formatUSD(wallet.balanceUSD)}
              </div>
              <div className="text-sm font-bold text-[#FFB300] font-mono">
                ≈ {formatCDF(wallet.balanceUSD)}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-800 text-xs text-slate-400 space-y-1">
            <div className="flex justify-between">
              <span>Pass Événement :</span>
              <span className="text-white font-semibold">{linkedTicket?.ticketName || 'Pass CFW6'}</span>
            </div>
            <div className="flex justify-between">
              <span>Dernière recharge :</span>
              <span className="text-slate-300 font-mono">Aujourd'hui</span>
            </div>
          </div>
        </div>

        {/* Quick Recharge M-Pesa (3 cols) */}
        <div className="md:col-span-3 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-[#FF5722]" />
                <h3 className="text-base font-bold text-white">Recharger via M-Pesa</h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 uppercase">
                Vodacom C2B Instantané
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Sélectionnez un montant ou saisissez votre valeur pour créditer votre compte instantanément.
            </p>

            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-4 gap-2.5 mb-4">
              {quickPacks.map((amt) => (
                <button
                  key={amt}
                  onClick={() => {
                    setTopUpAmount(amt);
                    setCustomAmount('');
                  }}
                  className={`py-2.5 rounded-xl font-mono text-sm font-bold border transition ${
                    topUpAmount === amt && !customAmount
                      ? 'bg-[#FF5722] text-white border-[#FF5722] shadow-vuka'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  +{formatUSD(amt)}
                </button>
              ))}
            </div>

            {/* Custom Amount Input */}
            <div className="relative mb-4">
              <input
                type="number"
                placeholder="Autre montant en USD (ex: 35)"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setTopUpAmount(Number(e.target.value) || 0);
                }}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-[#FF5722]"
              />
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={() => handleTopUp(topUpAmount)}
            disabled={isTopUpLoading || topUpAmount <= 0}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#FF5722] to-[#FF7A00] hover:from-[#E64A19] hover:to-[#F57C00] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider shadow-vuka transition flex items-center justify-center gap-2"
          >
            {isTopUpLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Validation M-Pesa en cours...</span>
              </>
            ) : topUpSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>Recharge de {formatUSD(topUpAmount)} créditée !</span>
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4" />
                <span>Créditer {formatUSD(topUpAmount)} ({formatCDF(topUpAmount)})</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center justify-center gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 max-w-md mx-auto">
        <button
          onClick={() => setActiveTab('QR')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'QR' 
              ? 'bg-[#FF5722] text-white shadow-vuka' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>QR Dynamique (Payer)</span>
        </button>

        <button
          onClick={() => setActiveTab('HISTORY')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'HISTORY' 
              ? 'bg-[#FF5722] text-white shadow-vuka' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Historique & Reçus</span>
        </button>

        <button
          onClick={() => setActiveTab('STANDS')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'STANDS' 
              ? 'bg-[#FF5722] text-white shadow-vuka' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <UtensilsCrossed className="w-4 h-4" />
          <span>23 Stands</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'QR' && <DynamicQRCode />}
        {activeTab === 'HISTORY' && <TransactionHistory />}
        {activeTab === 'STANDS' && <StandsMenuExplorer />}
      </div>

    </div>
  );
};
