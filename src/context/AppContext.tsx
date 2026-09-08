import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserRole, 
  TicketDefinition, 
  PurchasedTicket, 
  Stand, 
  MenuItem, 
  FestivalierWallet, 
  CashlessTransaction, 
  StockRequest,
  DailyClosingReport
} from '../types';
import { 
  MOCK_TICKETS, 
  MOCK_STANDS, 
  MOCK_MENU_ITEMS, 
  INITIAL_FESTIVALIER_WALLET, 
  INITIAL_PURCHASED_TICKETS, 
  INITIAL_TRANSACTIONS 
} from '../data/mockData';

interface AppContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  
  // Billetterie
  tickets: TicketDefinition[];
  purchasedTickets: PurchasedTicket[];
  buyTicket: (ticketDefId: string, buyerName: string, buyerPhone: string, buyerEmail: string) => Promise<PurchasedTicket>;
  
  // Festivalier & Wallet
  wallet: FestivalierWallet;
  topUpWallet: (amountUSD: number, phoneMpesa: string) => Promise<boolean>;
  
  // Stands & Produits
  stands: Stand[];
  activeStandId: string;
  setActiveStandId: (standId: string) => void;
  menuItems: MenuItem[];
  getStandMenuItems: (standId: string) => MenuItem[];
  
  // Caisse POS & Vente
  processPOSSale: (
    standId: string, 
    cartItems: { product: MenuItem; quantity: number }[],
    paymentMethod: 'WALLET_QR_DYNAMIC' | 'WALLET_RFID' | 'MPESA_C2B',
    walletId?: string
  ) => Promise<{ success: boolean; error?: string; transaction?: CashlessTransaction }>;
  
  // Gestion stricte des stocks (CDC CFW6)
  stockRequests: StockRequest[];
  requestStockReorder: (standId: string, productId: string, requestedQuantity: number, reason: string) => void;
  approveStockRequest: (requestId: string) => void;
  rejectStockRequest: (requestId: string, reason?: string) => void;
  
  // Contrôle d'accès aux portes
  scanAccessTicket: (ticketCode: string, rfidTagId?: string) => {
    success: boolean;
    status: 'VALID' | 'ALREADY_USED' | 'INVALID';
    ticket?: PurchasedTicket;
    message: string;
  };
  totalAttendeesEntered: number;
  
  // Transactions & Trésorerie Maître
  transactions: CashlessTransaction[];
  masterTreasuryUSD: number;
  totalFoundationCommissionUSD: number;
  totalMerchantNetUSD: number;
  
  // Clôture & Payouts M-Pesa B2C
  dailyClosingReports: DailyClosingReport[];
  executeDailyClosingAndPayout: () => DailyClosingReport;
  
  // Résilience Offline-First (CDC v2)
  isOffline: boolean;
  setIsOffline: (offline: boolean) => void;
  offlineQueueCount: number;
  syncOfflineQueue: () => Promise<number>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation par rôle
  const [currentRole, setCurrentRole] = useState<UserRole>('PUBLIC');
  
  // Billetterie
  const [tickets, setTickets] = useState<TicketDefinition[]>(MOCK_TICKETS);
  const [purchasedTickets, setPurchasedTickets] = useState<PurchasedTicket[]>(() => {
    const saved = localStorage.getItem('vuka_purchased_tickets');
    return saved ? JSON.parse(saved) : INITIAL_PURCHASED_TICKETS;
  });

  // Wallet
  const [wallet, setWallet] = useState<FestivalierWallet>(() => {
    const saved = localStorage.getItem('vuka_festivalier_wallet');
    return saved ? JSON.parse(saved) : INITIAL_FESTIVALIER_WALLET;
  });

  // Stands & Menus
  const [stands, setStands] = useState<Stand[]>(() => {
    const saved = localStorage.getItem('vuka_stands');
    return saved ? JSON.parse(saved) : MOCK_STANDS;
  });
  const [activeStandId, setActiveStandId] = useState<string>('stand-1');
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('vuka_menu_items');
    return saved ? JSON.parse(saved) : MOCK_MENU_ITEMS;
  });

  // Demandes de réassort
  const [stockRequests, setStockRequests] = useState<StockRequest[]>(() => {
    const saved = localStorage.getItem('vuka_stock_requests');
    return saved ? JSON.parse(saved) : [
      {
        id: 'REQ-101',
        standId: 'stand-1',
        standName: 'Chez Ntemba Grill & Braises',
        productId: 'prod-101',
        productName: 'Capitaine Braisé Entier (1kg)',
        requestedQuantity: 20,
        reason: 'Forte affluence prévue ce soir, stock restant critique (24 pcs).',
        requestedAt: new Date(Date.now() - 3600000).toISOString(),
        status: 'PENDING'
      }
    ];
  });

  // Transactions
  const [transactions, setTransactions] = useState<CashlessTransaction[]>(() => {
    const saved = localStorage.getItem('vuka_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  // Clôtures
  const [dailyClosingReports, setDailyClosingReports] = useState<DailyClosingReport[]>([]);

  // Mode Offline-First
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [offlineQueue, setOfflineQueue] = useState<CashlessTransaction[]>([]);

  // Synchronisation avec localStorage
  useEffect(() => {
    localStorage.setItem('vuka_purchased_tickets', JSON.stringify(purchasedTickets));
  }, [purchasedTickets]);

  useEffect(() => {
    localStorage.setItem('vuka_festivalier_wallet', JSON.stringify(wallet));
  }, [wallet]);

  useEffect(() => {
    localStorage.setItem('vuka_stands', JSON.stringify(stands));
  }, [stands]);

  useEffect(() => {
    localStorage.setItem('vuka_menu_items', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('vuka_stock_requests', JSON.stringify(stockRequests));
  }, [stockRequests]);

  useEffect(() => {
    localStorage.setItem('vuka_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Achat de billet en ligne (Module VUKA Ticket)
  const buyTicket = async (
    ticketDefId: string, 
    buyerName: string, 
    buyerPhone: string, 
    buyerEmail: string
  ): Promise<PurchasedTicket> => {
    const ticketDef = tickets.find(t => t.id === ticketDefId);
    if (!ticketDef) throw new Error("Billet introuvable");

    // Simuler latence réseau M-Pesa C2B
    await new Promise(r => setTimeout(r, 600));

    const ticketId = `TCK-CFW6-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPurchasedTicket: PurchasedTicket = {
      ticketId,
      ticketDefId,
      ticketName: ticketDef.name,
      buyerName,
      buyerPhone,
      buyerEmail,
      pricePaidUSD: ticketDef.priceUSD,
      purchaseDate: new Date().toISOString(),
      qrCodeToken: `VUKA-${ticketId}-${Date.now()}`,
      status: 'VALID'
    };

    setPurchasedTickets(prev => [newPurchasedTicket, ...prev]);

    // Mettre à jour la quantité restante
    setTickets(prev => prev.map(t => {
      if (t.id === ticketDefId) {
        return { ...t, remainingQuantity: Math.max(0, t.remainingQuantity - 1) };
      }
      return t;
    }));

    // Tracer la transaction de billetterie
    const newTx: CashlessTransaction = {
      id: `TXN-TCK-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
      type: 'PAYMENT',
      amountUSD: ticketDef.priceUSD,
      festivalierPhone: buyerPhone,
      paymentMethod: 'MPESA_C2B',
      commissionAmountUSD: 0, // Les billets vont directement au compte organisateur
      merchantNetUSD: ticketDef.priceUSD,
      isSynced: true,
      notes: `Achat billetterie : ${ticketDef.name}`
    };
    setTransactions(prev => [newTx, ...prev]);

    return newPurchasedTicket;
  };

  // Recharge du portefeuille numérique (Module VUKA Pay)
  const topUpWallet = async (amountUSD: number, phoneMpesa: string): Promise<boolean> => {
    if (amountUSD <= 0) return false;

    // Simulation confirmation M-Pesa
    await new Promise(r => setTimeout(r, 700));

    setWallet(prev => ({
      ...prev,
      balanceUSD: prev.balanceUSD + amountUSD,
      lastTopUpDate: new Date().toISOString()
    }));

    const newTx: CashlessTransaction = {
      id: `TXN-TOP-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
      type: 'TOPUP',
      amountUSD,
      festivalierId: wallet.id,
      festivalierPhone: phoneMpesa,
      paymentMethod: 'MPESA_C2B',
      commissionAmountUSD: 0,
      merchantNetUSD: amountUSD,
      isSynced: !isOffline,
      notes: `Recharge M-Pesa instantanée`
    };

    setTransactions(prev => [newTx, ...prev]);
    return true;
  };

  // Récupérer les items du stand actif
  const getStandMenuItems = (standId: string) => {
    return menuItems.filter(m => m.standId === standId);
  };

  // Encaissement en Caisse Marchande POS (Sunmi V2S / Mobile Vendeur)
  const processPOSSale = async (
    standId: string, 
    cartItems: { product: MenuItem; quantity: number }[],
    paymentMethod: 'WALLET_QR_DYNAMIC' | 'WALLET_RFID' | 'MPESA_C2B',
    walletId?: string
  ): Promise<{ success: boolean; error?: string; transaction?: CashlessTransaction }> => {
    const stand = stands.find(s => s.id === standId);
    if (!stand) return { success: false, error: "Stand introuvable" };

    const totalAmount = cartItems.reduce((acc, item) => acc + (item.product.priceUSD * item.quantity), 0);
    if (totalAmount <= 0) return { success: false, error: "Panier vide" };

    // Vérifier les stocks
    for (const item of cartItems) {
      const current = menuItems.find(m => m.id === item.product.id);
      if (!current || current.currentStock < item.quantity) {
        return { success: false, error: `Stock insuffisant pour : ${item.product.name}` };
      }
    }

    // Si paiement par wallet, vérifier le solde
    if (paymentMethod === 'WALLET_QR_DYNAMIC' || paymentMethod === 'WALLET_RFID') {
      if (wallet.balanceUSD < totalAmount) {
        return { success: false, error: `Solde insuffisant ($${wallet.balanceUSD.toFixed(2)} disponible, requis $${totalAmount.toFixed(2)}). Veuillez recharger votre VUKA Wallet.` };
      }
      // Déduire du wallet
      setWallet(prev => ({
        ...prev,
        balanceUSD: prev.balanceUSD - totalAmount
      }));
    }

    // Calcul du split solidaire automatique (CDC CFW6 Section 4) :
    // 10% Fondation Congolicious / 90% Net Standier
    const commissionAmountUSD = Number((totalAmount * 0.10).toFixed(2));
    const merchantNetUSD = Number((totalAmount - commissionAmountUSD).toFixed(2));

    // Décrémenter les stocks
    setMenuItems(prev => prev.map(m => {
      const inCart = cartItems.find(c => c.product.id === m.id);
      if (inCart) {
        return {
          ...m,
          currentStock: Math.max(0, m.currentStock - inCart.quantity),
          isAvailable: m.currentStock - inCart.quantity > 0
        };
      }
      return m;
    }));

    // Mettre à jour les ventes du stand
    setStands(prev => prev.map(s => {
      if (s.id === standId) {
        return {
          ...s,
          totalSalesUSD: Number((s.totalSalesUSD + totalAmount).toFixed(2)),
          transactionsCount: s.transactionsCount + 1
        };
      }
      return s;
    }));

    // Créer la transaction
    const newTx: CashlessTransaction = {
      id: `TXN-POS-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
      type: 'PAYMENT',
      amountUSD: totalAmount,
      festivalierId: walletId || wallet.id,
      festivalierPhone: wallet.phone,
      standId,
      standName: stand.name,
      items: cartItems.map(c => ({
        productId: c.product.id,
        productName: c.product.name,
        quantity: c.quantity,
        priceUSD: c.product.priceUSD
      })),
      paymentMethod,
      commissionAmountUSD,
      merchantNetUSD,
      offlineGenerated: isOffline,
      isSynced: !isOffline,
      notes: isOffline ? 'Encaissé en mode Offline local' : 'Encaissé en direct'
    };

    if (isOffline) {
      setOfflineQueue(prev => [newTx, ...prev]);
    }

    setTransactions(prev => [newTx, ...prev]);
    return { success: true, transaction: newTx };
  };

  // Demande de réassort de stock (soumise à approbation Super Admin)
  const requestStockReorder = (
    standId: string, 
    productId: string, 
    requestedQuantity: number, 
    reason: string
  ) => {
    const stand = stands.find(s => s.id === standId);
    const product = menuItems.find(m => m.id === productId);
    if (!stand || !product) return;

    const newRequest: StockRequest = {
      id: `REQ-${Math.floor(100 + Math.random() * 900)}`,
      standId,
      standName: stand.name,
      productId,
      productName: product.name,
      requestedQuantity,
      reason,
      requestedAt: new Date().toISOString(),
      status: 'PENDING'
    };

    setStockRequests(prev => [newRequest, ...prev]);
  };

  // Validation administrative de réassort
  const approveStockRequest = (requestId: string) => {
    const req = stockRequests.find(r => r.id === requestId);
    if (!req) return;

    // Augmenter le stock du produit
    setMenuItems(prev => prev.map(m => {
      if (m.id === req.productId) {
        return {
          ...m,
          currentStock: m.currentStock + req.requestedQuantity,
          initialStock: m.initialStock + req.requestedQuantity,
          isAvailable: true
        };
      }
      return m;
    }));

    // Marquer la requête comme approuvée
    setStockRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        return {
          ...r,
          status: 'APPROVED',
          processedAt: new Date().toISOString(),
          processedByAdmin: 'Direction CFW6 / Fondation'
        };
      }
      return r;
    }));
  };

  // Rejet administratif de réassort
  const rejectStockRequest = (requestId: string, reason?: string) => {
    setStockRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        return {
          ...r,
          status: 'REJECTED',
          processedAt: new Date().toISOString(),
          processedByAdmin: 'Direction CFW6 / Fondation',
          rejectionReason: reason || 'Capacité de stock central atteinte ou quota dépassé'
        };
      }
      return r;
    }));
  };

  // Contrôle d'accès aux portes
  const scanAccessTicket = (ticketCode: string, rfidTagId?: string): {
    success: boolean;
    status: 'VALID' | 'ALREADY_USED' | 'INVALID';
    ticket?: PurchasedTicket;
    message: string;
  } => {
    const ticket = purchasedTickets.find(t => 
      t.ticketId === ticketCode || 
      t.qrCodeToken === ticketCode ||
      (t.rfidTagId && t.rfidTagId === ticketCode)
    );

    if (!ticket) {
      return {
        success: false,
        status: 'INVALID',
        message: 'Billet non reconnu dans la base centrale VUKA.'
      };
    }

    if (ticket.status === 'SCANNED_ENTERED') {
      return {
        success: false,
        status: 'ALREADY_USED',
        ticket,
        message: `ALERTE FRAUDE : Ce billet a déjà été scanné à ${ticket.scannedAt ? new Date(ticket.scannedAt).toLocaleTimeString() : 'une entrée précédente'}.`
      };
    }

    // Valider l'entrée et lier le bracelet RFID si fourni
    const updatedTicket: PurchasedTicket = {
      ...ticket,
      status: 'SCANNED_ENTERED',
      scannedAt: new Date().toISOString(),
      rfidTagId: rfidTagId || ticket.rfidTagId || `RFID-DESFIRE-${Math.floor(1000 + Math.random() * 9000)}`
    };

    setPurchasedTickets(prev => prev.map(t => t.ticketId === ticket.ticketId ? updatedTicket : t));

    return {
      success: true,
      status: 'VALID',
      ticket: updatedTicket,
      message: `Entrée autorisée : ${updatedTicket.ticketName} (${updatedTicket.buyerName})`
    };
  };

  // Jauge en direct
  const totalAttendeesEntered = purchasedTickets.filter(t => t.status === 'SCANNED_ENTERED').length;

  // Calculs trésorerie maître
  const masterTreasuryUSD = transactions
    .filter(t => t.type === 'TOPUP')
    .reduce((sum, t) => sum + t.amountUSD, 0);

  const totalFoundationCommissionUSD = transactions
    .filter(t => t.type === 'PAYMENT' && t.commissionAmountUSD > 0)
    .reduce((sum, t) => sum + t.commissionAmountUSD, 0);

  const totalMerchantNetUSD = transactions
    .filter(t => t.type === 'PAYMENT' && t.merchantNetUSD > 0)
    .reduce((sum, t) => sum + t.merchantNetUSD, 0);

  // Clôture journalière et Payouts groupés (CDC CFW6 Section 4)
  const executeDailyClosingAndPayout = (): DailyClosingReport => {
    const report: DailyClosingReport = {
      dayNumber: 1,
      date: new Date().toLocaleDateString('fr-FR'),
      totalGrossUSD: totalFoundationCommissionUSD + totalMerchantNetUSD,
      totalCommissionUSD: totalFoundationCommissionUSD,
      totalPayoutDueUSD: totalMerchantNetUSD,
      totalTransactions: transactions.length,
      standBreakdown: stands.map(s => {
        const gross = s.totalSalesUSD;
        const comm = Number((gross * 0.10).toFixed(2));
        const net = Number((gross - comm).toFixed(2));
        return {
          standId: s.id,
          standName: s.name,
          grossSalesUSD: gross,
          commissionUSD: comm,
          netPayoutUSD: net,
          phoneMpesa: s.ownerPhoneMpesa,
          payoutStatus: 'EXECUTED',
          mpesaTransactionId: `MP-B2C-${Math.floor(100000 + Math.random() * 900000)}`
        };
      }),
      isClosed: true,
      closedAt: new Date().toISOString()
    };

    setDailyClosingReports(prev => [report, ...prev]);
    return report;
  };

  // Synchronisation des transactions hors-ligne (Starlink simulation)
  const syncOfflineQueue = async (): Promise<number> => {
    if (offlineQueue.length === 0) return 0;
    
    // Simuler latence de liaison Starlink
    await new Promise(r => setTimeout(r, 1200));
    
    const count = offlineQueue.length;
    setTransactions(prev => prev.map(t => ({ ...t, isSynced: true })));
    setOfflineQueue([]);
    return count;
  };

  return (
    <AppContext.Provider value={{
      currentRole,
      setCurrentRole,
      tickets,
      purchasedTickets,
      buyTicket,
      wallet,
      topUpWallet,
      stands,
      activeStandId,
      setActiveStandId,
      menuItems,
      getStandMenuItems,
      processPOSSale,
      stockRequests,
      requestStockReorder,
      approveStockRequest,
      rejectStockRequest,
      scanAccessTicket,
      totalAttendeesEntered,
      transactions,
      masterTreasuryUSD,
      totalFoundationCommissionUSD,
      totalMerchantNetUSD,
      dailyClosingReports,
      executeDailyClosingAndPayout,
      isOffline,
      setIsOffline,
      offlineQueueCount: offlineQueue.length,
      syncOfflineQueue
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
};
