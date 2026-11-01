import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatUSD, formatCDF } from '../../utils/formatters';
import { 
  Ticket, 
  Wallet, 
  Receipt, 
  User, 
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
  LogOut, 
  LayoutDashboard, 
  Search, 
  XCircle,
  Sparkles,
  Building2,
  Calendar,
  MapPin,
  CreditCard,
  Mail,
  FileText,
  Check,
  Printer,
  X,
  ArrowUpRight,
  Lock,
  Radio,
  Share2
} from 'lucide-react';
import { DynamicQRCode } from '../wallet/DynamicQRCode';
import { TicketPassView } from '../ticketing/TicketPassView';
import { PurchasedTicket, CashlessTransaction, ClientPortalTab } from '../../types';

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
    publishedEvents,
    standApplications,
    transactions,
    setAppViewMode,
    openPublishModal,
    openUserDashboard,
    verifyTicketByCode
  } = useApp();

  // Billet sélectionné pour affichage modal haute résolution
  const [selectedTicketForPass, setSelectedTicketForPass] = useState<PurchasedTicket | null>(null);

  // Vérification de billet dans le dashboard
  const [verifyInputCode, setVerifyInputCode] = useState('');
  const [verifyResult, setVerifyResult] = useState<{
    searched: boolean;
    status: 'VALID' | 'ALREADY_USED' | 'NOT_FOUND';
    ticket?: any;
    details?: string;
  }>({ searched: false, status: 'NOT_FOUND' });

  const handleVerifyTicket = (codeOverride?: string) => {
    const code = codeOverride || verifyInputCode;
    if (!code.trim()) return;
    const res = verifyTicketByCode(code.trim());
    setVerifyResult({
      searched: true,
      status: res.status,
      ticket: res.ticket,
      details: res.details
    });
  };

  // Recharges M-Pesa
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

  // Filtre d'historique des transactions
  const [txFilter, setTxFilter] = useState<'ALL' | 'PAYMENT' | 'TOPUP' | 'REFUND'>('ALL');

  // Filtrer les événements organisés par l'utilisateur (ou créés dans la session)
  const userOrganizedEvents = publishedEvents.filter(
    (e) => (currentUser && e.organizerName === currentUser.name) || e.id.startsWith('evt-')
  );

  // Filtrer les candidatures stands de l'utilisateur
  const userStandApplications = standApplications.filter(
    (a) => currentUser && (a.applicantPhone === currentUser.phone || a.applicantEmail === currentUser.email)
  );

  // Calculs financiers globaux
  const totalTopUpUSD = transactions
    .filter((t) => t.type === 'TOPUP')
    .reduce((sum, t) => sum + t.amountUSD, 0);

  const totalSpentUSD = transactions
    .filter((t) => t.type === 'PAYMENT')
    .reduce((sum, t) => sum + t.amountUSD, 0);

  const totalDonationUSD = transactions
    .reduce((sum, t) => sum + (t.commissionAmountUSD || 0), 0);

  // Filtrage des transactions pour l'onglet historique
  const filteredTransactions = transactions.filter((t) => {
    if (txFilter === 'ALL') return true;
    return t.type === txFilter;
  });

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

  // Liste ordonnée des onglets de navigation
  const tabsConfig: { id: ClientPortalTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }[] = [
    { id: 'OVERVIEW', label: "Vue d'ensemble", icon: LayoutDashboard },
    { id: 'WALLET', label: 'Portefeuille Cashless', icon: Wallet },
    { id: 'TICKETS', label: 'Mes Billets', icon: Ticket, badge: purchasedTickets.length },
    { id: 'HISTORY', label: 'Historique des Reçus', icon: Receipt },
    { id: 'VERIFY', label: 'Vérifier un Billet', icon: ShieldCheck },
    { id: 'PROFILE', label: 'Mon Profil', icon: User }
  ];

  return (
    <div className="min-h-screen bg-[#FBF6EE] py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* BANDEAU SUPÉRIEUR : RETOUR & INDICATEUR RÉSEAU */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border-b border-[#E5E0D8] pb-4">
          <button
            type="button"
            onClick={() => setAppViewMode('PUBLIC_LANDING')}
            className="inline-flex items-center gap-2 text-[#7A7068] hover:text-[#14110F] font-heading font-bold transition group"
          >
            <ChevronRight className="w-4 h-4 rotate-180 text-[#FF6A2B] group-hover:-translate-x-0.5 transition-transform" />
            <span>Retour au catalogue des événements</span>
          </button>
          
          <div className="flex items-center gap-3 text-[#7A7068] font-mono">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-[#E5E0D8] text-[11px] font-bold text-[#14110F]">
              <span className="w-2 h-2 rounded-full bg-[#167A42] animate-pulse" />
              <span>Réseau VUKA Pay • En ligne</span>
            </span>
            <span className="hidden md:inline text-[11px]">Kinshasa (UTC+1)</span>
          </div>
        </div>

        {/* 1. MASTER IDENTITY & FINANCIAL BAR */}
        <div className="bg-white rounded-[28px] border border-[#E5E0D8] p-6 sm:p-8 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Identité utilisateur */}
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="w-16 h-16 rounded-2xl bg-[#14110F] text-[#FFC21A] flex items-center justify-center font-heading font-black text-2xl shadow-sm shrink-0 border border-[#14110F]">
              {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : wallet.festivalierName.charAt(0).toUpperCase()}
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-heading font-black text-[#14110F] tracking-tight">
                  {currentUser?.name || wallet.festivalierName || 'Festivalier VUKA'}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E2F3E9] text-[#167A42] border border-[#167A42]/20 text-[11px] font-bold uppercase tracking-wider">
                  <CheckCircle2 className="w-3 h-3 text-[#167A42]" />
                  <span>Compte Vérifié</span>
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#7A7068]">
                <span className="inline-flex items-center gap-1.5 font-mono">
                  <Smartphone className="w-3.5 h-3.5 text-[#FF6A2B]" />
                  <span>{currentUser?.phone || wallet.phone}</span>
                </span>
                <span className="hidden sm:inline text-[#D9D0C6]">•</span>
                <span className="inline-flex items-center gap-1.5 font-mono">
                  <Mail className="w-3.5 h-3.5 text-[#7A7068]" />
                  <span>{currentUser?.email || 'mbote@mokili.io'}</span>
                </span>
                <span className="hidden sm:inline text-[#D9D0C6]">•</span>
                <span className="font-mono text-[#7A7068]">ID: {currentUser?.id || wallet.id}</span>
              </div>
            </div>
          </div>

          {/* Module Fintech Dual-Currency Solde */}
          <div className="flex items-center justify-between sm:justify-start gap-5 p-4 sm:p-5 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] self-stretch lg:self-auto shrink-0">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A7068] block">
                Solde Cashless Disponible
              </span>
              <div className="text-2xl sm:text-3xl font-heading font-black text-[#14110F] font-mono tabular-nums tracking-tight mt-0.5">
                {formatUSD(wallet.balanceUSD)}
              </div>
              <div className="text-xs font-bold text-[#FF6A2B] font-mono tabular-nums mt-0.5">
                ≈ {formatCDF(wallet.balanceUSD)}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveClientTab('WALLET')}
              className="h-10 px-4 rounded-full bg-[#FF6A2B] hover:bg-[#e0561d] text-[#14110F] font-heading font-bold text-xs uppercase tracking-wider shadow-xs transition active:scale-95 flex items-center gap-1.5 shrink-0"
            >
              <PlusCircle className="w-4 h-4 text-[#14110F]" />
              <span>Recharger</span>
            </button>
          </div>
        </div>

        {/* 2. NAVIGATION SEGMENTÉE DU DASHBOARD */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {tabsConfig.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeClientTab === tab.id || (tab.id === 'OVERVIEW' && activeClientTab === 'DASHBOARD');
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveClientTab(tab.id)}
                className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-xs font-heading font-bold transition shrink-0 ${
                  isActive
                    ? 'bg-[#FF6A2B] text-[#14110F] shadow-xs'
                    : 'bg-white text-[#7A7068] hover:text-[#14110F] border border-[#E5E0D8] hover:bg-[#FAF8F5]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#14110F]' : 'text-[#7A7068]'}`} />
                <span>{tab.label}</span>
                {typeof tab.badge === 'number' && tab.badge > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                    isActive ? 'bg-[#14110F] text-[#FFC21A]' : 'bg-[#FAF8F5] text-[#14110F] border border-[#E5E0D8]'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* 3. ONGLET 1 : VUE D'ENSEMBLE (DASHBOARD) */}
        {(activeClientTab === 'OVERVIEW' || activeClientTab === 'DASHBOARD') && (
          <div className="space-y-8 animate-in fade-in duration-200">
            
            {/* KPI Cards Row (4 colonnes) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* KPI 1 : Solde Cashless */}
              <div 
                onClick={() => setActiveClientTab('WALLET')}
                className="p-5 rounded-2xl bg-white border border-[#E5E0D8] shadow-xs cursor-pointer hover:border-[#FF6A2B]/40 transition group"
              >
                <div className="flex items-center justify-between text-xs text-[#7A7068] mb-2">
                  <span className="font-bold uppercase tracking-wider text-[10px]">Solde Disponible</span>
                  <Wallet className="w-4 h-4 text-[#FF6A2B] group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-2xl font-heading font-black text-[#14110F] font-mono tabular-nums">
                  {formatUSD(wallet.balanceUSD)}
                </div>
                <div className="text-[11px] font-bold text-[#FF6A2B] font-mono tabular-nums mt-1 flex items-center justify-between">
                  <span>≈ {formatCDF(wallet.balanceUSD)}</span>
                  <span className="text-[#14110F] text-[10px] font-heading underline">Recharger</span>
                </div>
              </div>

              {/* KPI 2 : Billets Actifs */}
              <div 
                onClick={() => setActiveClientTab('TICKETS')}
                className="p-5 rounded-2xl bg-white border border-[#E5E0D8] shadow-xs cursor-pointer hover:border-[#14110F]/30 transition group"
              >
                <div className="flex items-center justify-between text-xs text-[#7A7068] mb-2">
                  <span className="font-bold uppercase tracking-wider text-[10px]">Titres & Pass</span>
                  <Ticket className="w-4 h-4 text-[#14110F] group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-2xl font-heading font-black text-[#14110F] font-mono tabular-nums">
                  {purchasedTickets.length}
                </div>
                <div className="text-[11px] text-[#7A7068] mt-1 flex items-center justify-between">
                  <span>{purchasedTickets.length > 0 ? 'Billet(s) prêt(s)' : 'Aucun pass actif'}</span>
                  <span className="text-[#14110F] text-[10px] font-heading underline font-bold">Consulter</span>
                </div>
              </div>

              {/* KPI 3 : Activités Organisées */}
              <div 
                onClick={() => openPublishModal()}
                className="p-5 rounded-2xl bg-white border border-[#E5E0D8] shadow-xs cursor-pointer hover:border-[#FF6A2B]/40 transition group"
              >
                <div className="flex items-center justify-between text-xs text-[#7A7068] mb-2">
                  <span className="font-bold uppercase tracking-wider text-[10px]">Mes Publications</span>
                  <Sparkles className="w-4 h-4 text-[#FF6A2B] group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-2xl font-heading font-black text-[#14110F] font-mono tabular-nums">
                  {userOrganizedEvents.length}
                </div>
                <div className="text-[11px] text-[#7A7068] mt-1 flex items-center justify-between">
                  <span>{userOrganizedEvents.length > 0 ? 'Événement(s) en ligne' : 'Créer une billetterie'}</span>
                  <span className="text-[#FF6A2B] text-[10px] font-heading font-bold">+ Publier</span>
                </div>
              </div>

              {/* KPI 4 : Espace Standier */}
              <div 
                onClick={() => openUserDashboard('STANDIER')}
                className="p-5 rounded-2xl bg-white border border-[#E5E0D8] shadow-xs cursor-pointer hover:border-[#0E5A8A]/40 transition group"
              >
                <div className="flex items-center justify-between text-xs text-[#7A7068] mb-2">
                  <span className="font-bold uppercase tracking-wider text-[10px]">Stands & Exposants</span>
                  <Store className="w-4 h-4 text-[#0E5A8A] group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-2xl font-heading font-black text-[#14110F] font-mono tabular-nums">
                  {userStandApplications.length}
                </div>
                <div className="text-[11px] text-[#7A7068] mt-1 flex items-center justify-between">
                  <span>{userStandApplications.length > 0 ? 'Candidature(s) active(s)' : 'Postuler un stand'}</span>
                  <span className="text-[#0E5A8A] text-[10px] font-heading font-bold">Espace</span>
                </div>
              </div>

            </div>

            {/* Quick Action Bento : Organisateur & Standier */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="p-6 rounded-[24px] bg-white border border-[#E5E0D8] shadow-xs flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFE3D3] border border-[#FF6A2B]/20 text-[#14110F] text-[10px] font-bold uppercase tracking-wider font-mono">
                    <Sparkles className="w-3 h-3 text-[#FF6A2B]" />
                    <span>Espace Organisateur</span>
                  </div>
                  <h3 className="text-lg font-heading font-black text-[#14110F]">
                    Publier une Activité sur VUKA Pay
                  </h3>
                  <p className="text-xs text-[#7A7068] leading-relaxed">
                    Créez votre billetterie numérique pour un festival, concert, conférence, collecte solidaire ou session e-vote. Encaissement M-Pesa direct et jauges sécurisées.
                  </p>
                </div>
                
                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => openPublishModal()}
                    className="h-10 px-5 rounded-full bg-[#14110F] hover:bg-[#2A2420] text-white font-heading font-bold text-xs uppercase tracking-wider transition active:scale-95 flex items-center gap-2"
                  >
                    <span>+ Créer une Activité</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#FF6A2B]" />
                  </button>
                  <span className="text-xs text-[#7A7068] font-mono">Validation sous 1h</span>
                </div>
              </div>

              <div className="p-6 rounded-[24px] bg-white border border-[#E5E0D8] shadow-xs flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E5F0F7] border border-[#0E5A8A]/20 text-[#14110F] text-[10px] font-bold uppercase tracking-wider font-mono">
                    <Store className="w-3 h-3 text-[#0E5A8A]" />
                    <span>Espace Exposant & Standier</span>
                  </div>
                  <h3 className="text-lg font-heading font-black text-[#14110F]">
                    Candidature & Terminal de Caisse POS
                  </h3>
                  <p className="text-xs text-[#7A7068] leading-relaxed">
                    Installez votre stand gastronomique ou artisanal dans un événement de la plateforme. Gérez vos encaissements cashless sans espèces sur terminal Sunmi V2S.
                  </p>
                </div>
                
                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => openUserDashboard('STANDIER')}
                    className="h-10 px-5 rounded-full bg-[#F3ECE2] hover:bg-[#D9D0C6] text-[#14110F] font-heading font-bold text-xs uppercase tracking-wider transition active:scale-95 flex items-center gap-2"
                  >
                    <span>Espace Standier</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#14110F]" />
                  </button>
                  <span className="text-xs text-[#7A7068] font-mono">23 Stands partenaires</span>
                </div>
              </div>

            </div>

            {/* Billet Prioritaire & Accès Rapide QR */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Colonne Gauche : Billet Actif (7 colonnes) */}
              <div className="lg:col-span-7 bg-white rounded-[28px] border border-[#E5E0D8] p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-heading font-black text-[#14110F]">
                      Titre d'Accès Principal
                    </h3>
                    <p className="text-xs text-[#7A7068]">
                      Votre pass actif pour les contrôles d'accès et bornes d'entrée
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#FAF8F5] border border-[#E5E0D8] text-[11px] font-mono text-[#14110F]">
                    {purchasedTickets.length} billet(s) actif(s)
                  </span>
                </div>

                {purchasedTickets.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] space-y-3">
                    <Ticket className="w-10 h-10 text-[#7A7068] mx-auto opacity-50" />
                    <h4 className="text-sm font-heading font-black text-[#14110F]">Aucun billet acheté</h4>
                    <p className="text-xs text-[#7A7068] max-w-sm mx-auto">
                      Explorez le catalogue des festivals, concerts et conférences pour réserver votre place officielle.
                    </p>
                    <button
                      type="button"
                      onClick={() => setAppViewMode('PUBLIC_LANDING')}
                      className="inline-flex items-center gap-2 h-9 px-4 rounded-full bg-[#FF6A2B] hover:bg-[#e0561d] text-[#14110F] font-heading font-bold text-xs uppercase tracking-wider shadow-xs transition active:scale-95"
                    >
                      <span>Acheter un Pass</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#E2F3E9] text-[#167A42] border border-[#167A42]/20 text-[10px] font-bold uppercase tracking-wider">
                          {purchasedTickets[0].status === 'VALID' ? 'Billet Valide / Non Scanné' : 'Scanné'}
                        </span>
                        <h4 className="text-base sm:text-lg font-heading font-black text-[#14110F] mt-1.5">
                          {purchasedTickets[0].ticketName}
                        </h4>
                        <div className="text-xs text-[#7A7068] mt-0.5">
                          Titulaire : <strong className="text-[#14110F]">{purchasedTickets[0].buyerName}</strong>
                        </div>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-[10px] font-mono uppercase text-[#7A7068] block">Réf. Billet</span>
                        <span className="text-xs font-mono font-bold text-[#14110F]">
                          {purchasedTickets[0].ticketId}
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#E5E0D8] flex flex-wrap items-center justify-between gap-3">
                      <div className="text-xs font-mono text-[#FF6A2B] font-bold">
                        Tarif : {formatUSD(purchasedTickets[0].pricePaidUSD)} (≈ {formatCDF(purchasedTickets[0].pricePaidUSD)})
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedTicketForPass(purchasedTickets[0])}
                          className="h-8 px-3.5 rounded-full bg-white hover:bg-[#F3ECE2] border border-[#E5E0D8] text-[#14110F] text-xs font-bold transition flex items-center gap-1.5"
                        >
                          <QrCode className="w-3.5 h-3.5 text-[#FF6A2B]" />
                          <span>Voir le Pass & Partager</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setVerifyInputCode(purchasedTickets[0].ticketId);
                            setActiveClientTab('VERIFY');
                            handleVerifyTicket(purchasedTickets[0].ticketId);
                          }}
                          className="h-8 px-3 rounded-full bg-[#14110F] hover:bg-[#2A2420] text-white text-xs font-bold transition flex items-center gap-1"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-[#FFC21A]" />
                          <span>Contrôler</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Si l'utilisateur a plusieurs billets */}
                {purchasedTickets.length > 1 && (
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-[#7A7068]">
                      Vous possédez {purchasedTickets.length} billets au total.
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveClientTab('TICKETS')}
                      className="text-xs font-bold text-[#FF6A2B] hover:underline flex items-center gap-1"
                    >
                      <span>Tous mes billets</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Colonne Droite : QR Dynamique Contactless (5 colonnes) */}
              <div className="lg:col-span-5 bg-white rounded-[28px] border border-[#E5E0D8] p-6 sm:p-8 shadow-xs space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-heading font-black text-[#14110F]">
                      Paiement & Accès Sans Contact
                    </h3>
                    <p className="text-xs text-[#7A7068]">
                      Présentez ce code aux caisses stands ou tourniquets
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#E5F0F7] text-[#0E5A8A] border border-[#0E5A8A]/20 text-[10px] font-mono font-bold">
                    30s
                  </span>
                </div>

                <div className="flex justify-center py-1">
                  <DynamicQRCode />
                </div>

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => setActiveClientTab('WALLET')}
                    className="w-full py-2.5 rounded-full bg-[#FAF8F5] hover:bg-[#F3ECE2] border border-[#E5E0D8] text-xs font-heading font-bold text-[#14110F] transition"
                  >
                    Gérer mon solde & Lier mon bracelet RFID
                  </button>
                </div>
              </div>

            </div>

            {/* Dernières transactions */}
            <div className="bg-white rounded-[28px] border border-[#E5E0D8] p-6 sm:p-8 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-heading font-black text-[#14110F]">
                    Dernières Opérations
                  </h3>
                  <p className="text-xs text-[#7A7068]">
                    Traçabilité de vos paiements, recharges et solidarité 10%
                  </p>
                </div>
                
                <button
                  type="button"
                  onClick={() => setActiveClientTab('HISTORY')}
                  className="text-xs font-bold text-[#FF6A2B] hover:underline flex items-center gap-1 font-heading"
                >
                  <span>Voir l'historique complet</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {transactions.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#7A7068]">
                  Aucune transaction enregistrée pour l'instant.
                </div>
              ) : (
                <div className="divide-y divide-[#E5E0D8]">
                  {transactions.slice(0, 3).map((tx) => (
                    <div key={tx.id} className="py-3.5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          tx.type === 'TOPUP' 
                            ? 'bg-[#E2F3E9] text-[#167A42]' 
                            : tx.type === 'REFUND' 
                            ? 'bg-[#FFE3D3] text-[#FF6A2B]' 
                            : 'bg-[#FAF8F5] text-[#14110F]'
                        }`}>
                          {tx.type === 'TOPUP' ? <PlusCircle className="w-4 h-4" /> : <Receipt className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="text-xs font-heading font-bold text-[#14110F]">
                            {tx.standName || (tx.type === 'TOPUP' ? 'Recharge Portefeuille M-Pesa' : 'Remboursement M-Pesa')}
                          </div>
                          <div className="text-[10px] text-[#7A7068] font-mono mt-0.5">
                            {new Date(tx.timestamp).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })} • Réf: {tx.id}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className={`text-xs font-mono font-bold tabular-nums ${
                          tx.type === 'TOPUP' ? 'text-[#167A42]' : 'text-[#14110F]'
                        }`}>
                          {tx.type === 'TOPUP' ? `+ ${formatUSD(tx.amountUSD)}` : `- ${formatUSD(tx.amountUSD)}`}
                        </div>
                        {tx.commissionAmountUSD > 0 && (
                          <div className="text-[10px] font-bold text-[#FF6A2B] font-mono">
                            Dont {formatUSD(tx.commissionAmountUSD)} cantines
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* 4. ONGLET 2 : PORTEFEUILLE CASHLESS & RECHARGES */}
        {activeClientTab === 'WALLET' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Colonne Gauche : Grande Master Card & Recharges M-Pesa (7 colonnes) */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Master Card Fintech VUKA */}
                <div className="p-6 sm:p-8 rounded-[28px] bg-[#14110F] text-[#FBF6EE] border border-[#2A2420] shadow-xl relative overflow-hidden space-y-6">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF6A2B]/10 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-2">
                      <Wallet className="w-5 h-5 text-[#FF6A2B]" />
                      <span className="text-xs font-heading font-black tracking-wider uppercase text-[#FBF6EE]">
                        VUKA Pay Cashless
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-[#FFC21A] text-[10px] font-mono font-bold">
                      {wallet.rfidTagId || 'NFC MIFARE DESFire'}
                    </span>
                  </div>

                  <div className="relative z-10 space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#A69C94] block">
                      Solde Disponible (USD / CDF)
                    </span>
                    <div className="text-4xl sm:text-5xl font-heading font-black text-white font-mono tabular-nums tracking-tight">
                      {formatUSD(wallet.balanceUSD)}
                    </div>
                    <div className="text-sm font-bold text-[#FFC21A] font-mono tabular-nums pt-0.5">
                      ≈ {formatCDF(wallet.balanceUSD)}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-[#A69C94] font-mono relative z-10">
                    <span>Titulaire : {wallet.festivalierName}</span>
                    <span>Sécurisé HMAC-SHA256</span>
                  </div>
                </div>

                {/* Formulaire de Recharge M-Pesa */}
                <div className="p-6 sm:p-8 rounded-[28px] bg-white border border-[#E5E0D8] shadow-xs space-y-6">
                  <div>
                    <h3 className="text-lg font-heading font-black text-[#14110F]">
                      Recharger mon Portefeuille
                    </h3>
                    <p className="text-xs text-[#7A7068] mt-0.5">
                      Créditez votre solde instantanément par Vodacom M-Pesa, Orange Money ou Airtel Money.
                    </p>
                  </div>

                  {topUpSuccess && (
                    <div className="p-4 rounded-2xl bg-[#E2F3E9] border border-[#167A42]/20 text-xs text-[#167A42] font-bold flex items-center gap-2 animate-in fade-in duration-200">
                      <CheckCircle2 className="w-4 h-4 text-[#167A42] shrink-0" />
                      <span>Recharge validée avec succès ! Votre solde a été mis à jour immédiatement.</span>
                    </div>
                  )}

                  {/* Packs prédéfinis */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#14110F] uppercase tracking-wider block font-heading">
                      Montants Rapides (USD)
                    </label>
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5">
                      {[5, 10, 20, 50, 100].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => { setSelectedAmount(amt); setCustomTopUp(''); }}
                          className={`py-3 rounded-2xl text-xs font-heading font-black transition ${
                            selectedAmount === amt && !customTopUp
                              ? 'bg-[#FF6A2B] text-[#14110F] shadow-xs'
                              : 'bg-[#FAF8F5] hover:bg-[#F3ECE2] text-[#14110F] border border-[#E5E0D8]'
                          }`}
                        >
                          {formatUSD(amt)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Saisie personnalisée */}
                  <div>
                    <label className="text-xs font-bold text-[#14110F] uppercase tracking-wider block mb-1.5 font-heading">
                      Ou saisir un montant libre (USD)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        placeholder="Ex: 15"
                        value={customTopUp}
                        onChange={(e) => setCustomTopUp(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] text-xs font-mono font-bold text-[#14110F] focus:outline-none focus:border-[#FF6A2B]"
                      />
                      {customTopUp && parseFloat(customTopUp) > 0 && (
                        <div className="absolute right-4 top-3 text-xs font-mono font-bold text-[#FF6A2B]">
                          ≈ {formatCDF(parseFloat(customTopUp))}
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleTopUp(customTopUp ? parseFloat(customTopUp) : selectedAmount)}
                    disabled={isTopUpLoading}
                    className="w-full py-3.5 px-6 rounded-full bg-[#FF6A2B] hover:bg-[#e0561d] text-[#14110F] font-heading font-black text-xs uppercase tracking-wider shadow-xs transition active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isTopUpLoading ? (
                      <span>Confirmation M-Pesa en cours...</span>
                    ) : (
                      <>
                        <Smartphone className="w-4 h-4 text-[#14110F]" />
                        <span>Recharger {formatUSD(customTopUp ? parseFloat(customTopUp) || 0 : selectedAmount)} par M-Pesa</span>
                      </>
                    )}
                  </button>
                </div>

              </div>

              {/* Colonne Droite : QR dynamique, RFID & Remboursement (5 colonnes) */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Dynamic QR Code Pass */}
                <div className="p-6 rounded-[28px] bg-white border border-[#E5E0D8] shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-heading font-black text-[#14110F]">
                        Token QR Dynamique
                      </h4>
                      <span className="text-[11px] text-[#7A7068]">Anti-capture rotation 30s</span>
                    </div>
                    <Lock className="w-4 h-4 text-[#FF6A2B]" />
                  </div>
                  <div className="flex justify-center">
                    <DynamicQRCode />
                  </div>
                </div>

                {/* Liaison Bracelet RFID */}
                <div className="p-6 rounded-[28px] bg-white border border-[#E5E0D8] shadow-xs space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#FFE3D3] text-[#FF6A2B] flex items-center justify-center shrink-0">
                      <Radio className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-heading font-black text-[#14110F]">Lier un Bracelet RFID</h4>
                      <span className="text-[10px] text-[#7A7068] font-mono">Puce MIFARE DESFire sans contact</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#7A7068] leading-relaxed">
                    Saisissez le code gravé au dos de votre bracelet festivalier remis aux portes pour régler vos consommations d'un simple geste sans smartphone.
                  </p>

                  {rfidSuccessMsg && (
                    <div className="p-3 rounded-2xl bg-[#E2F3E9] text-xs text-[#167A42] font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Bracelet RFID synchronisé avec votre portefeuille !</span>
                    </div>
                  )}

                  <form onSubmit={handleSaveRFID} className="space-y-3">
                    <input
                      type="text"
                      required
                      placeholder="Ex: MIFARE-8842-CFW6"
                      value={rfidInput}
                      onChange={(e) => setRfidInput(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] text-xs font-mono font-bold text-[#14110F] focus:outline-none focus:border-[#FF6A2B]"
                    />
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-full bg-[#14110F] hover:bg-[#2A2420] text-white font-heading font-bold text-xs uppercase tracking-wider transition"
                    >
                      Enregistrer le Bracelet
                    </button>
                  </form>
                </div>

                {/* Remboursement de solde restant */}
                <div className="p-6 rounded-[28px] bg-white border border-[#E5E0D8] shadow-xs space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#FAF8F5] text-[#14110F] border border-[#E5E0D8] flex items-center justify-center shrink-0">
                      <RefreshCw className="w-4 h-4 text-[#FF6A2B]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-heading font-black text-[#14110F]">Remboursement de Solde</h4>
                      <span className="text-[10px] text-[#7A7068] font-mono">Restitution sans frais post-événement</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#7A7068] leading-relaxed">
                    Vos fonds non dépensés sont récupérables directement par virement M-Pesa sur votre numéro de téléphone.
                  </p>

                  {refundSuccessMsg && (
                    <div className="p-3 rounded-2xl bg-[#E2F3E9] text-xs text-[#167A42] font-bold">
                      {refundSuccessMsg}
                    </div>
                  )}

                  <form onSubmit={handleRefund} className="space-y-3">
                    <div>
                      <label className="text-[10px] font-bold text-[#7A7068] uppercase tracking-wider block mb-1">
                        Numéro Mobile Money Récepteur
                      </label>
                      <input
                        type="tel"
                        required
                        value={refundPhone}
                        onChange={(e) => setRefundPhone(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] text-xs font-mono font-bold text-[#14110F] focus:outline-none focus:border-[#FF6A2B]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isRefunding || wallet.balanceUSD <= 0}
                      className="w-full py-2.5 rounded-full bg-[#14110F] hover:bg-[#2A2420] text-white font-heading font-bold text-xs uppercase tracking-wider transition disabled:opacity-40"
                    >
                      {isRefunding ? 'Virement M-Pesa...' : `Demander le Remboursement (${formatUSD(wallet.balanceUSD)})`}
                    </button>
                  </form>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* 5. ONGLET 3 : MES BILLETS & PASS OFFICIELS */}
        {activeClientTab === 'TICKETS' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-heading font-black text-[#14110F]">
                  Vos Billets & Titres d'Accès Officiels
                </h2>
                <p className="text-xs text-[#7A7068] mt-0.5">
                  E-tickets infalsifiables avec jeton cryptographique dynamique pour les contrôles d'accès.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setAppViewMode('PUBLIC_LANDING')}
                className="h-10 px-5 rounded-full bg-[#FF6A2B] hover:bg-[#e0561d] text-[#14110F] font-heading font-bold text-xs uppercase tracking-wider shadow-xs transition active:scale-95 flex items-center gap-1.5 self-start sm:self-auto"
              >
                <PlusCircle className="w-4 h-4 text-[#14110F]" />
                <span>Acheter un autre Billet</span>
              </button>
            </div>

            {purchasedTickets.length === 0 ? (
              <div className="p-12 text-center rounded-[28px] bg-white border border-[#E5E0D8] space-y-4">
                <Ticket className="w-12 h-12 text-[#7A7068] mx-auto opacity-40" />
                <h3 className="text-lg font-heading font-black text-[#14110F]">
                  Aucun billet acheté sur ce compte
                </h3>
                <p className="text-xs text-[#7A7068] max-w-sm mx-auto">
                  Découvrez les activités disponibles sur la plateforme VUKA Pay pour réserver votre pass officiel.
                </p>
                <button
                  type="button"
                  onClick={() => setAppViewMode('PUBLIC_LANDING')}
                  className="px-6 py-3 rounded-full bg-[#14110F] hover:bg-[#2A2420] text-white font-heading font-bold text-xs uppercase tracking-wider"
                >
                  Accéder à la Billetterie
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {purchasedTickets.map((t) => (
                  <div
                    key={t.ticketId}
                    className="p-6 rounded-[28px] bg-white border border-[#E5E0D8] shadow-xs flex flex-col justify-between space-y-6 relative overflow-hidden"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#E2F3E9] text-[#167A42] border border-[#167A42]/20 text-[10px] font-bold uppercase tracking-wider">
                          {t.status === 'VALID' ? 'Billet Valide / Non Scanné' : 'Scanné à la Porte'}
                        </span>
                        <span className="text-xs font-mono font-bold text-[#7A7068]">
                          {t.ticketId}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-xl font-heading font-black text-[#14110F]">
                          {t.ticketName}
                        </h3>
                        <p className="text-xs text-[#7A7068] mt-1">
                          Titulaire : <strong className="text-[#14110F]">{t.buyerName}</strong> ({t.buyerPhone})
                        </p>
                      </div>

                      <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] flex items-center justify-between text-xs font-mono">
                        <span className="text-[#7A7068]">Tarif réglé :</span>
                        <span className="font-bold text-[#14110F]">
                          {formatUSD(t.pricePaidUSD)} (≈ {formatCDF(t.pricePaidUSD)})
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedTicketForPass(t)}
                        className="flex-1 py-2.5 rounded-full bg-[#14110F] hover:bg-[#2A2420] text-white text-xs font-heading font-bold transition flex items-center justify-center gap-1.5"
                      >
                        <QrCode className="w-3.5 h-3.5 text-[#FF6A2B]" />
                        <span>Voir le Pass & Partager</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setVerifyInputCode(t.ticketId);
                          setActiveClientTab('VERIFY');
                          handleVerifyTicket(t.ticketId);
                        }}
                        className="py-2.5 px-4 rounded-full bg-[#FAF8F5] hover:bg-[#F3ECE2] border border-[#E5E0D8] text-xs font-heading font-bold text-[#14110F] transition flex items-center gap-1"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-[#FF6A2B]" />
                        <span>Contrôler</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 6. ONGLET 4 : HISTORIQUE DES REÇUS FISCAUX */}
        {activeClientTab === 'HISTORY' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-heading font-black text-[#14110F]">
                  Historique de vos Consommations & Reçus
                </h2>
                <p className="text-xs text-[#7A7068] mt-0.5">
                  Traçabilité complète avec transparence sur les 10% reversés aux cantines scolaires.
                </p>
              </div>

              {/* Filtre de type */}
              <div className="flex items-center gap-1 bg-white border border-[#E5E0D8] p-1 rounded-full self-start sm:self-auto">
                {[
                  { id: 'ALL', label: 'Toutes' },
                  { id: 'PAYMENT', label: 'Paiements' },
                  { id: 'TOPUP', label: 'Recharges' },
                  { id: 'REFUND', label: 'Remboursements' }
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setTxFilter(f.id as any)}
                    className={`px-3 py-1 rounded-full text-[11px] font-heading font-bold transition ${
                      txFilter === f.id
                        ? 'bg-[#14110F] text-white'
                        : 'text-[#7A7068] hover:text-[#14110F]'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tableau Ledger Fintech */}
            <div className="bg-white rounded-[28px] border border-[#E5E0D8] p-6 sm:p-8 shadow-xs overflow-hidden space-y-6">
              {filteredTransactions.length === 0 ? (
                <div className="text-center py-10 text-xs text-[#7A7068]">
                  Aucune transaction ne correspond à ce filtre.
                </div>
              ) : (
                <div className="divide-y divide-[#E5E0D8]">
                  {filteredTransactions.map((tx) => (
                    <div key={tx.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3.5">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                          tx.type === 'TOPUP' 
                            ? 'bg-[#E2F3E9] text-[#167A42]' 
                            : tx.type === 'REFUND' 
                            ? 'bg-[#FFE3D3] text-[#FF6A2B]' 
                            : 'bg-[#FAF8F5] text-[#14110F] border border-[#E5E0D8]'
                        }`}>
                          {tx.type === 'TOPUP' ? <PlusCircle className="w-5 h-5" /> : <Receipt className="w-5 h-5" />}
                        </div>

                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-xs font-heading font-bold text-[#14110F]">
                              {tx.standName || (tx.type === 'TOPUP' ? 'Recharge Portefeuille M-Pesa' : 'Remboursement M-Pesa')}
                            </h4>
                            <span className="text-[10px] font-mono text-[#7A7068]">
                              Réf: {tx.id}
                            </span>
                          </div>

                          <div className="text-[11px] text-[#7A7068]">
                            {tx.notes || (tx.items ? `${tx.items.length} article(s) commandé(s)` : 'Transaction VUKA Pay')}
                          </div>

                          {tx.commissionAmountUSD > 0 && (
                            <div className="inline-flex items-center gap-1 text-[10px] text-[#FF6A2B] font-bold pt-0.5">
                              <Heart className="w-3 h-3 text-[#FF6A2B]" />
                              <span>Dont {formatUSD(tx.commissionAmountUSD)} reversés aux cantines scolaires (10%)</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-right self-end sm:self-auto shrink-0">
                        <div className={`text-sm font-mono font-bold tabular-nums ${
                          tx.type === 'TOPUP' ? 'text-[#167A42]' : 'text-[#14110F]'
                        }`}>
                          {tx.type === 'TOPUP' ? `+ ${formatUSD(tx.amountUSD)}` : `- ${formatUSD(tx.amountUSD)}`}
                        </div>
                        <div className="text-[10px] text-[#7A7068] font-mono mt-0.5">
                          {new Date(tx.timestamp).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Synthèse globale en bas de tableau */}
              <div className="pt-6 border-t border-[#E5E0D8] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8]">
                  <span className="text-[10px] uppercase text-[#7A7068] block">Total Rechargé</span>
                  <span className="text-base font-bold text-[#167A42] font-heading">{formatUSD(totalTopUpUSD)}</span>
                </div>
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8]">
                  <span className="text-[10px] uppercase text-[#7A7068] block">Total Consommé</span>
                  <span className="text-base font-bold text-[#14110F] font-heading">{formatUSD(totalSpentUSD)}</span>
                </div>
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8]">
                  <span className="text-[10px] uppercase text-[#7A7068] block">Don Solidaire 10%</span>
                  <span className="text-base font-bold text-[#FF6A2B] font-heading">{formatUSD(totalDonationUSD)}</span>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 7. ONGLET 5 : VÉRIFIER UN BILLET (ANTI-FRAUDE OFFICIEL) */}
        {activeClientTab === 'VERIFY' && (
          <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
            <div className="p-6 sm:p-8 rounded-[28px] bg-white border border-[#E5E0D8] shadow-xs space-y-6">
              
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#E2F3E9] text-[#167A42] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-heading font-black text-[#14110F]">
                    Vérificateur de Billet Officiel
                  </h2>
                  <p className="text-xs text-[#7A7068]">
                    Contrôle d'authenticité cryptographique et détection anti-fraude VUKA Pay
                  </p>
                </div>
              </div>

              {/* Formulaire de recherche */}
              <form 
                onSubmit={(e) => { 
                  e.preventDefault(); 
                  handleVerifyTicket(); 
                }} 
                className="space-y-4"
              >
                <div>
                  <label className="text-xs font-bold text-[#14110F] uppercase tracking-wider block mb-1.5 font-heading">
                    Référence du Billet ou Token Cryptographique
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Search className="w-4 h-4 text-[#FF6A2B]" />
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="Ex: TCK-CFW6-8210 ou VUKA-..."
                      value={verifyInputCode}
                      onChange={(e) => setVerifyInputCode(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] font-mono text-xs font-bold text-[#14110F] uppercase tracking-wider focus:outline-none focus:border-[#FF6A2B]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-6 rounded-full bg-[#14110F] hover:bg-[#2A2420] text-white font-heading font-bold text-xs uppercase tracking-wider shadow-xs transition active:scale-95 flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-[#FF6A2B]" />
                  <span>Vérifier l'Authenticité</span>
                </button>
              </form>

              {/* Raccourci vers mes propres billets pour tester */}
              {purchasedTickets.length > 0 && (
                <div className="pt-2 border-t border-[#E5E0D8]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A7068] block mb-2">
                    Tester avec l'un de vos billets enregistrés :
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {purchasedTickets.map((t) => (
                      <button
                        key={t.ticketId}
                        type="button"
                        onClick={() => {
                          setVerifyInputCode(t.ticketId);
                          handleVerifyTicket(t.ticketId);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F3ECE2] border border-[#E5E0D8] text-xs font-mono font-bold text-[#14110F] transition"
                      >
                        {t.ticketId}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Résultat de vérification */}
              {verifyResult.searched && (
                <div className="pt-4 border-t border-[#E5E0D8] space-y-4 animate-in fade-in duration-200">
                  {verifyResult.status === 'VALID' && verifyResult.ticket && (
                    <div className="p-4 rounded-2xl bg-[#E2F3E9] border border-[#167A42]/30 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#167A42]">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>Billet Authentique & Valide (Non Scanné)</span>
                      </div>
                      <div className="text-xs text-[#14110F] space-y-1 font-mono pt-1">
                        <div>Événement : <strong>{verifyResult.ticket.ticketName}</strong></div>
                        <div>Titulaire : {verifyResult.ticket.buyerName}</div>
                        <div>Référence : {verifyResult.ticket.ticketId}</div>
                        <div>Montant : {formatUSD(verifyResult.ticket.pricePaidUSD)}</div>
                      </div>
                    </div>
                  )}

                  {verifyResult.status === 'ALREADY_USED' && (
                    <div className="p-4 rounded-2xl bg-[#FFFBEB] border border-[#F59E0B]/30 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#B45309]">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>Billet Déjà Scanné à l'Entrée</span>
                      </div>
                      <p className="text-xs text-[#7A7068]">
                        {verifyResult.details}
                      </p>
                    </div>
                  )}

                  {verifyResult.status === 'NOT_FOUND' && (
                    <div className="p-4 rounded-2xl bg-[#FEF2F2] border border-[#DC2626]/30 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#DC2626]">
                        <XCircle className="w-4 h-4 shrink-0" />
                        <span>Billet Inconnu ou Falsifié</span>
                      </div>
                      <p className="text-xs text-[#7A7068]">
                        {verifyResult.details || "Cette référence n'existe pas dans le registre officiel VUKA Pay."}
                      </p>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        )}

        {/* 8. ONGLET 6 : MON PROFIL & SÉCURITÉ */}
        {activeClientTab === 'PROFILE' && (
          <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
            <div className="p-6 sm:p-8 rounded-[28px] bg-white border border-[#E5E0D8] shadow-xs space-y-6">
              <div>
                <h2 className="text-xl font-heading font-black text-[#14110F]">
                  Paramètres du Compte
                </h2>
                <p className="text-xs text-[#7A7068]">
                  Identité, coordonnées et niveau de sécurité du compte
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-[#7A7068] uppercase tracking-wider block mb-1">
                    Nom Complet
                  </label>
                  <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] text-xs font-bold text-[#14110F]">
                    {currentUser?.name || wallet.festivalierName || 'Festivalier VUKA'}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#7A7068] uppercase tracking-wider block mb-1">
                    Numéro Mobile Money Principal
                  </label>
                  <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] text-xs font-mono font-bold text-[#14110F]">
                    {currentUser?.phone || wallet.phone}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#7A7068] uppercase tracking-wider block mb-1">
                    Adresse Email
                  </label>
                  <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] text-xs font-mono text-[#14110F]">
                    {currentUser?.email || 'mbote@mokili.io'}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#7A7068] uppercase tracking-wider block mb-1">
                    Identifiant de Compte Unique
                  </label>
                  <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] text-xs font-mono text-[#7A7068]">
                    {currentUser?.id || wallet.id}
                  </div>
                </div>

                {/* Sécurité et Session */}
                <div className="pt-4 border-t border-[#E5E0D8] space-y-3">
                  <span className="text-xs font-heading font-bold text-[#14110F] uppercase tracking-wider block">
                    Sécurité & Cryptographie
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8]">
                      <div className="font-bold text-[#14110F]">HMAC-SHA256</div>
                      <div className="text-[11px] text-[#7A7068]">Token tournant 30s anti-fraude</div>
                    </div>
                    <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8]">
                      <div className="font-bold text-[#14110F]">Starlink Sync</div>
                      <div className="text-[11px] text-[#7A7068]">Résilience offline-first terminal</div>
                    </div>
                  </div>
                </div>

                {/* Déconnexion */}
                <div className="pt-4 border-t border-[#E5E0D8] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-heading font-bold text-[#14110F]">Session Active</div>
                    <p className="text-[11px] text-[#7A7068]">Connecté sur cet appareil</p>
                  </div>

                  <button
                    type="button"
                    onClick={logoutUser}
                    className="px-4 py-2 rounded-full bg-red-50 hover:bg-red-100 text-red-700 font-heading font-bold text-xs uppercase tracking-wider transition flex items-center gap-1.5 active:scale-95"
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

      {/* MODAL HAUTE RÉSOLUTION POUR AFFICHER LE PASS & PARTAGER */}
      {selectedTicketForPass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="relative w-full max-w-lg bg-white rounded-[32px] border border-[#E5E0D8] shadow-2xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E0D8] mb-6">
              <div>
                <h3 className="text-lg font-heading font-black text-[#14110F]">
                  Billet Officiel & Titre d'Accès
                </h3>
                <p className="text-xs text-[#7A7068]">
                  Référence : {selectedTicketForPass.ticketId}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTicketForPass(null)}
                className="w-8 h-8 rounded-full bg-[#FAF8F5] hover:bg-[#F3ECE2] border border-[#E5E0D8] text-[#14110F] flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <TicketPassView ticket={selectedTicketForPass} />

            <div className="pt-6 border-t border-[#E5E0D8] mt-6">
              <button
                type="button"
                onClick={() => setSelectedTicketForPass(null)}
                className="w-full py-3 rounded-full bg-[#14110F] hover:bg-[#2A2420] text-white font-heading font-bold text-xs uppercase tracking-wider"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
