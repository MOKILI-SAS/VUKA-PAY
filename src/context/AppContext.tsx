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
  DailyClosingReport,
  AppViewMode,
  BackofficeModule,
  ClientPortalTab,
  UserAccount,
  VukaPublishedEvent,
  ActivityType
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
  // Navigation globale VUKA
  appViewMode: AppViewMode;
  setAppViewMode: (mode: AppViewMode) => void;
  activeBackofficeModule: BackofficeModule;
  setActiveBackofficeModule: (module: BackofficeModule) => void;
  activeClientTab: ClientPortalTab;
  setActiveClientTab: (tab: ClientPortalTab) => void;

  // Authentification & Compte Client
  currentUser: UserAccount | null;
  setCurrentUser: (user: UserAccount | null) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'LOGIN' | 'REGISTER';
  setAuthModalMode: (mode: 'LOGIN' | 'REGISTER') => void;
  isOrganizerAuthMode: boolean;
  setIsOrganizerAuthMode: (val: boolean) => void;
  openOrganizerLogin: () => void;
  registerUser: (name: string, email: string, phone: string, password?: string) => Promise<UserAccount>;
  loginUser: (identifier: string, password?: string) => Promise<UserAccount>;
  logoutUser: () => void;

  // Rôle historique / rétrocompatibilité
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  
  // Billetterie & Activités
  tickets: TicketDefinition[];
  purchasedTickets: PurchasedTicket[];
  buyTicket: (ticketDefId: string, buyerName: string, buyerPhone: string, buyerEmail: string) => Promise<PurchasedTicket>;
  publishedEvents: VukaPublishedEvent[];
  addOrganizerEvent: (newEvent: Omit<VukaPublishedEvent, 'id' | 'ticketsSold' | 'revenueUSD' | 'scannedEntries'>) => void;
  
  // Publication d'Activités & Filtres
  isPublishModalOpen: boolean;
  setIsPublishModalOpen: (open: boolean) => void;
  publishPreselectedType: ActivityType | null;
  openPublishModal: (preselectedType?: ActivityType) => void;
  selectedActivityTypeFilter: string;
  setSelectedActivityTypeFilter: (filter: string) => void;
  
  // Festivalier & Wallet
  wallet: FestivalierWallet;
  topUpWallet: (amountUSD: number, phoneMpesa: string) => Promise<boolean>;
  refundWalletBalance: (phoneMpesa: string) => Promise<{ success: boolean; amountRefundedUSD: number }>;
  linkRFIDToWallet: (rfidTagId: string) => void;
  
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

