import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatUSD, formatCDF } from '../../utils/formatters';
import { 
  Ticket, 
  Wallet, 
  Receipt, 
  User, 
  Compass, 
  Radio, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  QrCode, 
  RefreshCw, 
  Smartphone, 
  PlusCircle, 
  Download, 
  ChevronRight,
  Heart,
  Store,
  AlertCircle,
  ExternalLink,
  LogOut
} from 'lucide-react';
import { DynamicQRCode } from '../wallet/DynamicQRCode';
import { TicketPassView } from '../ticketing/TicketPassView';

export const ClientDashboard: React.FC = () => {
  const { 
    currentUser, 
    logoutUser, 
    activeClientTab, 
    setActiveClientTab, 
    wallet, 
    topUpWallet, 
    refundWalletBalance,
    linkRFIDToWallet,
    purchasedTickets,
    transactions,
    stands,
    setAppViewMode
  } = useApp();

  // Recharges
  const [selectedAmount, setSelectedAmount] = useState<number>(10);
  const [customTopUp, setCustomTopUp] = useState<string>('');
  const [isTopUpLoading, setIsTopUpLoading] = useState(false);
  const [topUpSuccess, setTopUpSuccess] = useState(false);

  // Remboursement solde
  const [refundPhone, setRefundPhone] = useState(currentUser?.phone || wallet.phone || '+243 ');
  const [isRefunding, setIsRefunding] = useState(false);
  const [refundSuccessMsg, setRefundSuccessMsg] = useState<string | null>(null);

  // Bracelet RFID
  const [rfidInput, setRfidInput] = useState(wallet.rfidTagId || '');
  const [rfidSuccessMsg, setRfidSuccessMsg] = useState(false);

  // Billet actif pour le QR Code
  const activeTicket = purchasedTickets[0] || null;

  // Calcul du parcours festivalier (étapes franchies)
  const hasTicket = purchasedTickets.length > 0;
  const hasLoadedWallet = wallet.balanceUSD > 0 || transactions.some(t => t.type === 'TOPUP');
  const hasRfid = !!wallet.rfidTagId;
  const hasSpent = transactions.some(t => t.type === 'PAYMENT');

  const completedStepsCount = [hasTicket, hasLoadedWallet, hasRfid, hasSpent].filter(Boolean).length;

  const handleTopUp = async (amount: number) => {
    if (amount <= 0) return;
    setIsTopUpLoading(true);
    setTopUpSuccess(false);
    await topUpWallet(amount, currentUser?.phone || wallet.phone);
    setIsTopUpLoading(false);
    setTopUpSuccess(true);
    setTimeout(() => setTopUpSuccess(false), 3500);
  };

  const handleRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (wallet.balanceUSD <= 0) return;
    setIsRefunding(true);
    setRefundSuccessMsg(null);
    const res = await refundWalletBalance(refundPhone);
    setIsRefunding(false);
    if (res.success) {
      setRefundSuccessMsg(`Virement M-Pesa de ${formatUSD(res.amountRefundedUSD)} envoyé avec succès sur ${refundPhone}`);
      setTimeout(() => setRefundSuccessMsg(null), 5000);
    }
  };

  const handleSaveRFID = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rfidInput.trim()) return;
    linkRFIDToWallet(rfidInput.trim());
    setRfidSuccessMsg(true);
    setTimeout(() => setRfidSuccessMsg(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. Header Festivalier avec Nom, Statut et Solde en direct */}
      <div className="p-6 sm:p-8 rounded-[32px] bg-white border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF6A2B] to-[#14110F] text-[#FFC21A] flex items-center justify-center font-display font-black text-2xl shadow-md shrink-0">
            {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'V'}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-display font-black text-[#14110F] tracking-tight">
                {currentUser?.name || 'Festivalier VUKA'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#167A42]/10 text-[#167A42] border border-[#167A42]/20 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-[#167A42]" />
                Compte Vérifié
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
              <span className="font-mono">{currentUser?.phone || wallet.phone}</span>
              <span>•</span>
              <span className="text-slate-400">ID: {currentUser?.id || wallet.id}</span>
            </div>
          </div>
        </div>

        {/* Quick Solde + TopUp CTA */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#FBF6EE]/60 border border-slate-200 self-start md:self-auto">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Solde Cashless
            </span>
            <div className="text-2xl font-black text-[#14110F] font-mono leading-none mt-1">
              {formatUSD(wallet.balanceUSD)}
            </div>
            <div className="text-[11px] font-bold text-[#FF6A2B] font-mono mt-0.5">
              ≈ {formatCDF(wallet.balanceUSD)}
            </div>
          </div>
          <button
            onClick={() => setActiveClientTab('WALLET')}
            className="px-4 py-2.5 rounded-full bg-[#FF6A2B] hover:bg-[#e0561d] text-[#14110F] font-display font-bold text-xs uppercase tracking-wider shadow-sm flex items-center gap-1.5 transition active:scale-95"
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#14110F]" />
            <span>Recharger</span>
          </button>
        </div>
      </div>

      {/* 2. Navigation par Onglets */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {[
          { id: 'OVERVIEW', label: 'Parcours Festivalier', icon: Compass },
          { id: 'TICKETS', label: `Mes Billets (${purchasedTickets.length})`, icon: Ticket },
          { id: 'WALLET', label: 'Portefeuille Cashless', icon: Wallet },
          { id: 'HISTORY', label: 'Mes Commandes & Reçus', icon: Receipt },
          { id: 'PROFILE', label: 'Profil & Sécurité', icon: User }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeClientTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveClientTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-3 rounded-full text-xs font-display font-bold transition-all shrink-0 ${
                isActive
                  ? 'bg-[#FF6A2B] text-[#14110F] shadow-md shadow-[#FF6A2B]/20'
                  : 'bg-white text-slate-600 hover:text-[#14110F] border border-slate-200 hover:bg-[#FBF6EE]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#14110F]' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. CONTENU : ONGLET 1 - VUE D'ENSEMBLE & PARCOURS FESTIVALIER */}
      {activeClientTab === 'OVERVIEW' && (
        <div className="space-y-8">
          
          {/* Progression du Parcours Festivalier */}
          <div className="p-6 sm:p-8 rounded-[32px] bg-white border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF6A2B]/10 border border-[#FF6A2B]/20 text-xs font-black text-[#FF6A2B] uppercase tracking-wider mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A2B]" />
                  <span>Votre Expérience Congo Food Week 6</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-display font-black text-[#14110F] tracking-tight">
                  Parcours Festivalier VUKA
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Suivez vos étapes pour profiter pleinement du festival sans attente et 100% sans contact.
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto bg-[#FBF6EE] border border-slate-200 px-4 py-2 rounded-full text-xs font-bold text-[#14110F]">
                <span>Progression :</span>
                <span className="text-[#FF6A2B] font-black">{completedStepsCount} / 4 Étapes</span>
              </div>
            </div>

            {/* 4 Step Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Étape 1 : Pass Billet */}
              <div className={`p-5 rounded-2xl border transition-all ${
                hasTicket 
                  ? 'bg-[#FBF6EE] border-[#FF6A2B]/40' 
                  : 'bg-white border-slate-200'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Étape 1</span>
                  {hasTicket ? (
                    <span className="w-6 h-6 rounded-full bg-[#FF6A2B] text-[#14110F] flex items-center justify-center font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                    </span>
                  ) : (
                    <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center text-xs font-bold">1</span>
                  )}
                </div>
                <h3 className="text-sm font-display font-black text-[#14110F] mb-1">Pass Réservé</h3>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                  {hasTicket ? `${purchasedTickets.length} billet(s) actif(s) sur votre compte.` : 'Choisissez votre pass 1 jour ou 6 jours.'}
                </p>
                <button
                  onClick={() => {
                    if (hasTicket) {
                      setActiveClientTab('TICKETS');
                    } else {
                      setAppViewMode('PUBLIC_LANDING');
                      setTimeout(() => {
                        document.getElementById('billetterie')?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }
                  }}
                  className={`w-full py-2 px-3 rounded-full text-xs font-display font-bold transition flex items-center justify-center gap-1 ${
                    hasTicket 
                      ? 'bg-white text-[#14110F] border border-slate-300 hover:bg-[#FBF6EE]' 
                      : 'bg-[#FF6A2B] text-[#14110F] hover:bg-[#e0561d]'
                  }`}
                >
                  <span>{hasTicket ? 'Voir mon Billet' : 'Acheter un Pass'}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Étape 2 : Portefeuille Cashless */}
              <div className={`p-5 rounded-2xl border transition-all ${
                hasLoadedWallet 
                  ? 'bg-[#FBF6EE] border-[#FF6A2B]/40' 
                  : 'bg-white border-slate-200'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Étape 2</span>
                  {hasLoadedWallet ? (
                    <span className="w-6 h-6 rounded-full bg-[#FF6A2B] text-[#14110F] flex items-center justify-center font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                    </span>
                  ) : (
                    <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center text-xs font-bold">2</span>
                  )}
                </div>
                <h3 className="text-sm font-display font-black text-[#14110F] mb-1">Solde Cashless</h3>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                  {hasLoadedWallet ? `Solde disponible : ${formatUSD(wallet.balanceUSD)}.` : 'Rechargez via M-Pesa avant d’arriver.'}
                </p>
                <button
                  onClick={() => setActiveClientTab('WALLET')}
                  className={`w-full py-2 px-3 rounded-full text-xs font-display font-bold transition flex items-center justify-center gap-1 ${
                    hasLoadedWallet 
                      ? 'bg-white text-[#14110F] border border-slate-300 hover:bg-[#FBF6EE]' 
                      : 'bg-[#FF6A2B] text-[#14110F] hover:bg-[#e0561d]'
                  }`}
                >
                  <span>{hasLoadedWallet ? 'Gérer le Solde' : 'Recharger (M-Pesa)'}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Étape 3 : Bracelet RFID */}
              <div className={`p-5 rounded-2xl border transition-all ${
                hasRfid 
                  ? 'bg-[#FBF6EE] border-[#FF6A2B]/40' 
                  : 'bg-white border-slate-200'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Étape 3</span>
                  {hasRfid ? (
                    <span className="w-6 h-6 rounded-full bg-[#FF6A2B] text-[#14110F] flex items-center justify-center font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                    </span>
                  ) : (
                    <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center text-xs font-bold">3</span>
                  )}
                </div>
                <h3 className="text-sm font-display font-black text-[#14110F] mb-1">Bracelet RFID</h3>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                  {hasRfid ? `Lié : ${wallet.rfidTagId}` : 'Associez votre bracelet reçu aux portes.'}
                </p>
                <button
                  onClick={() => setActiveClientTab('WALLET')}
                  className={`w-full py-2 px-3 rounded-full text-xs font-display font-bold transition flex items-center justify-center gap-1 ${
                    hasRfid 
                      ? 'bg-white text-[#14110F] border border-slate-300 hover:bg-[#FBF6EE]' 
                      : 'bg-[#FF6A2B] text-[#14110F] hover:bg-[#e0561d]'
                  }`}
                >
                  <span>{hasRfid ? 'Modifier RFID' : 'Lier mon Bracelet'}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Étape 4 : Consommation 23 Stands */}
              <div className={`p-5 rounded-2xl border transition-all ${
                hasSpent 
                  ? 'bg-[#FBF6EE] border-[#FF6A2B]/40' 
                  : 'bg-white border-slate-200'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Étape 4</span>
                  {hasSpent ? (
                    <span className="w-6 h-6 rounded-full bg-[#FF6A2B] text-[#14110F] flex items-center justify-center font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                    </span>
                  ) : (
                    <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center text-xs font-bold">4</span>
                  )}
                </div>
                <h3 className="text-sm font-display font-black text-[#14110F] mb-1">23 Stands Gourmands</h3>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                  {hasSpent ? 'Reçus disponibles avec 10% solidaire.' : 'Payez en 2 secondes aux caisses POS.'}
                </p>
                <button
                  onClick={() => setActiveClientTab('HISTORY')}
                  className="w-full py-2 px-3 rounded-full text-xs font-display font-bold bg-white text-slate-700 border border-slate-300 hover:bg-[#FBF6EE] hover:text-[#14110F] transition flex items-center justify-center gap-1"
                >
                  <span>Voir mes reçus</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

            </div>
          </div>

          {/* Quick Dual Cards: Pass QR d'accès + Recommandations stands */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Dynamic QR Code d'accès (7 cols) */}
            <div className="lg:col-span-7 p-6 sm:p-8 rounded-[32px] bg-white border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="w-6 h-1 bg-[#FF6A2B] rounded-full mb-1.5" />
                  <h3 className="text-lg sm:text-xl font-display font-black text-[#14110F]">
                    Votre QR Code d'Entrée & Portefeuille
                  </h3>
                  <p className="text-xs text-slate-500">
                    Présentez ce code aux bornes d'entrée ou aux caisses de stands.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#0E5A8A]/10 text-[#0E5A8A] border border-[#0E5A8A]/20 text-[10px] font-black font-mono">
                  ROTATION 30s
                </span>
              </div>

              {/* Dynamic QR component */}
              <div className="flex justify-center py-2">
                <DynamicQRCode />
              </div>
            </div>

            {/* Right: Stands phares & Solidarité 10% (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Solidarité Fondation */}
              <div className="p-6 rounded-[28px] bg-[#FBF6EE] border border-[#FF6A2B]/20 space-y-3">
                <div className="flex items-center gap-2 text-[#14110F] font-display font-black text-sm">
                  <Heart className="w-4 h-4 text-[#FF6A2B]" />
                  <span>Votre Impact Solidaire</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Chaque repas dégusté avec votre portefeuille VUKA Pay finance à hauteur de 10% les cantines scolaires de la Fondation Congolicious en RDC.
                </p>
                <div className="pt-1 flex items-center gap-2 text-xs font-black text-[#FF6A2B]">
                  <span>Merci pour votre soutien !</span>
                </div>
              </div>

              {/* Raccourci vers les stands */}
              <div className="p-6 rounded-[28px] bg-white border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Store className="w-4 h-4 text-[#FF6A2B]" />
                    <h4 className="text-sm font-display font-black text-[#14110F]">Les 23 Stands du Festival</h4>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">CFW 6</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Grillades au feu de bois, poissons du fleuve, cocktails création et desserts artisanaux vous attendent à l'Académie des Beaux-Arts.
                </p>
                <button
                  onClick={() => {
                    setAppViewMode('PUBLIC_LANDING');
                    setTimeout(() => {
                      document.getElementById('recherches-populaires')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="w-full py-2.5 px-4 rounded-full bg-slate-100 hover:bg-[#FBF6EE] text-[#14110F] hover:text-[#FF6A2B] font-display font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-1.5"
                >
                  <span>Explorer le Menu des Stands</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* 4. CONTENU : ONGLET 2 - MES BILLETS & PASS */}
      {activeClientTab === 'TICKETS' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-display font-black text-[#14110F] tracking-tight">
                Mes Billets & Titres d'Accès Officiels
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Vos e-tickets numériques sécurisés avec token dynamique. Valables aux barrières d'accès RFID.
              </p>
            </div>
            
            <button
              onClick={() => {
                setAppViewMode('PUBLIC_LANDING');
                setTimeout(() => {
                  document.getElementById('billetterie')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="px-4 py-2.5 rounded-full bg-[#FF6A2B] hover:bg-[#e0561d] text-[#14110F] font-display font-bold text-xs uppercase tracking-wider transition flex items-center gap-1.5 shadow-sm active:scale-95 self-start sm:self-auto"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#14110F]" />
              <span>Acheter un autre Billet</span>
            </button>
          </div>

          {purchasedTickets.length === 0 ? (
            <div className="p-12 text-center rounded-[32px] bg-white border border-slate-200">
              <Ticket className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-display font-black text-[#14110F]">Aucun pass actif pour le moment</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto mb-6">
                Réservez votre pass 1 jour ou 6 jours pour accéder aux 23 stands et aux concerts exclusifs du Congo Food Week 6.
              </p>
              <button
                onClick={() => {
                  setAppViewMode('PUBLIC_LANDING');
                  setTimeout(() => {
                    document.getElementById('billetterie')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="px-6 py-3 rounded-full bg-[#FF6A2B] hover:bg-[#e0561d] text-[#14110F] font-display font-black text-xs uppercase tracking-wider"
              >
                Accéder à la Billetterie Officielle
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {purchasedTickets.map((t) => (
                <div 
                  key={t.ticketId}
                  className="rounded-[32px] bg-white border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-6 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6A2B]/5 rounded-full blur-xl pointer-events-none" />

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 rounded-full bg-[#FF6A2B]/10 border border-[#FF6A2B]/20 text-[#FF6A2B] text-[10px] font-black uppercase tracking-wider">
                        {t.status === 'VALID' ? 'Billet Valide' : 'Scanné à la Porte'}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-400">
                        {t.ticketId}
                      </span>
                    </div>

                    <h3 className="text-xl font-display font-black text-[#14110F] mb-1">
                      {t.ticketName}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Titulaire : <strong className="text-slate-800">{t.buyerName}</strong> ({t.buyerPhone})
                    </p>
                    <div className="mt-3 flex items-center gap-2 text-xs text-[#FF6A2B] font-black font-mono">
                      <span>Tarif payé : {formatUSD(t.pricePaidUSD)}</span>
                      <span>•</span>
                      <span>≈ {formatCDF(t.pricePaidUSD)}</span>
                    </div>
                  </div>

                  {/* QR Preview & Action */}
                  <div className="p-4 rounded-2xl bg-[#FAFAFC] border border-slate-200 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white rounded-xl border border-slate-200 flex items-center justify-center p-1 shadow-sm">
                        <QrCode className="w-8 h-8 text-[#FF6A2B]" />
                      </div>
                      <div className="text-xs">
                        <div className="font-bold text-[#14110F]">Token d'accès actif</div>
                        <div className="text-slate-400 font-mono text-[10px]">
                          Anti-Capture rotation 30s
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveClientTab('OVERVIEW')}
                      className="px-3 py-1.5 rounded-full bg-white border border-slate-300 text-slate-700 hover:text-[#FF6A2B] text-xs font-bold transition flex items-center gap-1"
                    >
                      <span>Agrandir</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. CONTENU : ONGLET 3 - PORTEFEUILLE CASHLESS & RECHARGES / REMBOURSEMENTS */}
      {activeClientTab === 'WALLET' && (
        <div className="space-y-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Grande Carte de Solde + Recharges (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Solde Card */}
              <div className="p-6 sm:p-8 rounded-[32px] bg-gradient-to-br from-[#14110F] via-[#1c1815] to-[#2b1e17] text-white shadow-xl relative overflow-hidden border border-[#FF6A2B]/20">
                <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-[#FF6A2B]/15 rounded-full blur-2xl pointer-events-none" />
                
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-display font-black uppercase tracking-wider text-[#FF6A2B] flex items-center gap-1.5">
                      <Wallet className="w-4 h-4" />
                      VUKA Cashless Wallet
                    </span>
                    <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-white/10 text-slate-300 backdrop-blur-sm">
                      {wallet.rfidTagId || 'NFC MIFARE Prêt'}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-slate-400 font-medium block mb-1">
                      Solde Disponible (USD / CDF)
                    </span>
                    <div className="text-4xl sm:text-5xl font-display font-black font-mono tracking-tight text-white">
                      {formatUSD(wallet.balanceUSD)}
                    </div>
                    <div className="text-sm font-bold text-[#FFC21A] font-mono mt-1">
                      ≈ {formatCDF(wallet.balanceUSD)}
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-4 text-xs text-slate-400">
                    <span>Titulaire : {wallet.festivalierName}</span>
                    <span>•</span>
                    <span>Zéro Frais de Paiement</span>
                  </div>
                </div>
              </div>

              {/* Formulaire de Recharge M-Pesa */}
              <div className="p-6 sm:p-8 rounded-[32px] bg-white border border-slate-200 shadow-sm space-y-6">
                <div>
                  <h3 className="text-lg font-display font-black text-[#14110F]">
                    Recharger mon Portefeuille
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Créditez votre compte instantanément par Vodacom M-Pesa, Orange Money ou Airtel Money.
                  </p>
                </div>

                {topUpSuccess && (
                  <div className="p-4 rounded-2xl bg-[#167A42]/10 border border-[#167A42]/20 text-xs text-[#167A42] font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#167A42]" />
                    <span>Recharge confirmée ! Votre solde a été mis à jour avec succès.</span>
                  </div>
                )}

                {/* Quick packs */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Montants Rapides (USD)
                  </label>
                  <div className="grid grid-cols-4 gap-2.5">
                    {[5, 10, 20, 50].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => { setSelectedAmount(amt); setCustomTopUp(''); }}
                        className={`py-3 rounded-2xl text-xs font-display font-black transition-all ${
                          selectedAmount === amt && !customTopUp
                            ? 'bg-[#FF6A2B] text-[#14110F] shadow-md shadow-[#FF6A2B]/20'
                            : 'bg-slate-100 hover:bg-[#FBF6EE] text-[#14110F]'
                        }`}
                      >
                        {formatUSD(amt)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom input */}
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                    Ou saisir un autre montant (USD)
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="Ex: 15"
                    value={customTopUp}
                    onChange={(e) => setCustomTopUp(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-[#FAFAFC] border border-slate-200 text-xs font-mono font-bold text-slate-900 outline-none focus:border-[#FF6A2B]"
                  />
                </div>

                <button
                  onClick={() => handleTopUp(customTopUp ? parseFloat(customTopUp) : selectedAmount)}
                  disabled={isTopUpLoading}
                  className="w-full py-3.5 px-6 rounded-full bg-[#FF6A2B] hover:bg-[#e0561d] text-[#14110F] font-display font-black text-xs uppercase tracking-wider shadow-lg shadow-[#FF6A2B]/20 flex items-center justify-center gap-2 transition active:scale-95 disabled:opacity-50"
                >
                  {isTopUpLoading ? (
                    <span>Confirmation M-Pesa en cours...</span>
                  ) : (
                    <>
                      <Smartphone className="w-4 h-4 text-[#14110F]" />
                      <span>Recharger {formatUSD(customTopUp ? parseFloat(customTopUp) || 0 : selectedAmount)} via M-Pesa</span>
                    </>
                  )}
                </button>
              </div>

            </div>

            {/* Right Column: Liaison Bracelet RFID & Demande de Remboursement (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Liaison Bracelet RFID */}
              <div className="p-6 rounded-[28px] bg-white border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#FF6A2B]/10 text-[#FF6A2B] flex items-center justify-center shrink-0">
                    <Radio className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-display font-black text-[#14110F]">Lier un Bracelet RFID</h4>
                    <span className="text-[10px] text-slate-400">Puce MIFARE DESFire sans contact</span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">
                  Entrez le numéro à 8 chiffres gravé au dos de votre bracelet festivalier remis à l'accueil pour synchroniser vos consommations physiques.
                </p>

                {rfidSuccessMsg && (
                  <div className="p-3 rounded-2xl bg-[#167A42]/10 text-xs text-[#167A42] font-bold">
                    Bracelet lié avec succès !
                  </div>
                )}

                <form onSubmit={handleSaveRFID} className="space-y-3">
                  <input
                    type="text"
                    required
                    placeholder="Ex: MIFARE-8842-CFW6"
                    value={rfidInput}
                    onChange={(e) => setRfidInput(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-[#FAFAFC] border border-slate-200 text-xs font-mono font-bold text-slate-900 outline-none focus:border-[#FF6A2B]"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-full bg-[#14110F] hover:bg-black text-white font-display font-bold text-xs uppercase tracking-wider transition"
                  >
                    Enregistrer le Bracelet
                  </button>
                </form>
              </div>

              {/* Remboursement du solde restant (Cashless Refund CDC) */}
              <div className="p-6 rounded-[28px] bg-white border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#FFC21A]/10 text-[#FFC21A] flex items-center justify-center shrink-0">
                    <RefreshCw className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-display font-black text-[#14110F]">Remboursement de Solde</h4>
                    <span className="text-[10px] text-slate-400">Restitution sans frais post-festival</span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">
                  Vous n'avez pas tout dépensé sur les 23 stands ? Récupérez l'intégralité de vos fonds restants directement sur votre compte Vodacom M-Pesa.
                </p>

                {refundSuccessMsg && (
                  <div className="p-3 rounded-2xl bg-[#167A42]/10 text-xs text-[#167A42] font-bold">
                    {refundSuccessMsg}
                  </div>
                )}

                <form onSubmit={handleRefund} className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Numéro Mobile Money récepteur
                    </label>
                    <input
                      type="tel"
                      required
                      value={refundPhone}
                      onChange={(e) => setRefundPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl bg-[#FAFAFC] border border-slate-200 text-xs font-mono font-bold text-slate-900 outline-none focus:border-[#FF6A2B]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isRefunding || wallet.balanceUSD <= 0}
                    className="w-full py-2.5 rounded-full bg-[#FFC21A] hover:bg-[#e6ae17] text-[#14110F] font-display font-black text-xs uppercase tracking-wider transition disabled:opacity-50"
                  >
                    {isRefunding ? 'Virement M-Pesa...' : `Demander le Remboursement (${formatUSD(wallet.balanceUSD)})`}
                  </button>
                </form>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* 6. CONTENU : ONGLET 4 - HISTORIQUE DES COMMANDES & REÇUS FISCAUX */}
      {activeClientTab === 'HISTORY' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-display font-black text-[#14110F] tracking-tight">
              Historique de vos Consommations & Reçus
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Traçabilité complète de chaque transaction avec transparence sur les 10% reversés à la Fondation Congolicious.
            </p>
          </div>

          <div className="bg-white rounded-[32px] border border-slate-200 p-6 shadow-sm overflow-hidden">
            {transactions.length === 0 ? (
              <p className="text-center text-xs text-slate-500 py-8">Aucune transaction enregistrée.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {transactions.map((tx) => (
                  <div key={tx.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                        tx.type === 'TOPUP' 
                          ? 'bg-[#167A42]/10 text-[#167A42]' 
                          : tx.type === 'REFUND' 
                          ? 'bg-[#FFC21A]/10 text-[#14110F]' 
                          : 'bg-[#FBF6EE] text-[#14110F]'
                      }`}>
                        {tx.type === 'TOPUP' ? <PlusCircle className="w-5 h-5" /> : <Receipt className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-display font-black text-[#14110F]">
                            {tx.standName || (tx.type === 'TOPUP' ? 'Recharge Portefeuille M-Pesa' : 'Remboursement M-Pesa')}
                          </h4>
                          <span className="text-[10px] font-mono text-slate-400">{tx.id}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {tx.notes || (tx.items ? `${tx.items.length} article(s) commandé(s)` : 'Transaction VUKA')}
                        </p>
                        {tx.commissionAmountUSD > 0 && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-[#FF6A2B] font-bold mt-1">
                            <Heart className="w-3 h-3 text-[#FF6A2B]" />
                            Dont {formatUSD(tx.commissionAmountUSD)} reversés aux cantines scolaires (10%)
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right self-end sm:self-auto">
                      <div className={`text-sm font-black font-mono ${
                        tx.type === 'TOPUP' ? 'text-[#167A42]' : 'text-[#14110F]'
                      }`}>
                        {tx.type === 'TOPUP' ? `+ ${formatUSD(tx.amountUSD)}` : `- ${formatUSD(tx.amountUSD)}`}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {new Date(tx.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 7. CONTENU : ONGLET 5 - PROFIL & SÉCURITÉ */}
      {activeClientTab === 'PROFILE' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="p-6 sm:p-8 rounded-[32px] bg-white border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-xl font-display font-black text-[#14110F]">
              Paramètres du Compte Festivalier
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Nom Complet
                </label>
                <div className="p-3 rounded-2xl bg-[#FAFAFC] border border-slate-200 text-xs font-bold text-slate-900">
                  {currentUser?.name || 'Festivalier VUKA'}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Numéro Mobile Money Principal
                </label>
                <div className="p-3 rounded-2xl bg-[#FAFAFC] border border-slate-200 text-xs font-mono font-bold text-slate-900">
                  {currentUser?.phone || wallet.phone}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Adresse Email
                </label>
                <div className="p-3 rounded-2xl bg-[#FAFAFC] border border-slate-200 text-xs font-medium text-slate-900">
                  {currentUser?.email || 'festivalier@vuka.cd'}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-xs font-display font-black text-[#14110F]">Session Active</div>
                  <p className="text-[11px] text-slate-400">Connecté sur cet appareil</p>
                </div>
                <button
                  onClick={logoutUser}
                  className="px-4 py-2 rounded-full bg-red-50 hover:bg-red-100 text-red-700 font-display font-bold text-xs uppercase tracking-wider transition flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Se Déconnecter</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
