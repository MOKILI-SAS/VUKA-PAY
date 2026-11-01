import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { formatUSD, formatCDF } from '../../utils/formatters';
import { 
  LayoutDashboard, 
  Wallet, 
  QrCode, 
  Ticket, 
  Store, 
  Calendar, 
  Receipt, 
  ShieldCheck, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  ChevronRight, 
  PlusCircle, 
  CheckCircle2, 
  AlertCircle, 
  Camera, 
  RefreshCw, 
  Download, 
  Share2, 
  Printer, 
  ExternalLink, 
  Copy, 
  Check, 
  Trash2, 
  Edit3, 
  Users, 
  TrendingUp, 
  Smartphone, 
  Sparkles, 
  Plus, 
  Search, 
  Lock, 
  ArrowRight,
  Radio,
  User,
  Heart
} from 'lucide-react';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import { DynamicQRCode } from '../wallet/DynamicQRCode';
import { TicketPassView } from '../ticketing/TicketPassView';
import { 
  PurchasedTicket, 
  CashlessTransaction, 
  ClientPortalTab, 
  MenuItem, 
  Stand, 
  VukaPublishedEvent, 
  EventTierDef 
} from '../../types';

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
    linkRFIDToTicket,
    updateUserProfile,
    purchasedTickets,
    publishedEvents,
    standApplications,
    transactions,
    stands,
    menuItems,
    setAppViewMode,
    openPublishModal,
    verifyTicketByCode,
    payWithWalletForProduct,
    myMerchantStandId,
    setMyMerchantStandId,
    isMerchantActive,
    setIsMerchantActive,
    merchantLinkedEventId,
    setMerchantLinkedEventId,
    addMerchantProduct,
    updateMerchantProduct,
    deleteMerchantProduct,
    updateStandCommissionRate,
    addStandToOrganizerEvent,
    removeStandFromOrganizerEvent
  } = useApp();

  // État du tiroir de navigation mobile
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Billet sélectionné pour affichage modal haute résolution
  const [selectedTicketForPass, setSelectedTicketForPass] = useState<PurchasedTicket | null>(null);

  // Billet en cours d'édition RFID
  const [ticketToLinkRFID, setTicketToLinkRFID] = useState<string | null>(null);
  const [ticketRfidInput, setTicketRfidInput] = useState('');

  // ----------------------------------------------------
  // MODULE 1 : SCANNER CAMÉRA POUR PAYER (SCAN_PAY)
  // ----------------------------------------------------
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Produit scanné prêt pour confirmation de paiement
  const [scannedProductInfo, setScannedProductInfo] = useState<{
    standId: string;
    standName: string;
    productId: string;
    productName: string;
    priceUSD: number;
  } | null>(null);
  const [scanPaymentSuccess, setScanPaymentSuccess] = useState<CashlessTransaction | null>(null);
  const [scanPaymentError, setScanPaymentError] = useState<string | null>(null);
  const [isScanProcessing, setIsScanProcessing] = useState(false);

  // Démarrer la caméra quand l'onglet SCAN_PAY est actif
  useEffect(() => {
    if (activeClientTab === 'SCAN_PAY' && !scannedProductInfo && !scanPaymentSuccess) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [activeClientTab, scannedProductInfo, scanPaymentSuccess]);

  const startCamera = async () => {
    setCameraError(null);
    setCameraActive(true);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      } else {
        setCameraError("La caméra n'est pas supportée sur ce navigateur. Utilisez le simulateur de scan ci-dessous.");
      }
    } catch {
      setCameraError("Accès caméra refusé ou non disponible. Vous pouvez utiliser le simulateur de scan de stand ci-dessous.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  // Simuler le scan d'un produit depuis un stand marchand
  const handleSimulateScan = (standId: string, item: MenuItem) => {
    const stand = stands.find(s => s.id === standId) || stands[0];
    stopCamera();
    setScannedProductInfo({
      standId: stand.id,
      standName: stand.name,
      productId: item.id,
      productName: item.name,
      priceUSD: item.priceUSD
    });
    setScanPaymentError(null);
  };

  const handleConfirmScanPayment = async () => {
    if (!scannedProductInfo) return;
    setIsScanProcessing(true);
    setScanPaymentError(null);

    const res = await payWithWalletForProduct(
      scannedProductInfo.standId,
      scannedProductInfo.productId,
      scannedProductInfo.productName,
      scannedProductInfo.priceUSD
    );

    setIsScanProcessing(false);
    if (res.success && res.transaction) {
      setScanPaymentSuccess(res.transaction);
      setScannedProductInfo(null);
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch {}
    } else {
      setScanPaymentError(res.error || "Paiement refusé.");
    }
  };

  // ----------------------------------------------------
  // MODULE 2 : ESPACE MARCHAND & STANDIER (STAND_MERCHANT)
  // ----------------------------------------------------
  const currentMerchantStand = stands.find(s => s.id === myMerchantStandId) || stands[0];
  const merchantProducts = menuItems.filter(p => p.standId === currentMerchantStand?.id);
  const merchantTransactions = transactions.filter(t => t.standId === currentMerchantStand?.id && t.type === 'PAYMENT');
  
  const merchantGrossSalesUSD = currentMerchantStand?.totalSalesUSD || 0;
  const merchantCommissionRate = currentMerchantStand?.commissionPercent || 10;
  const merchantTotalCommissionUSD = Math.round((merchantGrossSalesUSD * (merchantCommissionRate / 100)) * 100) / 100;
  const merchantNetPayoutUSD = Math.round((merchantGrossSalesUSD - merchantTotalCommissionUSD) * 100) / 100;

  // Modal Ajout/Modification de Produit Marchand
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<MenuItem | null>(null);
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState<'FOOD' | 'DRINK' | 'DESSERT' | 'SNACK'>('FOOD');
  const [prodPrice, setProdPrice] = useState<string>('5');
  const [prodStock, setProdStock] = useState<string>('50');

  // Modal QR Code Unique Produit pour impression et partage
  const [qrProductModal, setQrProductModal] = useState<MenuItem | null>(null);
  const [generatedProductQR, setGeneratedProductQR] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (qrProductModal) {
      const payload = `VUKA:PAY:STAND=${currentMerchantStand?.id}&PROD=${qrProductModal.id}&PRICE=${qrProductModal.priceUSD}&NAME=${encodeURIComponent(qrProductModal.name)}`;
      QRCode.toDataURL(payload, {
        width: 260,
        margin: 1,
        color: { dark: '#14110F', light: '#FFFFFF' }
      }).then(setGeneratedProductQR).catch(console.error);
    }
  }, [qrProductModal, currentMerchantStand]);

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProdName('');
    setProdCategory('FOOD');
    setProdPrice('5');
    setProdStock('50');
    setProductModalOpen(true);
  };

  const handleOpenEditProduct = (item: MenuItem) => {
    setEditingProduct(item);
    setProdName(item.name);
    setProdCategory(item.category);
    setProdPrice(item.priceUSD.toString());
    setProdStock(item.currentStock.toString());
    setProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) return;
    const priceNum = Math.max(0.5, parseFloat(prodPrice) || 5);
    const stockNum = Math.max(1, parseInt(prodStock, 10) || 50);

    if (editingProduct) {
      updateMerchantProduct(editingProduct.id, {
        name: prodName.trim(),
        category: prodCategory,
        priceUSD: priceNum,
        currentStock: stockNum
      });
    } else {
      addMerchantProduct({
        standId: currentMerchantStand?.id || 'stand-1',
        name: prodName.trim(),
        description: 'Produit officiel certifié VUKA Standier',
        category: prodCategory,
        priceUSD: priceNum,
        currentStock: stockNum,
        initialStock: stockNum,
        isAvailable: true
      });
    }
    setProductModalOpen(false);
  };

  // Export CSV de la fiche comptable marchande
  const exportMerchantCSV = () => {
    const headers = ['Date', 'Reference Transaction', 'Produit', 'Quantite', 'Montant Brut USD', 'Taux Commission', 'Commission Prelevee USD', 'Net Marchand USD'];
    const rows = merchantTransactions.map(tx => [
      new Date(tx.timestamp).toLocaleString('fr-FR'),
      tx.id,
      tx.items?.[0]?.productName || 'Article Stand',
      tx.items?.[0]?.quantity || 1,
      tx.amountUSD.toFixed(2),
      `${merchantCommissionRate}%`,
      tx.commissionAmountUSD.toFixed(2),
      tx.merchantNetUSD.toFixed(2)
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(';'), ...rows.map(e => e.join(';'))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Comptabilite-Marchand-${currentMerchantStand?.name.replace(/\s+/g, '-')}-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ----------------------------------------------------
  // MODULE 3 : ESPACE ORGANISATEUR (ORGANIZER)
  // ----------------------------------------------------
  const [organizerSelectedEventId, setOrganizerSelectedEventId] = useState<string>(publishedEvents[0]?.id || 'cfw-6');
  const activeOrganizerEvent = publishedEvents.find(e => e.id === organizerSelectedEventId) || publishedEvents[0];
  
  // Stands rattachés à cet événement
  const eventStands = stands.filter(s => !s.eventId || s.eventId === activeOrganizerEvent?.id);
  const totalStandsSalesUSD = eventStands.reduce((acc, s) => acc + (s.totalSalesUSD || 0), 0);
  const totalStandsCommissionUSD = eventStands.reduce((acc, s) => {
    const rate = s.commissionPercent || 10;
    return acc + Math.round((s.totalSalesUSD * (rate / 100)) * 100) / 100;
  }, 0);
  const totalStandsNetPayoutUSD = totalStandsSalesUSD - totalStandsCommissionUSD;

  // Modal ajout de marchand à l'événement
  const [addStandModalOpen, setAddStandModalOpen] = useState(false);
  const [newStandName, setNewStandName] = useState('');
  const [newStandPhone, setNewStandPhone] = useState('+243 ');
  const [newStandCommission, setNewStandCommission] = useState('10');
  const [newStandCategory, setNewStandCategory] = useState('Gastronomie & Grillades');

  const handleAddStandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStandName.trim()) return;
    addStandToOrganizerEvent(activeOrganizerEvent?.id || 'cfw-6', {
      name: newStandName.trim(),
      ownerPhone: newStandPhone.trim(),
      commissionPercent: parseInt(newStandCommission, 10) || 10,
      category: newStandCategory
    });
    setNewStandName('');
    setNewStandPhone('+243 ');
    setAddStandModalOpen(false);
  };

  // Export CSV Données Organisation
  const exportOrganizerCSV = () => {
    const headers = ['Nom Stand', 'Zone', 'Contact M-Pesa', 'Ventes Brutes USD', 'Taux Commission', 'Commission Organisation USD', 'Net Reversé Standier USD'];
    const rows = eventStands.map(s => {
      const rate = s.commissionPercent || 10;
      const comm = Math.round((s.totalSalesUSD * (rate / 100)) * 100) / 100;
      const net = s.totalSalesUSD - comm;
      return [
        s.name,
        s.locationZone,
        s.ownerPhoneMpesa,
        s.totalSalesUSD.toFixed(2),
        `${rate}%`,
        comm.toFixed(2),
        net.toFixed(2)
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(';'), ...rows.map(e => e.join(';'))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rapport-Organisation-${activeOrganizerEvent?.title.replace(/\s+/g, '-')}-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ----------------------------------------------------
  // MODULE 4 : PARAMÈTRES DU PROFIL (SETTINGS)
  // ----------------------------------------------------
  const [editProfileName, setEditProfileName] = useState(currentUser?.name || wallet.festivalierName || '');
  const [editProfilePhone, setEditProfilePhone] = useState(currentUser?.phone || wallet.phone || '');
  const [editProfileEmail, setEditProfileEmail] = useState(currentUser?.email || '');
  const [editProfileAvatar, setEditProfileAvatar] = useState(currentUser?.avatarUrl || '');
  const [profileSuccessMsg, setProfileSuccessMsg] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: editProfileName.trim(),
      phone: editProfilePhone.trim(),
      email: editProfileEmail.trim(),
      avatarUrl: editProfileAvatar.trim()
    });
    setProfileSuccessMsg(true);
    setTimeout(() => setProfileSuccessMsg(false), 3000);
  };

  // ----------------------------------------------------
  // MODULE 5 : VÉRIFICATION ANTI-FRAUDE
  // ----------------------------------------------------
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

  // ----------------------------------------------------
  // RECHARGES M-PESA & REMBOURSEMENT
  // ----------------------------------------------------
  const [selectedTopUpAmt, setSelectedTopUpAmt] = useState<number>(10);
  const [customTopUpAmt, setCustomTopUpAmt] = useState<string>('');
  const [isTopUpLoading, setIsTopUpLoading] = useState(false);
  const [topUpSuccess, setTopUpSuccess] = useState(false);

  const [refundPhone, setRefundPhone] = useState(currentUser?.phone || wallet.phone || '+243 ');
  const [isRefunding, setIsRefunding] = useState(false);
  const [refundSuccessMsg, setRefundSuccessMsg] = useState<string | null>(null);

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
      setRefundSuccessMsg(`Virement M-Pesa de ${formatUSD(res.amountRefundedUSD)} envoyé sur ${refundPhone}`);
      setTimeout(() => setRefundSuccessMsg(null), 5000);
    }
  };

  // Navigation Items Sidebar
  interface NavItem {
    id: ClientPortalTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
    count?: number;
    highlight?: boolean;
    proBadge?: string;
  }

  interface NavGroup {
    group: string;
    items: NavItem[];
  }

  const navigationGroups: NavGroup[] = [
    {
      group: 'Espace Personnel & Festivalier',
      items: [
        { id: 'OVERVIEW', label: "Vue d'ensemble", icon: LayoutDashboard },
        { id: 'WALLET', label: 'Portefeuille Cashless', icon: Wallet, badge: formatUSD(wallet.balanceUSD) },
        { id: 'SCAN_PAY', label: 'Scanner pour Payer', icon: Camera, highlight: true },
        { id: 'TICKETS', label: 'Mes Billets & Pass', icon: Ticket, count: purchasedTickets.length },
        { id: 'HISTORY', label: 'Historique des Reçus', icon: Receipt },
        { id: 'VERIFY', label: 'Vérifier un Billet', icon: ShieldCheck }
      ]
    },
    {
      group: 'Espaces Professionnels',
      items: [
        { id: 'STAND_MERCHANT', label: 'Espace Standier / Marchand', icon: Store, proBadge: 'POS' },
        { id: 'ORGANIZER', label: 'Espace Organisateur', icon: Calendar, proBadge: 'PRO' }
      ]
    },
    {
      group: 'Compte & Sécurité',
      items: [
        { id: 'SETTINGS', label: 'Paramètres du Profil', icon: Settings }
      ]
    }
  ];

  const handleSelectTab = (tab: ClientPortalTab) => {
    setActiveClientTab(tab);
    setMobileSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FBF6EE] flex flex-col lg:flex-row">
      
      {/* ---------------------------------------------------- */}
      {/* BARRE MOBILE SUPÉRIEURE (Petits écrans) */}
      {/* ---------------------------------------------------- */}
      <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-[#E5E0D8] px-4 py-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setMobileSidebarOpen(true)}
          className="h-9 px-3 rounded-full bg-[#FAF8F5] border border-[#E5E0D8] text-[#14110F] text-xs font-heading font-bold flex items-center gap-1.5"
        >
          <Menu className="w-4 h-4 text-[#FF6A2B]" />
          <span>Menu Dashboard</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleSelectTab('SCAN_PAY')}
            className="h-8 px-3 rounded-full bg-[#14110F] text-[#FFC21A] text-xs font-bold flex items-center gap-1"
          >
            <Camera className="w-3.5 h-3.5 text-[#FF6A2B]" />
            <span>Scanner</span>
          </button>

          <span className="text-xs font-mono font-bold text-[#FF6A2B] px-2.5 py-1 rounded-full bg-[#FFE3D3]">
            {formatUSD(wallet.balanceUSD)}
          </span>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* SIDEBAR FIXE GAUCHE (Desktop) & TIROIR (Mobile) */}
      {/* ---------------------------------------------------- */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-[#E5E0D8] flex flex-col justify-between transition-transform duration-200 ease-in-out
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full overflow-y-auto">
          
          {/* Header Sidebar */}
          <div className="p-5 border-b border-[#E5E0D8] flex items-center justify-between">
            <button
              type="button"
              onClick={() => setAppViewMode('PUBLIC_LANDING')}
              className="text-left group"
            >
              <div className="text-base font-heading font-black text-[#14110F] tracking-tight group-hover:text-[#FF6A2B] transition">
                VUKA Pay
              </div>
              <div className="text-[10px] text-[#7A7068] font-mono flex items-center gap-1">
                <span>← Retour catalogue</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden w-8 h-8 rounded-full bg-[#FAF8F5] text-[#14110F] flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* User Snapshot Card */}
          <div className="p-4 mx-4 my-3 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#14110F] text-[#FFC21A] flex items-center justify-center font-heading font-black text-sm shrink-0">
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : wallet.festivalierName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-heading font-black text-[#14110F] truncate">
                  {currentUser?.name || wallet.festivalierName}
                </div>
                <div className="text-[10px] text-[#7A7068] font-mono truncate">
                  {currentUser?.phone || wallet.phone}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#E5E0D8] flex items-center justify-between text-xs">
              <span className="text-[10px] font-mono text-[#7A7068] uppercase">Solde</span>
              <span className="font-mono font-bold text-[#FF6A2B]">
                {formatUSD(wallet.balanceUSD)}
              </span>
            </div>
          </div>

          {/* Menu de Navigation Groupé */}
          <nav className="flex-1 px-3 py-2 space-y-6">
            {navigationGroups.map((grp, gIdx) => (
              <div key={gIdx} className="space-y-1">
                <div className="px-3 text-[10px] font-heading font-bold uppercase tracking-wider text-[#7A7068]">
                  {grp.group}
                </div>

                {grp.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeClientTab === item.id || (item.id === 'OVERVIEW' && activeClientTab === 'DASHBOARD') || (item.id === 'SETTINGS' && activeClientTab === 'PROFILE');

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-heading font-bold transition text-left ${
                        isActive
                          ? 'bg-[#14110F] text-[#FBF6EE] shadow-xs'
                          : item.highlight
                          ? 'bg-[#FFE3D3] text-[#14110F] hover:bg-[#ffd6be]'
                          : 'text-[#4A433D] hover:text-[#14110F] hover:bg-[#FAF8F5]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className={`w-4 h-4 shrink-0 ${
                          isActive 
                            ? 'text-[#FF6A2B]' 
                            : item.highlight 
                            ? 'text-[#FF6A2B]' 
                            : 'text-[#7A7068]'
                        }`} />
                        <span className="truncate">{item.label}</span>
                      </div>

                      {item.count !== undefined && item.count > 0 && (
                        <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                          isActive ? 'bg-[#FF6A2B] text-[#14110F]' : 'bg-[#E5E0D8] text-[#14110F]'
                        }`}>
                          {item.count}
                        </span>
                      )}

                      {item.badge && (
                        <span className="text-[10px] font-mono font-bold text-[#FF6A2B]">
                          {item.badge}
                        </span>
                      )}

                      {item.proBadge && (
                        <span className="px-1.5 py-0.2 rounded-full bg-[#14110F] text-[#FFC21A] text-[9px] font-mono font-bold">
                          {item.proBadge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* Déconnexion en bas de Sidebar */}
          <div className="p-4 border-t border-[#E5E0D8]">
            <button
              type="button"
              onClick={logoutUser}
              className="w-full py-2 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-heading font-bold flex items-center justify-center gap-2 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Déconnexion</span>
            </button>
          </div>

        </div>
      </aside>

      {/* Fond sombre pour tiroir mobile */}
      {mobileSidebarOpen && (
        <div 
          onClick={() => setMobileSidebarOpen(false)}
          className="lg:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-xs"
        />
      )}

      {/* ---------------------------------------------------- */}
      {/* ZONE CENTRALE DE CONTENU DU DASHBOARD (Fluid & Pro) */}
      {/* ---------------------------------------------------- */}
      <main className="flex-1 lg:pl-72 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">

        {/* ---------------------------------------------------- */}
        {/* ONGLET 1 : VUE D'ENSEMBLE (OVERVIEW) — MES CHIFFRES */}
        {/* ---------------------------------------------------- */}
        {(activeClientTab === 'OVERVIEW' || activeClientTab === 'DASHBOARD') && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Header d'accueil & Titre */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-[24px] border border-[#E5E0D8] p-5 sm:p-6 shadow-xs">
              <div>
                <h1 className="text-xl sm:text-2xl font-heading font-black text-[#14110F]">
                  Tableau de Bord VUKA Pay
                </h1>
                <p className="text-xs text-[#7A7068] mt-0.5">
                  Bienvenue, {currentUser?.name || wallet.festivalierName}. Gérez vos billets, votre solde et vos activités.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectTab('SCAN_PAY')}
                  className="h-10 px-4 rounded-full bg-[#14110F] hover:bg-[#2A2420] text-white text-xs font-heading font-bold flex items-center gap-2 transition active:scale-95 shadow-xs"
                >
                  <Camera className="w-4 h-4 text-[#FF6A2B]" />
                  <span>Scanner pour Payer</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectTab('WALLET')}
                  className="h-10 px-4 rounded-full bg-[#FF6A2B] hover:bg-[#e0561d] text-[#14110F] text-xs font-heading font-bold flex items-center gap-1.5 transition active:scale-95 shadow-xs"
                >
                  <PlusCircle className="w-4 h-4 text-[#14110F]" />
                  <span>Recharger</span>
                </button>
              </div>
            </div>

            {/* Grille des Chiffres Clés (4 KPIs) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div 
                onClick={() => handleSelectTab('WALLET')}
                className="p-5 rounded-2xl bg-white border border-[#E5E0D8] shadow-xs cursor-pointer hover:border-[#FF6A2B]/40 transition group"
              >
                <div className="flex items-center justify-between text-xs text-[#7A7068] mb-2">
                  <span className="font-bold uppercase tracking-wider text-[10px]">Solde Portefeuille</span>
                  <Wallet className="w-4 h-4 text-[#FF6A2B] group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-2xl font-heading font-black text-[#14110F] font-mono tabular-nums">
                  {formatUSD(wallet.balanceUSD)}
                </div>
                <div className="text-[11px] font-bold text-[#FF6A2B] font-mono tabular-nums mt-1">
                  ≈ {formatCDF(wallet.balanceUSD)}
                </div>
              </div>

              <div 
                onClick={() => handleSelectTab('TICKETS')}
                className="p-5 rounded-2xl bg-white border border-[#E5E0D8] shadow-xs cursor-pointer hover:border-[#14110F]/40 transition group"
              >
                <div className="flex items-center justify-between text-xs text-[#7A7068] mb-2">
                  <span className="font-bold uppercase tracking-wider text-[10px]">Mes Billets & Places</span>
                  <Ticket className="w-4 h-4 text-[#14110F] group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-2xl font-heading font-black text-[#14110F] font-mono tabular-nums">
                  {purchasedTickets.length}
                </div>
                <div className="text-[11px] text-[#7A7068] mt-1">
                  {purchasedTickets.length > 0 ? 'Billets disponibles' : 'Aucun pass actif'}
                </div>
              </div>

              <div 
                onClick={() => handleSelectTab('STAND_MERCHANT')}
                className="p-5 rounded-2xl bg-white border border-[#E5E0D8] shadow-xs cursor-pointer hover:border-[#0E5A8A]/40 transition group"
              >
                <div className="flex items-center justify-between text-xs text-[#7A7068] mb-2">
                  <span className="font-bold uppercase tracking-wider text-[10px]">Espace Standier</span>
                  <Store className="w-4 h-4 text-[#0E5A8A] group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-2xl font-heading font-black text-[#14110F] font-mono tabular-nums">
                  {currentMerchantStand ? formatUSD(currentMerchantStand.totalSalesUSD) : '$0.00'}
                </div>
                <div className="text-[11px] text-[#0E5A8A] font-bold mt-1">
                  {isMerchantActive ? 'Stand Actif' : 'Stand Fermé'}
                </div>
              </div>

              <div 
                onClick={() => handleSelectTab('ORGANIZER')}
                className="p-5 rounded-2xl bg-white border border-[#E5E0D8] shadow-xs cursor-pointer hover:border-[#14110F]/40 transition group"
              >
                <div className="flex items-center justify-between text-xs text-[#7A7068] mb-2">
                  <span className="font-bold uppercase tracking-wider text-[10px]">Événements Gérés</span>
                  <Calendar className="w-4 h-4 text-[#14110F] group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-2xl font-heading font-black text-[#14110F] font-mono tabular-nums">
                  {publishedEvents.length}
                </div>
                <div className="text-[11px] text-[#7A7068] mt-1">
                  {eventStands.length} marchands partenaires
                </div>
              </div>

            </div>

            {/* Accès Rapide aux 2 Rôles Clés */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 rounded-[24px] bg-white border border-[#E5E0D8] shadow-xs flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFE3D3] text-[#14110F] text-[10px] font-bold uppercase font-mono">
                    <Store className="w-3 h-3 text-[#FF6A2B]" />
                    <span>Espace Marchand / Standier</span>
                  </div>
                  <h3 className="text-lg font-heading font-black text-[#14110F]">
                    Gérer mon Stand & Mes Codes QR Produits
                  </h3>
                  <p className="text-xs text-[#7A7068] leading-relaxed">
                    Ajoutez vos plats et boissons, générez des codes QR individuels pour chaque produit et suivez vos encaissements en direct.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleSelectTab('STAND_MERCHANT')}
                  className="h-10 px-5 rounded-full bg-[#14110F] hover:bg-[#2A2420] text-white text-xs font-heading font-bold transition flex items-center justify-center gap-2 self-start"
                >
                  <span>Accéder à mon Stand</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#FF6A2B]" />
                </button>
              </div>

              <div className="p-6 rounded-[24px] bg-white border border-[#E5E0D8] shadow-xs flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E5F0F7] text-[#14110F] text-[10px] font-bold uppercase font-mono">
                    <Calendar className="w-3 h-3 text-[#0E5A8A]" />
                    <span>Espace Organisateur</span>
                  </div>
                  <h3 className="text-lg font-heading font-black text-[#14110F]">
                    Billetterie, Marchands & Clôture
                  </h3>
                  <p className="text-xs text-[#7A7068] leading-relaxed">
                    Créez des événements multi-jours, définissez les commissions des marchands, suivez vos abonnés et exportez vos données.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleSelectTab('ORGANIZER')}
                  className="h-10 px-5 rounded-full bg-[#14110F] hover:bg-[#2A2420] text-white text-xs font-heading font-bold transition flex items-center justify-center gap-2 self-start"
                >
                  <span>Gérer mes Événements</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#FF6A2B]" />
                </button>
              </div>
            </div>

            {/* Billet Actif & Dernières Opérations */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Billet Actif */}
              <div className="lg:col-span-7 bg-white rounded-[28px] border border-[#E5E0D8] p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-heading font-black text-[#14110F]">
                    Mon Titre d'Accès Actif
                  </h3>
                  <button
                    type="button"
                    onClick={() => handleSelectTab('TICKETS')}
                    className="text-xs font-bold text-[#FF6A2B] hover:underline"
                  >
                    Voir tous ({purchasedTickets.length})
                  </button>
                </div>

                {purchasedTickets.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] space-y-2">
                    <Ticket className="w-8 h-8 text-[#7A7068] mx-auto opacity-40" />
                    <p className="text-xs text-[#7A7068]">Aucun pass acheté pour l'instant.</p>
                    <button
                      type="button"
                      onClick={() => setAppViewMode('PUBLIC_LANDING')}
                      className="px-4 py-2 rounded-full bg-[#14110F] text-white text-xs font-bold"
                    >
                      Acheter un Pass
                    </button>
                  </div>
                ) : (
                  <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="px-2 py-0.5 rounded-full bg-[#E2F3E9] text-[#167A42] text-[10px] font-bold">
                          Valide
                        </span>
                        <h4 className="text-base font-heading font-black text-[#14110F] mt-1">
                          {purchasedTickets[0].ticketName}
                        </h4>
                        <div className="text-xs text-[#7A7068]">
                          Titulaire : <strong>{purchasedTickets[0].buyerName}</strong>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-[#14110F]">
                        {purchasedTickets[0].ticketId}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-[#E5E0D8] flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setSelectedTicketForPass(purchasedTickets[0])}
                        className="h-8 px-4 rounded-full bg-[#14110F] text-white text-xs font-bold flex items-center gap-1.5"
                      >
                        <QrCode className="w-3.5 h-3.5 text-[#FF6A2B]" />
                        <span>Pass & WhatsApp</span>
                      </button>

                      <span className="text-xs font-mono font-bold text-[#FF6A2B]">
                        {formatUSD(purchasedTickets[0].pricePaidUSD)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Dynamic QR Quick Pass */}
              <div className="lg:col-span-5 bg-white rounded-[28px] border border-[#E5E0D8] p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-heading font-black text-[#14110F]">Paiement Sans Contact</h3>
                    <p className="text-[11px] text-[#7A7068]">Token dynamique tournant 30s</p>
                  </div>
                  <Lock className="w-4 h-4 text-[#FF6A2B]" />
                </div>
                <div className="flex justify-center">
                  <DynamicQRCode />
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* ONGLET 2 : SCANNER CAMÉRA POUR PAYER (SCAN_PAY) */}
        {/* ---------------------------------------------------- */}
        {activeClientTab === 'SCAN_PAY' && (
          <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
            <div className="p-6 sm:p-8 rounded-[28px] bg-white border border-[#E5E0D8] shadow-xs space-y-6">
              
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-heading font-black text-[#14110F]">
                    Scanner pour Payer
                  </h2>
                  <p className="text-xs text-[#7A7068]">
                    Scannez le code QR d'un standier ou d'un produit pour régler instantanément avec votre portefeuille Cashless.
                  </p>
                </div>
                <div className="px-3 py-1 rounded-full bg-[#FFE3D3] text-[#14110F] text-xs font-mono font-bold">
                  Solde: {formatUSD(wallet.balanceUSD)}
                </div>
              </div>

              {/* Écran Caméra ou Résultat */}
              {scanPaymentSuccess ? (
                <div className="p-6 rounded-2xl bg-[#E2F3E9] border border-[#167A42]/30 text-center space-y-4">
                  <div className="w-12 h-12 bg-[#167A42] text-white rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-lg font-heading font-black text-[#14110F]">
                      Paiement Confirmé avec Succès !
                    </h3>
                    <p className="text-xs text-[#7A7068] mt-1">
                      Vous avez réglé <strong>{formatUSD(scanPaymentSuccess.amountUSD)}</strong> chez <strong>{scanPaymentSuccess.standName}</strong>.
                    </p>
                    <div className="text-[11px] font-mono text-[#7A7068] mt-2">
                      Réf: {scanPaymentSuccess.id} • Nouveau solde: {formatUSD(wallet.balanceUSD)}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setScanPaymentSuccess(null);
                      startCamera();
                    }}
                    className="py-2.5 px-6 rounded-full bg-[#14110F] hover:bg-[#2A2420] text-white font-heading font-bold text-xs uppercase tracking-wider"
                  >
                    Scanner un autre achat
                  </button>
                </div>
              ) : scannedProductInfo ? (
                <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-[#E5E0D8]">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-[#7A7068] block">Stand Vendeur</span>
                      <h4 className="text-sm font-heading font-bold text-[#14110F]">{scannedProductInfo.standName}</h4>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-[#FFE3D3] text-[#14110F] text-xs font-mono font-bold">
                      QR Détecté
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#7A7068] block">Article</span>
                    <h3 className="text-lg font-heading font-black text-[#14110F]">{scannedProductInfo.productName}</h3>
                    <div className="text-2xl font-heading font-black text-[#FF6A2B] font-mono tabular-nums mt-1">
                      {formatUSD(scannedProductInfo.priceUSD)}
                      <span className="text-xs text-[#7A7068] font-normal ml-2">
                        (≈ {formatCDF(scannedProductInfo.priceUSD)})
                      </span>
                    </div>
                  </div>

                  {scanPaymentError && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{scanPaymentError}</span>
                    </div>
                  )}

                  <div className="pt-2 flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setScannedProductInfo(null);
                        startCamera();
                      }}
                      className="flex-1 py-3 rounded-full bg-white border border-[#E5E0D8] text-[#14110F] text-xs font-heading font-bold"
                    >
                      Annuler
                    </button>

                    <button
                      type="button"
                      onClick={handleConfirmScanPayment}
                      disabled={isScanProcessing}
                      className="flex-1 py-3 rounded-full bg-[#FF6A2B] hover:bg-[#e0561d] text-[#14110F] text-xs font-heading font-black uppercase tracking-wider shadow-xs transition active:scale-95 disabled:opacity-50"
                    >
                      {isScanProcessing ? 'Paiement...' : `Régler ${formatUSD(scannedProductInfo.priceUSD)}`}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Cadre Caméra Réel */}
                  <div className="relative aspect-square max-w-sm mx-auto rounded-3xl overflow-hidden bg-black border-2 border-[#14110F] shadow-lg flex items-center justify-center">
                    <video
                      ref={videoRef}
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />

                    {/* Viseur Scanner */}
                    <div className="absolute inset-8 border-2 border-dashed border-[#FF6A2B]/80 rounded-2xl pointer-events-none flex items-center justify-center">
                      <div className="w-full h-0.5 bg-[#FF6A2B] shadow-[0_0_8px_#FF6A2B] animate-pulse" />
                    </div>

                    {!cameraActive && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-black/80 text-white space-y-2">
                        <Camera className="w-8 h-8 text-[#FF6A2B]" />
                        <span className="text-xs">Initialisation de la caméra...</span>
                      </div>
                    )}
                  </div>

                  {cameraError && (
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                      {cameraError}
                    </div>
                  )}

                  {/* Simulateur Rapide de Scan (pour tests et démo instantanés) */}
                  <div className="pt-4 border-t border-[#E5E0D8] space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A7068] block">
                      Ou simuler un scan de produit marchand :
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {menuItems.slice(0, 4).map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleSimulateScan(item.standId, item)}
                          className="p-3 rounded-xl bg-[#FAF8F5] hover:bg-[#F3ECE2] border border-[#E5E0D8] text-left transition flex items-center justify-between"
                        >
                          <div className="min-w-0 pr-2">
                            <div className="text-xs font-heading font-bold text-[#14110F] truncate">{item.name}</div>
                            <div className="text-[10px] text-[#7A7068]">Chez Ntemba</div>
                          </div>
                          <span className="text-xs font-mono font-bold text-[#FF6A2B] shrink-0">
                            {formatUSD(item.priceUSD)}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* ONGLET 3 : PORTEFEUILLE CASHLESS & RECHARGES */}
        {/* ---------------------------------------------------- */}
        {activeClientTab === 'WALLET' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              <div className="lg:col-span-7 space-y-6">
                
                {/* Master Card Fintech */}
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
                    <span>Titulaire : {currentUser?.name || wallet.festivalierName}</span>
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
                      Créditez votre solde pour acheter vos pass et payer chez tous les standiers.
                    </p>
                  </div>

                  {topUpSuccess && (
                    <div className="p-4 rounded-2xl bg-[#E2F3E9] border border-[#167A42]/20 text-xs text-[#167A42] font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#167A42] shrink-0" />
                      <span>Recharge confirmée ! Votre solde a été mis à jour instantanément.</span>
                    </div>
                  )}

                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5">
                    {[5, 10, 20, 50, 100].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => { setSelectedTopUpAmt(amt); setCustomTopUpAmt(''); }}
                        className={`py-3 rounded-2xl text-xs font-heading font-black transition ${
                          selectedTopUpAmt === amt && !customTopUpAmt
                            ? 'bg-[#FF6A2B] text-[#14110F] shadow-xs'
                            : 'bg-[#FAF8F5] hover:bg-[#F3ECE2] text-[#14110F] border border-[#E5E0D8]'
                        }`}
                      >
                        {formatUSD(amt)}
                      </button>
                    ))}
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#14110F] uppercase tracking-wider block mb-1.5 font-heading">
                      Montant libre (USD)
                    </label>
                    <input
                      type="number"
                      min="1"
                      placeholder="Ex: 25"
                      value={customTopUpAmt}
                      onChange={(e) => setCustomTopUpAmt(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] text-xs font-mono font-bold text-[#14110F] focus:outline-none focus:border-[#FF6A2B]"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleTopUp(customTopUpAmt ? parseFloat(customTopUpAmt) : selectedTopUpAmt)}
                    disabled={isTopUpLoading}
                    className="w-full py-3.5 px-6 rounded-full bg-[#FF6A2B] hover:bg-[#e0561d] text-[#14110F] font-heading font-black text-xs uppercase tracking-wider shadow-xs transition active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Smartphone className="w-4 h-4 text-[#14110F]" />
                    <span>Recharger {formatUSD(customTopUpAmt ? parseFloat(customTopUpAmt) || 0 : selectedTopUpAmt)} par M-Pesa</span>
                  </button>
                </div>

              </div>

              {/* Colonne Droite : Remboursement de solde */}
              <div className="lg:col-span-5 space-y-6">
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
                    Vous n'avez pas tout dépensé aux stands ? Récupérez l'intégralité de votre solde restant sur votre compte Vodacom M-Pesa.
                  </p>

                  {refundSuccessMsg && (
                    <div className="p-3 rounded-2xl bg-[#E2F3E9] text-xs text-[#167A42] font-bold">
                      {refundSuccessMsg}
                    </div>
                  )}

                  <form onSubmit={handleRefund} className="space-y-3">
                    <input
                      type="tel"
                      required
                      value={refundPhone}
                      onChange={(e) => setRefundPhone(e.target.value)}
                      placeholder="+243 81 234 56 78"
                      className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] text-xs font-mono font-bold text-[#14110F] focus:outline-none focus:border-[#FF6A2B]"
                    />
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

        {/* ---------------------------------------------------- */}
        {/* ONGLET 4 : MES BILLETS AVEC QUANTITÉ & RFID */}
        {/* ---------------------------------------------------- */}
        {activeClientTab === 'TICKETS' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-heading font-black text-[#14110F]">
                  Mes Billets & Titres d'Accès Officiels
                </h2>
                <p className="text-xs text-[#7A7068] mt-0.5">
                  Chaque place dispose d'un QR code unique, partageable sur WhatsApp et appairable avec un bracelet RFID.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setAppViewMode('PUBLIC_LANDING')}
                className="h-10 px-5 rounded-full bg-[#FF6A2B] hover:bg-[#e0561d] text-[#14110F] font-heading font-bold text-xs uppercase tracking-wider shadow-xs transition active:scale-95 flex items-center gap-1.5 self-start sm:self-auto"
              >
                <PlusCircle className="w-4 h-4 text-[#14110F]" />
                <span>Acheter d'autres places</span>
              </button>
            </div>

            {purchasedTickets.length === 0 ? (
              <div className="p-12 text-center rounded-[28px] bg-white border border-[#E5E0D8] space-y-4">
                <Ticket className="w-12 h-12 text-[#7A7068] mx-auto opacity-40" />
                <h3 className="text-lg font-heading font-black text-[#14110F]">
                  Aucun billet sur ce compte
                </h3>
                <p className="text-xs text-[#7A7068] max-w-sm mx-auto">
                  Réservez vos places pour vous et vos proches pour accéder aux activités et festivals.
                </p>
                <button
                  type="button"
                  onClick={() => setAppViewMode('PUBLIC_LANDING')}
                  className="px-6 py-3 rounded-full bg-[#14110F] text-white font-heading font-bold text-xs"
                >
                  Découvrir la Billetterie
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {purchasedTickets.map((t) => (
                  <div
                    key={t.ticketId}
                    className="p-6 rounded-[28px] bg-white border border-[#E5E0D8] shadow-xs flex flex-col justify-between space-y-5"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#E2F3E9] text-[#167A42] text-[10px] font-bold">
                          {t.status === 'VALID' ? 'Valide / Prêt' : 'Scanné'}
                        </span>
                        <span className="text-xs font-mono font-bold text-[#7A7068]">
                          {t.ticketId}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-lg font-heading font-black text-[#14110F]">
                          {t.ticketName}
                        </h3>
                        <p className="text-xs text-[#7A7068]">
                          Titulaire : <strong>{t.buyerName}</strong> ({t.buyerPhone})
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] flex items-center justify-between text-xs font-mono">
                        <span className="text-[#7A7068]">Tarif :</span>
                        <span className="font-bold text-[#14110F]">{formatUSD(t.pricePaidUSD)}</span>
                      </div>

                      {/* Statut RFID de ce billet */}
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[11px] text-[#7A7068] flex items-center gap-1 font-mono">
                          <Radio className="w-3.5 h-3.5 text-[#FF6A2B]" />
                          <span>RFID : {t.rfidTagId || 'Non associé'}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setTicketToLinkRFID(t.ticketId);
                            setTicketRfidInput(t.rfidTagId || '');
                          }}
                          className="text-[11px] font-bold text-[#FF6A2B] hover:underline"
                        >
                          {t.rfidTagId ? 'Modifier RFID' : '+ Lier bracelet'}
                        </button>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedTicketForPass(t)}
                        className="flex-1 py-2.5 rounded-full bg-[#14110F] hover:bg-[#2A2420] text-white text-xs font-heading font-bold transition flex items-center justify-center gap-1.5"
                      >
                        <QrCode className="w-3.5 h-3.5 text-[#FF6A2B]" />
                        <span>Pass & WhatsApp</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setVerifyInputCode(t.ticketId);
                          handleSelectTab('VERIFY');
                          handleVerifyTicket(t.ticketId);
                        }}
                        className="py-2.5 px-4 rounded-full bg-[#FAF8F5] hover:bg-[#F3ECE2] border border-[#E5E0D8] text-xs font-heading font-bold text-[#14110F]"
                      >
                        Contrôler
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* ONGLET 5 : ESPACE MARCHAND / STANDIER (STAND_MERCHANT) */}
        {/* ---------------------------------------------------- */}
        {activeClientTab === 'STAND_MERCHANT' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Header Standier & Sélecteurs */}
            <div className="bg-white rounded-[28px] border border-[#E5E0D8] p-6 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFE3D3] text-[#14110F] text-[10px] font-bold uppercase font-mono mb-1">
                    <Store className="w-3 h-3 text-[#FF6A2B]" />
                    <span>Espace Marchand Officiel</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-heading font-black text-[#14110F]">
                    {currentMerchantStand?.name || 'Mon Stand Marchand'}
                  </h2>
                  <p className="text-xs text-[#7A7068]">
                    Gérant : {currentMerchantStand?.ownerName} • Caisse POS & Vente Cashless
                  </p>
                </div>

                {/* Switcher Actif / Fermé */}
                <div className="flex items-center gap-3 self-start sm:self-auto">
                  <span className={`text-xs font-bold ${isMerchantActive ? 'text-[#167A42]' : 'text-slate-400'}`}>
                    {isMerchantActive ? 'Stand Ouvert' : 'Stand Fermé'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsMerchantActive(!isMerchantActive)}
                    className={`w-12 h-6 rounded-full transition-colors p-0.5 flex items-center ${
                      isMerchantActive ? 'bg-[#167A42]' : 'bg-slate-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      isMerchantActive ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              </div>

              {/* Liaison Événement Partenaire */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#7A7068] block">Événement Rattaché</span>
                  <select
                    value={merchantLinkedEventId}
                    onChange={(e) => setMerchantLinkedEventId(e.target.value)}
                    className="bg-transparent font-heading font-bold text-sm text-[#14110F] focus:outline-none cursor-pointer"
                  >
                    {publishedEvents.map((evt) => (
                      <option key={evt.id} value={evt.id}>
                        {evt.title} ({evt.city})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="text-left sm:text-right text-[11px] text-[#7A7068]">
                  Rapport automatique transmis à l'administrateur de cet événement en direct.
                </div>
              </div>

              {/* Chiffres Comptables Marchands */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8]">
                  <span className="text-[10px] uppercase text-[#7A7068] block font-mono">CA Brut Encaissé</span>
                  <span className="text-lg font-heading font-black text-[#14110F]">{formatUSD(merchantGrossSalesUSD)}</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8]">
                  <span className="text-[10px] uppercase text-[#7A7068] block font-mono">Commission ({merchantCommissionRate}%)</span>
                  <span className="text-lg font-heading font-black text-[#FF6A2B]">{formatUSD(merchantTotalCommissionUSD)}</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8]">
                  <span className="text-[10px] uppercase text-[#7A7068] block font-mono">Net Marchand</span>
                  <span className="text-lg font-heading font-black text-[#167A42]">{formatUSD(merchantNetPayoutUSD)}</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8]">
                  <span className="text-[10px] uppercase text-[#7A7068] block font-mono">Ventes Réalisées</span>
                  <span className="text-lg font-heading font-black text-[#14110F]">{currentMerchantStand?.transactionsCount || 0}</span>
                </div>
              </div>

              {/* Bouton Export CSV Comptable */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={exportMerchantCSV}
                  className="h-9 px-4 rounded-full bg-[#14110F] hover:bg-[#2A2420] text-white text-xs font-heading font-bold flex items-center gap-2 transition"
                >
                  <Download className="w-3.5 h-3.5 text-[#FF6A2B]" />
                  <span>Exporter ma Fiche Comptable (CSV)</span>
                </button>
              </div>
            </div>

            {/* Tableau du Catalogue Produits & QR Codes */}
            <div className="bg-white rounded-[28px] border border-[#E5E0D8] p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-heading font-black text-[#14110F]">
                    Catalogue des Produits & Menus ({merchantProducts.length})
                  </h3>
                  <p className="text-xs text-[#7A7068]">
                    Chaque produit génère un code QR unique à imprimer sur votre comptoir.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleOpenAddProduct}
                  className="h-9 px-4 rounded-full bg-[#FF6A2B] hover:bg-[#e0561d] text-[#14110F] font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition active:scale-95"
                >
                  <Plus className="w-4 h-4 text-[#14110F]" />
                  <span>Ajouter un Produit</span>
                </button>
              </div>

              <div className="divide-y divide-[#E5E0D8]">
                {merchantProducts.map((item) => (
                  <div key={item.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] flex items-center justify-center font-heading font-black text-xs text-[#14110F] shrink-0">
                        {item.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-sm font-heading font-bold text-[#14110F]">{item.name}</h4>
                        <div className="text-xs text-[#7A7068] font-mono">
                          Stock: {item.currentStock} • Catégorie: {item.category}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      <div className="text-right">
                        <div className="text-sm font-mono font-bold text-[#14110F]">{formatUSD(item.priceUSD)}</div>
                        <div className="text-[10px] text-[#7A7068] font-mono">≈ {formatCDF(item.priceUSD)}</div>
                      </div>

                      {/* Bouton QR Code Unique du produit */}
                      <button
                        type="button"
                        onClick={() => setQrProductModal(item)}
                        className="h-8 px-3 rounded-full bg-[#14110F] hover:bg-[#2A2420] text-white text-xs font-bold flex items-center gap-1.5"
                        title="Afficher et imprimer le code QR de ce produit"
                      >
                        <QrCode className="w-3.5 h-3.5 text-[#FF6A2B]" />
                        <span>Code QR</span>
                      </button>

                      {/* Modifier */}
                      <button
                        type="button"
                        onClick={() => handleOpenEditProduct(item)}
                        className="w-8 h-8 rounded-full bg-[#FAF8F5] hover:bg-[#F3ECE2] border border-[#E5E0D8] text-[#14110F] flex items-center justify-center"
                        title="Modifier"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {/* Supprimer */}
                      <button
                        type="button"
                        onClick={() => deleteMerchantProduct(item.id)}
                        className="w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* ONGLET 6 : ESPACE ORGANISATEUR (ORGANIZER) */}
        {/* ---------------------------------------------------- */}
        {activeClientTab === 'ORGANIZER' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Header Organisateur */}
            <div className="bg-white rounded-[28px] border border-[#E5E0D8] p-6 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E5F0F7] text-[#0E5A8A] text-[10px] font-bold uppercase font-mono mb-1">
                    <Calendar className="w-3 h-3" />
                    <span>Supervision Organisateur</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-heading font-black text-[#14110F]">
                    {activeOrganizerEvent?.title}
                  </h2>
                  <p className="text-xs text-[#7A7068]">
                    Lieu : {activeOrganizerEvent?.location} • {activeOrganizerEvent?.dateStr}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => openPublishModal()}
                    className="h-10 px-4 rounded-full bg-[#FF6A2B] hover:bg-[#e0561d] text-[#14110F] font-heading font-bold text-xs uppercase tracking-wider transition active:scale-95 flex items-center gap-1.5 shadow-xs"
                  >
                    <Plus className="w-4 h-4 text-[#14110F]" />
                    <span>+ Créer un Événement</span>
                  </button>
                </div>
              </div>

              {/* Lien de Paiement Direct Officiel */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] space-y-2">
                <span className="text-[10px] font-bold uppercase text-[#7A7068] block">Lien Direct de Billetterie & Paiement</span>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="font-mono text-xs text-[#14110F] truncate bg-white px-3 py-1.5 rounded-xl border border-[#E5E0D8]">
                    https://vuka.cd/event/{activeOrganizerEvent?.id}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(`https://vuka.cd/event/${activeOrganizerEvent?.id}`);
                        setCopiedLink(true);
                        setTimeout(() => setCopiedLink(false), 2000);
                      }}
                      className="h-8 px-3 rounded-full bg-white border border-[#E5E0D8] text-xs font-bold text-[#14110F] flex items-center gap-1"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5 text-[#167A42]" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedLink ? 'Copié' : 'Copier'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const url = encodeURIComponent(`https://vuka.cd/event/${activeOrganizerEvent?.id}`);
                        window.open(`https://api.whatsapp.com/send?text=Découvrez l'événement ${activeOrganizerEvent?.title} : ${url}`, '_blank');
                      }}
                      className="h-8 px-3 rounded-full bg-[#167A42] text-white text-xs font-bold flex items-center gap-1"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Chiffres Globaux de l'Événement */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8]">
                  <span className="text-[10px] uppercase text-[#7A7068] block font-mono">Billets Vendus</span>
                  <span className="text-lg font-heading font-black text-[#14110F]">{activeOrganizerEvent?.ticketsSold || 0}</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8]">
                  <span className="text-[10px] uppercase text-[#7A7068] block font-mono">CA Billetterie</span>
                  <span className="text-lg font-heading font-black text-[#FF6A2B]">{formatUSD(activeOrganizerEvent?.revenueUSD || 0)}</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8]">
                  <span className="text-[10px] uppercase text-[#7A7068] block font-mono">Commissions Stands</span>
                  <span className="text-lg font-heading font-black text-[#167A42]">{formatUSD(totalStandsCommissionUSD)}</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8]">
                  <span className="text-[10px] uppercase text-[#7A7068] block font-mono">Abonnés Événement</span>
                  <span className="text-lg font-heading font-black text-[#14110F]">{activeOrganizerEvent?.organizerFollowers || 248}</span>
                </div>
              </div>

              {/* Bouton Export Données Organisation */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={exportOrganizerCSV}
                  className="h-9 px-4 rounded-full bg-[#14110F] hover:bg-[#2A2420] text-white text-xs font-heading font-bold flex items-center gap-2 transition"
                >
                  <Download className="w-3.5 h-3.5 text-[#FF6A2B]" />
                  <span>Exporter les Données Organisation (CSV)</span>
                </button>
              </div>
            </div>

            {/* Gestion des Marchands & Commissions */}
            <div className="bg-white rounded-[28px] border border-[#E5E0D8] p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-heading font-black text-[#14110F]">
                    Marchands Partenaires & Ventilation Financière
                  </h3>
                  <p className="text-xs text-[#7A7068]">
                    Modifiez le pourcentage de commission attendu pour calculer automatiquement les montants à reverser aux marchands et ce qui reste pour l'organisation.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setAddStandModalOpen(true)}
                  className="h-9 px-4 rounded-full bg-[#14110F] text-white font-heading font-bold text-xs flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4 text-[#FF6A2B]" />
                  <span>+ Associer un Marchand</span>
                </button>
              </div>

              {/* Tableau Financier des Marchands */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="border-b border-[#E5E0D8] text-[10px] uppercase font-mono text-[#7A7068]">
                    <tr>
                      <th className="py-2.5 pr-3">Stand & Contact</th>
                      <th className="py-2.5 px-3">Ventes Brutes</th>
                      <th className="py-2.5 px-3">Taux (%)</th>
                      <th className="py-2.5 px-3">Part Organisation</th>
                      <th className="py-2.5 px-3">Net à Reverser</th>
                      <th className="py-2.5 pl-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E0D8]">
                    {eventStands.map((s) => {
                      const commRate = s.commissionPercent || 10;
                      const commAmt = Math.round((s.totalSalesUSD * (commRate / 100)) * 100) / 100;
                      const netPayout = s.totalSalesUSD - commAmt;

                      return (
                        <tr key={s.id} className="hover:bg-[#FAF8F5]">
                          <td className="py-3 pr-3">
                            <div className="font-heading font-bold text-[#14110F]">{s.name}</div>
                            <div className="text-[10px] text-[#7A7068] font-mono">{s.ownerPhoneMpesa}</div>
                          </td>
                          <td className="py-3 px-3 font-mono font-bold text-[#14110F]">
                            {formatUSD(s.totalSalesUSD)}
                          </td>
                          <td className="py-3 px-3 font-mono">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={commRate}
                              onChange={(e) => updateStandCommissionRate(s.id, parseInt(e.target.value, 10) || 0)}
                              className="w-14 px-2 py-1 rounded-lg bg-white border border-[#E5E0D8] text-xs font-bold text-center focus:outline-none focus:border-[#FF6A2B]"
                            />
                            <span className="ml-1 text-[11px]">%</span>
                          </td>
                          <td className="py-3 px-3 font-mono font-bold text-[#167A42]">
                            {formatUSD(commAmt)}
                          </td>
                          <td className="py-3 px-3 font-mono font-bold text-[#FF6A2B]">
                            {formatUSD(netPayout)}
                          </td>
                          <td className="py-3 pl-3 text-right">
                            <button
                              type="button"
                              onClick={() => removeStandFromOrganizerEvent(activeOrganizerEvent?.id, s.id)}
                              className="text-red-500 hover:text-red-700 text-xs font-bold"
                            >
                              Retirer
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Total Récapitulatif Organisateur */}
              <div className="pt-4 border-t border-[#E5E0D8] flex flex-wrap items-center justify-between text-xs font-mono">
                <span className="text-[#7A7068]">
                  Total à reverser aux {eventStands.length} marchands : <strong>{formatUSD(totalStandsNetPayoutUSD)}</strong>
                </span>
                <span className="text-[#167A42] font-bold">
                  Bénéfice Organisation retenu : {formatUSD(totalStandsCommissionUSD)}
                </span>
              </div>
            </div>

          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* ONGLET 7 : PARAMÈTRES DU PROFIL (SETTINGS) */}
        {/* ---------------------------------------------------- */}
        {(activeClientTab === 'SETTINGS' || activeClientTab === 'PROFILE') && (
          <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
            <div className="p-6 sm:p-8 rounded-[28px] bg-white border border-[#E5E0D8] shadow-xs space-y-6">
              
              <div>
                <h2 className="text-xl font-heading font-black text-[#14110F]">
                  Paramètres du Compte
                </h2>
                <p className="text-xs text-[#7A7068]">
                  Modifiez vos coordonnées, votre photo de profil et vos préférences.
                </p>
              </div>

              {profileSuccessMsg && (
                <div className="p-3.5 rounded-2xl bg-[#E2F3E9] text-xs text-[#167A42] font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Modifications enregistrées avec succès !</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-[#14110F] uppercase tracking-wider block mb-1">
                    Nom Complet
                  </label>
                  <input
                    type="text"
                    required
                    value={editProfileName}
                    onChange={(e) => setEditProfileName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] text-xs font-bold text-[#14110F] focus:outline-none focus:border-[#FF6A2B]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#14110F] uppercase tracking-wider block mb-1">
                    Numéro de Téléphone (WhatsApp / Mobile Money)
                  </label>
                  <input
                    type="tel"
                    required
                    value={editProfilePhone}
                    onChange={(e) => setEditProfilePhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] text-xs font-mono font-bold text-[#14110F] focus:outline-none focus:border-[#FF6A2B]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#14110F] uppercase tracking-wider block mb-1">
                    Adresse Email
                  </label>
                  <input
                    type="email"
                    required
                    value={editProfileEmail}
                    onChange={(e) => setEditProfileEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] text-xs font-mono text-[#14110F] focus:outline-none focus:border-[#FF6A2B]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#14110F] uppercase tracking-wider block mb-1">
                    Photo de Profil / Avatar (URL ou Choix)
                  </label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={editProfileAvatar}
                    onChange={(e) => setEditProfileAvatar(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] text-xs font-mono text-[#14110F] focus:outline-none focus:border-[#FF6A2B]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-full bg-[#14110F] hover:bg-[#2A2420] text-white font-heading font-bold text-xs uppercase tracking-wider transition active:scale-95"
                  >
                    Enregistrer les Modifications
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* ONGLET 8 : VÉRIFICATION ANTI-FRAUDE */}
        {/* ---------------------------------------------------- */}
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

              <form 
                onSubmit={(e) => { e.preventDefault(); handleVerifyTicket(); }}
                className="space-y-4"
              >
                <div>
                  <label className="text-xs font-bold text-[#14110F] uppercase tracking-wider block mb-1.5 font-heading">
                    Référence du Billet ou Token Cryptographique
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-[#FF6A2B] absolute left-3.5 top-3.5" />
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

              {purchasedTickets.length > 0 && (
                <div className="pt-2 border-t border-[#E5E0D8]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A7068] block mb-2">
                    Tester avec l'un de vos billets :
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
                        className="px-3 py-1.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F3ECE2] border border-[#E5E0D8] text-xs font-mono font-bold text-[#14110F]"
                      >
                        {t.ticketId}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {verifyResult.searched && (
                <div className="pt-4 border-t border-[#E5E0D8] space-y-4">
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
                        <span>Billet Déjà Scanné aux Portes</span>
                      </div>
                      <p className="text-xs text-[#7A7068]">{verifyResult.details}</p>
                    </div>
                  )}

                  {verifyResult.status === 'NOT_FOUND' && (
                    <div className="p-4 rounded-2xl bg-[#FEF2F2] border border-[#DC2626]/30 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#DC2626]">
                        <X className="w-4 h-4 shrink-0" />
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

      </main>

      {/* ---------------------------------------------------- */}
      {/* MODAL QR CODE UNIQUE PRODUIT (Pour impression comptoir) */}
      {/* ---------------------------------------------------- */}
      {qrProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-sm bg-white rounded-[28px] border border-[#E5E0D8] p-6 text-center space-y-4">
            <button
              type="button"
              onClick={() => setQrProductModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#FAF8F5] text-[#14110F]"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase text-[#7A7068] block">Chevalet de Caisse Stand</span>
              <h3 className="text-lg font-heading font-black text-[#14110F]">{qrProductModal.name}</h3>
              <div className="text-xl font-heading font-black text-[#FF6A2B] font-mono mt-0.5">
                {formatUSD(qrProductModal.priceUSD)}
              </div>
            </div>

            {generatedProductQR && (
              <div className="p-4 bg-white rounded-2xl border border-[#E5E0D8] inline-block shadow-sm">
                <img src={generatedProductQR} alt={qrProductModal.name} className="w-56 h-56 mx-auto" />
              </div>
            )}

            <p className="text-[11px] text-[#7A7068]">
              Les festivaliers scannent ce code avec leur caméra dashboard pour payer directement.
            </p>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-full bg-[#14110F] text-white text-xs font-heading font-bold flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimer</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const txt = encodeURIComponent(`Payez ${qrProductModal.name} (${formatUSD(qrProductModal.priceUSD)}) sur le stand ${currentMerchantStand?.name} via VUKA Pay.`);
                  window.open(`https://api.whatsapp.com/send?text=${txt}`, '_blank');
                }}
                className="flex-1 py-2.5 rounded-full bg-[#167A42] text-white text-xs font-heading font-bold flex items-center justify-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* MODAL AJOUT / ÉDITION DE PRODUIT MARCHAND */}
      {/* ---------------------------------------------------- */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white rounded-[28px] border border-[#E5E0D8] p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E0D8]">
              <h3 className="text-base font-heading font-black text-[#14110F]">
                {editingProduct ? 'Modifier le Produit' : 'Ajouter un Produit au Stand'}
              </h3>
              <button
                type="button"
                onClick={() => setProductModalOpen(false)}
                className="p-1.5 rounded-full bg-[#FAF8F5] text-[#14110F]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#14110F] uppercase block mb-1">Nom du Produit / Service</label>
                <input
                  type="text"
                  required
                  placeholder="Ex : Maboké de Capitaine"
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] text-xs font-bold text-[#14110F] focus:outline-none focus:border-[#FF6A2B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-[#14110F] uppercase block mb-1">Prix (USD)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    required
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] text-xs font-mono font-bold text-[#14110F] focus:outline-none focus:border-[#FF6A2B]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#14110F] uppercase block mb-1">Stock Initial</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={prodStock}
                    onChange={(e) => setProdStock(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] text-xs font-mono font-bold text-[#14110F] focus:outline-none focus:border-[#FF6A2B]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#14110F] uppercase block mb-1">Catégorie</label>
                <select
                  value={prodCategory}
                  onChange={(e) => setProdCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] text-xs font-bold text-[#14110F] focus:outline-none focus:border-[#FF6A2B]"
                >
                  <option value="FOOD">Plat Chaud / Gastronomie</option>
                  <option value="DRINK">Boisson / Cocktail</option>
                  <option value="DESSERT">Dessert / Pâtisserie</option>
                  <option value="SNACK">Snack / Street-Food</option>
                </select>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="flex-1 py-2.5 rounded-full bg-white border border-[#E5E0D8] text-xs font-bold text-[#14110F]"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-full bg-[#FF6A2B] hover:bg-[#e0561d] text-[#14110F] text-xs font-heading font-black uppercase tracking-wider"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* MODAL ASSOCIER UN MARCHAND À L'ORGANISATEUR */}
      {/* ---------------------------------------------------- */}
      {addStandModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white rounded-[28px] border border-[#E5E0D8] p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E0D8]">
              <h3 className="text-base font-heading font-black text-[#14110F]">
                Associer un Stand Marchand
              </h3>
              <button
                type="button"
                onClick={() => setAddStandModalOpen(false)}
                className="p-1.5 rounded-full bg-[#FAF8F5] text-[#14110F]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddStandSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#14110F] uppercase block mb-1">Nom du Stand</label>
                <input
                  type="text"
                  required
                  placeholder="Ex : Mikate Dorés & Beignets"
                  value={newStandName}
                  onChange={(e) => setNewStandName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] text-xs font-bold text-[#14110F] focus:outline-none focus:border-[#FF6A2B]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#14110F] uppercase block mb-1">Numéro M-Pesa du Gérant</label>
                <input
                  type="tel"
                  required
                  placeholder="+243 81 234 56 78"
                  value={newStandPhone}
                  onChange={(e) => setNewStandPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] text-xs font-mono font-bold text-[#14110F] focus:outline-none focus:border-[#FF6A2B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-[#14110F] uppercase block mb-1">Commission (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={newStandCommission}
                    onChange={(e) => setNewStandCommission(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] text-xs font-mono font-bold text-[#14110F] focus:outline-none focus:border-[#FF6A2B]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#14110F] uppercase block mb-1">Catégorie</label>
                  <input
                    type="text"
                    value={newStandCategory}
                    onChange={(e) => setNewStandCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] text-xs font-bold text-[#14110F] focus:outline-none focus:border-[#FF6A2B]"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setAddStandModalOpen(false)}
                  className="flex-1 py-2.5 rounded-full bg-white border border-[#E5E0D8] text-xs font-bold text-[#14110F]"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-full bg-[#14110F] text-white text-xs font-heading font-bold"
                >
                  Ajouter au Festival
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* MODAL LIAISON RFID DU BILLET */}
      {/* ---------------------------------------------------- */}
      {ticketToLinkRFID && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-sm bg-white rounded-[28px] border border-[#E5E0D8] p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E0D8]">
              <h3 className="text-base font-heading font-black text-[#14110F]">
                Lier un Bracelet RFID
              </h3>
              <button
                type="button"
                onClick={() => setTicketToLinkRFID(null)}
                className="p-1.5 rounded-full bg-[#FAF8F5] text-[#14110F]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#7A7068]">
              Entrez le numéro gravé sur le bracelet remis aux portes pour l'associer à ce billet ({ticketToLinkRFID}).
            </p>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (ticketToLinkRFID) {
                linkRFIDToTicket(ticketToLinkRFID, ticketRfidInput.trim());
                setTicketToLinkRFID(null);
              }
            }} className="space-y-3">
              <input
                type="text"
                required
                placeholder="Ex : MIFARE-8842-CFW6"
                value={ticketRfidInput}
                onChange={(e) => setTicketRfidInput(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] text-xs font-mono font-bold text-[#14110F] focus:outline-none focus:border-[#FF6A2B]"
              />

              <button
                type="submit"
                className="w-full py-2.5 rounded-full bg-[#14110F] text-white text-xs font-heading font-bold uppercase tracking-wider"
              >
                Enregistrer l'Appairage RFID
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* MODAL HAUTE RÉSOLUTION PASS BILLET & WHATSAPP */}
      {/* ---------------------------------------------------- */}
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

            <div className="pt-6 border-t border-[#E5E0D8] mt-6 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  const text = encodeURIComponent(
                    `Billet Officiel VUKA Pay\nActivité : ${selectedTicketForPass.ticketName}\nTitulaire : ${selectedTicketForPass.buyerName}\nRéférence : ${selectedTicketForPass.ticketId}`
                  );
                  window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
                }}
                className="flex-1 py-3 rounded-full bg-[#167A42] hover:bg-[#126335] text-white font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Envoyer sur WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTicketForPass(null)}
                className="py-3 px-6 rounded-full bg-[#FAF8F5] text-[#14110F] font-heading font-bold text-xs uppercase tracking-wider"
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
