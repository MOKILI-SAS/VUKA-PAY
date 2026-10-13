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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-[28px] bg-white border border-[#E5E0D8] shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#14110F] flex items-center justify-center text-[#FFC21A] font-black text-2xl shadow-sm font-poppins">
            {wallet.festivalierName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-[#14110F] font-poppins">{wallet.festivalierName}</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-[#FFE3D3] text-[#FF6A2B] border border-[#FF6A2B]/20 text-[10px] font-bold">
                Actif
              </span>
            </div>
            <p className="text-xs text-[#9C9488] font-mono mt-0.5">{wallet.phone}</p>
          </div>
        </div>

        {/* RFID Wristband Info */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#FBF6EE] border border-[#E5E0D8]">
          <Radio className="w-5 h-5 text-[#FF6A2B] shrink-0 animate-pulse" />
          <div className="text-xs">
            <div className="text-[#9C9488] font-medium">Bracelet RFID Associé</div>
            <div className="text-[#14110F] font-mono font-bold">{wallet.rfidTagId || 'MIFARE-DESFIRE-8842'}</div>
          </div>
        </div>
      </div>

      {/* Main Solde & Top-Up Card */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        
        {/* Balance Card (2 cols) */}
        <div className="md:col-span-2 p-6 rounded-[28px] bg-white border border-[#E5E0D8] flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#9C9488]">
                Solde Cashless Disponible
              </span>
              <div className="p-2 rounded-xl bg-[#FFE3D3] text-[#FF6A2B]">
                <Wallet className="w-5 h-5" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-4xl sm:text-5xl font-black text-[#14110F] font-mono">
                {formatUSD(wallet.balanceUSD)}
              </div>
              <div className="text-sm font-bold text-[#FF6A2B] font-mono">
                ≈ {formatCDF(wallet.balanceUSD)}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-[#E5E0D8] text-xs text-[#9C9488] space-y-1 font-medium">
            <div className="flex justify-between">
              <span>Pass Événement :</span>
              <span className="text-[#14110F] font-bold">{linkedTicket?.ticketName || 'Pass CFW6'}</span>
            </div>
            <div className="flex justify-between">
              <span>Dernière recharge :</span>
              <span className="text-[#4A443D] font-mono">Aujourd'hui</span>
            </div>
          </div>
        </div>

        {/* Quick Recharge M-Pesa (3 cols) */}
        <div className="md:col-span-3 p-6 rounded-[28px] bg-white border border-[#E5E0D8] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-[#FF6A2B]" />
                <h3 className="text-base font-black text-[#14110F] font-poppins">Recharger via M-Pesa</h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FBF6EE] text-[#4A443D] border border-[#E5E0D8] uppercase">
                Vodacom C2B Instantané
              </span>
            </div>
            <p className="text-xs text-[#9C9488] mb-4">
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
                      ? 'bg-[#FF6A2B] text-[#14110F] border-[#FF6A2B] shadow-sm font-black'
                      : 'bg-[#FBF6EE] text-[#4A443D] border-[#E5E0D8] hover:border-[#FF6A2B]'
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
                className="w-full px-4 py-2.5 rounded-xl bg-[#FBF6EE] border border-[#E5E0D8] text-[#14110F] placeholder-[#9C9488] text-xs font-mono focus:outline-none focus:border-[#FF6A2B] focus:bg-white"
              />
            </div>
          </div>

          {/* Action Button Pill */}
          <button
            onClick={() => handleTopUp(topUpAmount)}
            disabled={isTopUpLoading || topUpAmount <= 0}
            className="w-full py-3.5 px-4 rounded-full bg-[#FF6A2B] hover:bg-[#E24E10] disabled:opacity-50 text-[#14110F] font-bold text-xs uppercase tracking-wider shadow-md transition flex items-center justify-center gap-2 active:scale-95"
          >
            {isTopUpLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-[#14110F] border-t-transparent rounded-full animate-spin" />
                <span>Validation M-Pesa en cours...</span>
              </>
            ) : topUpSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#14110F]" />
                <span>Recharge de {formatUSD(topUpAmount)} créditée !</span>
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4 text-[#14110F]" />
                <span>Créditer {formatUSD(topUpAmount)} ({formatCDF(topUpAmount)})</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center justify-center gap-1.5 bg-[#F5F3EF] p-1.5 rounded-full border border-[#E5E0D8] max-w-md mx-auto">
        <button
          onClick={() => setActiveTab('QR')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-full text-xs font-bold transition ${
            activeTab === 'QR' 
              ? 'bg-white text-[#FF6A2B] shadow-sm font-black' 
              : 'text-[#4A443D] hover:text-[#14110F]'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>QR Dynamique (Payer)</span>
        </button>

        <button
          onClick={() => setActiveTab('HISTORY')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-full text-xs font-bold transition ${
            activeTab === 'HISTORY' 
              ? 'bg-white text-[#FF6A2B] shadow-sm font-black' 
              : 'text-[#4A443D] hover:text-[#14110F]'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Historique & Reçus</span>
        </button>

        <button
          onClick={() => setActiveTab('STANDS')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-full text-xs font-bold transition ${
            activeTab === 'STANDS' 
              ? 'bg-white text-[#FF6A2B] shadow-sm font-black' 
              : 'text-[#4A443D] hover:text-[#14110F]'
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