const INITIAL_PUBLISHED_EVENTS: VukaPublishedEvent[] = [
  {
    id: 'cfw-6',
    title: 'Congo Food Week — Saison 6',
    subtitle: 'La Grande Célébration Culinaire.',
    category: 'GASTRONOMIE & BRAISES',
    activityType: 'Festival',
    badge: 'FESTIVAL PHARE DU MOMENT',
    dateStr: '22 au 27 Septembre 2026',
    location: 'Académie des Beaux-Arts',
    city: 'Kinshasa, Gombe',
    priceFrom: 'Dès 5 $ (13 750 CDF)',
    status: 'OPEN',
    ticketsSold: 1420,
    totalCapacity: 5000,
    revenueUSD: 18450,
    scannedEntries: 840,
    organizerName: 'Fondation Congolicious',
    isFeatured: true,
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
    description: 'Le grand rendez-vous culinaire de Kinshasa avec 23 stands gastronomiques, maîtres des braises, concerts live sous les étoiles et paiement 100% cashless sans contact.',
    metrics: [
      { label: 'Stands Gastronomiques', value: '23 Stands' },
      { label: 'Soirées Live', value: '6 Soirées' },
      { label: 'Don Solidaire', value: '10% Fondation' }
    ],
    ctaText: 'Acheter un Pass (Dès 5$)'
  },
  {
    id: 'kin-jazz',
    title: 'Kinshasa Jazz & Rumba Festival',
    subtitle: 'Légendes de la Rumba & Sessions Jazz.',
    category: 'MUSIQUE LIVE & RUMBA',
    activityType: 'Concert',
    badge: 'CONCERT GÉANT LIVE',
    dateStr: '10 au 12 Octobre 2026',
    location: 'Théâtre de Verdure • Mont Ngaliema',
    city: 'Kinshasa',
    priceFrom: 'Dès 15 $ (41 250 CDF)',
    status: 'OPEN',
    ticketsSold: 420,
    totalCapacity: 2500,
    revenueUSD: 6300,
    scannedEntries: 0,
    organizerName: 'Kinshasa Jazz Club',
    isFeatured: true,
    imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=800&q=80',
    description: 'Trois soirées d’exception au Théâtre de Verdure célébrant l’âge d’or et la modernité de la rumba congolaise et du jazz africain en plein air.',
    metrics: [
      { label: 'Artistes & Orchestres', value: '18 Groupes' },
      { label: 'Scène de Plein Air', value: 'Verdure' },
      { label: 'Contrôle Express', value: 'NFC 500ms' }
    ],
    ctaText: 'Réserver mon Billet'
  },
  {
    id: 'afrotech-kin',
    title: 'AfroTech Summit Kinshasa 2026',
    subtitle: 'Le Carrefour Panafricain de l\'Innovation.',
    category: 'TECH, FINTECH & STARTUPS',
    activityType: 'Conférence',
    badge: 'CONFÉRENCE INTERNATIONALE',
    dateStr: '05 au 06 Novembre 2026',
    location: 'Pullman Grand Hôtel Kinshasa',
    city: 'Kinshasa, Gombe',
    priceFrom: 'Dès 35 $ (96 250 CDF)',
    status: 'OPEN',
    ticketsSold: 310,
    totalCapacity: 800,
    revenueUSD: 10850,
    scannedEntries: 0,
    organizerName: 'AfroTech Network',
    isFeatured: true,
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
    description: 'Le sommet technologique majeur réunissant fondateurs de licornes, investisseurs capital-risque et décideurs institutionnels pour l\'accélération de l\'économie numérique en RDC.',
    metrics: [
      { label: 'Keynotes & Panels', value: '45 Speakers' },
      { label: 'Délégations', value: '14 Pays' },
      { label: 'Badges Digitaux', value: 'RFID MIFARE' }
    ],
    ctaText: 'Obtenir mon Badge Pro'
  },
  {
    id: 'cantines-fondation',
    title: 'Campagne Cantines Scolaires en Milieu Rural',
    subtitle: 'Nourrir un Enfant, Bâtir le Congo.',
    category: 'SOLIDARITÉ & IMPACT SOCIAL',
    activityType: 'Donation',
    badge: 'COLLECTE NATIONALE SOLIDAIRE',
    dateStr: 'Campagne Permanente 2026',
    location: 'Écoles Partenaires • Milieu Rural',
    city: 'RDC',
    priceFrom: 'Dès 2 $ (5 500 CDF)',
    status: 'OPEN',
    ticketsSold: 980,
    totalCapacity: 5000,
    revenueUSD: 7850,
    scannedEntries: 0,
    organizerName: 'Fondation Congolicious',
    isFeatured: true,
    imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80',
    description: '100% des fonds Mobile Money collectés financent directement des déjeuners nutritifs quotidiens pour les écoliers des zones défavorisées de la RDC.',
    metrics: [
      { label: 'Repas Scolaires Financés', value: '1 200 / jour' },
      { label: 'Écoles Soutenues', value: '12 Centres' },
      { label: 'Reversement Mobile Money', value: '100% Direct' }
    ],
    ctaText: 'Faire un Don M-Pesa'
  },
  {
    id: 'salon-resto-kin',
    title: 'Gala & Banquet des Ambassadeurs',
    subtitle: 'L\'Excellence Hôtelière & Diplomatique.',
    category: 'PRESTIGE, DÎNER & RÉSEAU',
    activityType: 'Événement',
    badge: 'ÉVÉNEMENT DE GALA',
    dateStr: '19 Septembre 2026 • 19h30',
    location: 'Hôtel Memling Kinshasa',
    city: 'Kinshasa, Gombe',
    priceFrom: 'Dès 50 $ (137 500 CDF)',
    status: 'OPEN',
    ticketsSold: 120,
    totalCapacity: 300,
    revenueUSD: 6000,
    scannedEntries: 0,
    organizerName: 'Club Hôtelier de Kinshasa',
    isFeatured: true,
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    description: 'Dîner gastronomique exclusif réunissant ambassadeurs, chefs étoilés et leaders d\'opinion pour célébrer le patrimoine culinaire et l\'hospitalité congolaise.',
    metrics: [
      { label: 'Chefs aux Fourneaux', value: '8 Maîtres' },
      { label: 'Coupe d\'Honneur', value: 'Inclus' },
      { label: 'Table Privée', value: 'VIP' }
    ],
    ctaText: 'Réserver ma Table'
  },
  {
    id: 'nuit-rumba',
    title: 'Les Nuits Royales de la Rumba',
    subtitle: 'Show Pyrotechnique & Méga Concert.',
    category: 'CONCERT GÉANT LIVE',
    activityType: 'Concert',
    badge: 'BIENTÔT EN VENTE',
    dateStr: '28 Novembre 2026',
    location: 'Stade des Martyrs',
    city: 'Kinshasa',
    priceFrom: 'Dès 10 $ (27 500 CDF)',
    status: 'COMING_SOON',
    ticketsSold: 0,
    totalCapacity: 15000,
    revenueUSD: 0,
    scannedEntries: 0,
    organizerName: 'Production Rumba Royale',
    isFeatured: true,
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
    description: 'Le rendez-vous mythique au Stade des Martyrs réunissant 15 000 festivaliers pour une soirée pyrotechnique et musicale inoubliable.',
    metrics: [
      { label: 'Jauge Festive', value: '15 000 Fans' },
      { label: 'Son & Lumière', value: 'Stade 360°' },
      { label: 'Paiement Boissons', value: 'VUKA Cashless' }
    ],
    ctaText: 'Me Notifier à l\'Ouverture'
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation globale VUKA
  const [appViewMode, setAppViewMode] = useState<AppViewMode>('PUBLIC_LANDING');
  const [activeBackofficeModule, setActiveBackofficeModule] = useState<BackofficeModule>('POS_TERMINAL');
  const [activeClientTab, setActiveClientTab] = useState<ClientPortalTab>('OVERVIEW');

  // Authentification & Compte Client (null par défaut : visiteur déconnecté)
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem('vuka_current_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return null; }
    }
    return null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [isOrganizerAuthMode, setIsOrganizerAuthMode] = useState<boolean>(false);

  const openOrganizerLogin = () => {
    setIsOrganizerAuthMode(true);
    setAuthModalMode('LOGIN');
    setIsAuthModalOpen(true);
  };

  // Catalogue des événements (support de la publication et du mini-hero)
  const [publishedEvents, setPublishedEvents] = useState<VukaPublishedEvent[]>(() => {
    const saved = localStorage.getItem('vuka_published_events');
    if (saved) {
      try {
        const parsed: VukaPublishedEvent[] = JSON.parse(saved);
        if (parsed.length >= 4 && parsed[0].activityType) {
          return parsed;
        }
      } catch (e) {
        // Fallback
      }
    }
    return INITIAL_PUBLISHED_EVENTS;
  });

  // Modal de Publication & Filtres d'Activités
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [publishPreselectedType, setPublishPreselectedType] = useState<ActivityType | null>(null);
  const [selectedActivityTypeFilter, setSelectedActivityTypeFilter] = useState<string>('Tous les types');

  const openPublishModal = (preselectedType?: ActivityType) => {
    setPublishPreselectedType(preselectedType || null);
    setIsPublishModalOpen(true);
  };

  const addOrganizerEvent = (newEventData: Omit<VukaPublishedEvent, 'id' | 'ticketsSold' | 'revenueUSD' | 'scannedEntries'>) => {
    const newEvent: VukaPublishedEvent = {
      ...newEventData,
      id: `evt-${Date.now().toString().slice(-6)}`,
      ticketsSold: 0,
      revenueUSD: 0,
      scannedEntries: 0
    };
    setPublishedEvents(prev => {
      const updated = [newEvent, ...prev];
      localStorage.setItem('vuka_published_events', JSON.stringify(updated));
      return updated;
    });
  };

  // Navigation par rôle (rétrocompatibilité)
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

    // Mettre à jour les statistiques de l'événement vedette
    setPublishedEvents(prev => prev.map(evt => {
      if (evt.id === 'cfw-6') {
        return {
          ...evt,
          ticketsSold: evt.ticketsSold + 1,
          revenueUSD: evt.revenueUSD + ticketDef.priceUSD
        };
      }
      return evt;
    }));

    // Si le festivalier n'était pas connecté, créer sa session automatiquement pour qu'il voie son billet
    if (!currentUser) {
      const createdUser: UserAccount = {
        id: `usr-${Date.now().toString().slice(-6)}`,
        name: buyerName,
        email: buyerEmail,
        phone: buyerPhone,
        walletId: `wal-${Date.now().toString().slice(-4)}`,
        createdAt: new Date().toISOString(),
        isVerified: true
      };
      setCurrentUser(createdUser);
      localStorage.setItem('vuka_current_user', JSON.stringify(createdUser));
    }

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

  // Authentification Festivalier / Création de compte
  const registerUser = async (name: string, email: string, phone: string, _password?: string): Promise<UserAccount> => {
    const newUser: UserAccount = {
      id: `usr-${Date.now().toString().slice(-6)}`,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      walletId: `wal-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
      isVerified: true
    };
    setCurrentUser(newUser);
    localStorage.setItem('vuka_current_user', JSON.stringify(newUser));

    setWallet(prev => ({
      ...prev,
      id: newUser.walletId,
      festivalierName: newUser.name,
      phone: newUser.phone
    }));

    setIsAuthModalOpen(false);
    setAppViewMode('CLIENT_PORTAL');
    setActiveClientTab('OVERVIEW');
    return newUser;
  };

  const loginUser = async (identifier: string, _password?: string): Promise<UserAccount> => {
    const isEmail = identifier.includes('@');
    const existingUser: UserAccount = {
      id: currentUser ? currentUser.id : `usr-${Date.now().toString().slice(-6)}`,
      name: currentUser ? currentUser.name : (isEmail ? identifier.split('@')[0] : 'Festivalier VUKA'),
      email: isEmail ? identifier : (currentUser?.email || 'festivalier@vuka.cd'),
      phone: !isEmail ? identifier : (currentUser?.phone || '+243 81 234 5678'),
      walletId: wallet.id,
      createdAt: currentUser?.createdAt || new Date().toISOString(),
      isVerified: true
    };
    setCurrentUser(existingUser);
    localStorage.setItem('vuka_current_user', JSON.stringify(existingUser));
    setIsAuthModalOpen(false);
    setAppViewMode('CLIENT_PORTAL');
    return existingUser;
  };

  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem('vuka_current_user');
    setAppViewMode('PUBLIC_LANDING');
  };

  // Demande de remboursement de solde restant (Cashless refund CDC)
  const refundWalletBalance = async (phoneMpesa: string): Promise<{ success: boolean; amountRefundedUSD: number }> => {
    if (wallet.balanceUSD <= 0) return { success: false, amountRefundedUSD: 0 };
    const refundAmount = wallet.balanceUSD;

    // Simulation virement M-Pesa B2C
    await new Promise(r => setTimeout(r, 900));

    setWallet(prev => ({
      ...prev,
      balanceUSD: 0
    }));

    const refundTx: CashlessTransaction = {
      id: `TXN-REF-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
      type: 'REFUND',
      amountUSD: refundAmount,
      festivalierId: wallet.id,
      festivalierPhone: phoneMpesa,
      paymentMethod: 'MPESA_B2C_PAYOUT',
      commissionAmountUSD: 0,
      merchantNetUSD: refundAmount,
      isSynced: true,
      notes: `Remboursement solde festivalier sur M-Pesa (${phoneMpesa})`
    };

    setTransactions(prev => [refundTx, ...prev]);
    return { success: true, amountRefundedUSD: refundAmount };
  };

  // Liaison de bracelet RFID physique MIFARE
  const linkRFIDToWallet = (rfidTagId: string) => {
    setWallet(prev => {
      const updated = { ...prev, rfidTagId: rfidTagId.trim() };
      localStorage.setItem('vuka_festivalier_wallet', JSON.stringify(updated));
      return updated;
    });
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
      appViewMode,
      setAppViewMode,
      activeBackofficeModule,
      setActiveBackofficeModule,
      activeClientTab,
      setActiveClientTab,
      currentUser,
      setCurrentUser,
      isAuthModalOpen,
      setIsAuthModalOpen,
      authModalMode,
      setAuthModalMode,
      isOrganizerAuthMode,
      setIsOrganizerAuthMode,
      openOrganizerLogin,
      registerUser,
      loginUser,
      logoutUser,
      currentRole,
      setCurrentRole,
      tickets,
      purchasedTickets,
      buyTicket,
      publishedEvents,
      addOrganizerEvent,
      isPublishModalOpen,
      setIsPublishModalOpen,
      publishPreselectedType,
      openPublishModal,
      selectedActivityTypeFilter,
      setSelectedActivityTypeFilter,
      wallet,
      topUpWallet,
      refundWalletBalance,
      linkRFIDToWallet,
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
