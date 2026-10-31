// Rôles utilisateurs du système VUKA Pay (conformes RBAC MOKILI M02)
export type UserRole = 
  | 'PUBLIC'          // Visiteur vitrine / Acheteur web
  | 'FESTIVALIER'     // Client porteur de billet & portefeuille cashless
  | 'STAND_MANAGER'   // Exposant / Vendeur sur caisse POS (Sunmi V2S ou Mobile)
  | 'STAFF_ACCESS'    // Agent de contrôle d'accès aux portes du festival
  | 'SUPER_ADMIN';    // Administrateur général / Espace Organisateurs

// Modes de vue principaux de la plateforme
export type AppViewMode = 
  | 'PUBLIC_LANDING'    // Landing page Weezevent/Ticketmaster publique
  | 'CLIENT_PORTAL'     // Espace client & Dashboard festivalier
  | 'BACKOFFICE_STAFF'; // Espace pro sécurisé (Caisse POS, Contrôle Accès, Admin)

// Modules du Backoffice Staff
export type BackofficeModule = 
  | 'POS_TERMINAL'     // Terminal de vente caisse 23 stands
  | 'ACCESS_CONTROL'   // Scanners portes & contrôle anti-passback
  | 'SUPER_ADMIN';     // Console Trésorerie, Payouts & Stocks

// Onglets du Dashboard Client Festivalier
export type ClientPortalTab = 
  | 'OVERVIEW'   // Suivi du parcours festivalier
  | 'TICKETS'    // Mes Billets & QR dynamique
  | 'WALLET'     // Mon Portefeuille & Recharges M-Pesa
  | 'HISTORY'    // Mes Commandes & Reçus
  | 'PROFILE';   // Mes Informations & Sécurité

// Compte utilisateur client festivalier
export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  walletId: string;
  createdAt: string;
  isVerified: boolean;
}

// Type de pass et billet
export type TicketCategory = '6_DAYS_PREMIUM' | 'DAY_PASS' | 'VIP_PASS';

export interface TicketDefinition {
  id: string;
  name: string;
  category: TicketCategory;
  priceUSD: number;
  description: string;
  dayNumber?: number; // 1 à 6
  dayLabel?: string;  // Ex: "Jour 1 - Grand Opening"
  color: string;      // Ex: "#EAB308", "#3B82F6", etc. (couleur bracelet)
  allottedQuantity: number;
  remainingQuantity: number;
  features: string[];
  isPopular?: boolean;
}

export interface PurchasedTicket {
  ticketId: string;
  ticketDefId: string;
  ticketName: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string;
  pricePaidUSD: number;
  purchaseDate: string;
  qrCodeToken: string;
  rfidTagId?: string; // ID bracelet MIFARE associé
  status: 'VALID' | 'SCANNED_ENTERED' | 'EXPIRED' | 'CANCELLED';
  scannedAt?: string;
  scannedByStaffId?: string;
}

// Menu et Produits d'un Stand
export interface MenuItem {
  id: string;
  standId: string;
  name: string;
  description: string;
  category: 'FOOD' | 'DRINK' | 'DESSERT' | 'SNACK';
  priceUSD: number;
  currentStock: number;
  initialStock: number;
  imageUrl?: string;
  isAvailable: boolean;
}

// Stand Exposant (23 stands au CFW6)
export interface Stand {
  id: string;
  number: number; // 1 à 23
  name: string;
  category: string; // Ex: "Grillades & Braisés", "Cocktails & Bières Locales", "Pâtisserie & Glaces", etc.
  ownerName: string;
  ownerPhoneMpesa: string; // Numéro M-Pesa pour payout B2C
  locationZone: string;   // Ex: "Zone A - Village Gastronomique", "Zone B - Bar Principal"
  totalSalesUSD: number;
  transactionsCount: number;
  isOnline: boolean;
  avatarUrl?: string;
}

// Demande de réassort de stock (soumise à validation stricte de l'administrateur)
export interface StockRequest {
  id: string;
  standId: string;
  standName: string;
  productId: string;
  productName: string;
  requestedQuantity: number;
  reason: string;
  requestedAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  processedAt?: string;
  processedByAdmin?: string;
  rejectionReason?: string;
}

// Transaction Cashless
export interface CashlessTransaction {
  id: string;
  timestamp: string;
  type: 'TOPUP' | 'PAYMENT' | 'REFUND' | 'COMMISSION_SPLIT' | 'PAYOUT';
  amountUSD: number;
  festivalierId?: string;
  festivalierPhone?: string;
  standId?: string;
  standName?: string;
  items?: {
    productId: string;
    productName: string;
    quantity: number;
    priceUSD: number;
  }[];
  paymentMethod: 'MPESA_C2B' | 'WALLET_QR_DYNAMIC' | 'WALLET_RFID' | 'MPESA_B2C_PAYOUT';
  // Split solidaire : 10% Fondation Congolicious / 90% Stand
  commissionAmountUSD: number; 
  merchantNetUSD: number;
  offlineGenerated?: boolean;
  isSynced: boolean;
  notes?: string;
}

// Portefeuille Festivalier
export interface FestivalierWallet {
  id: string;
  festivalierName: string;
  phone: string;
  balanceUSD: number;
  rfidTagId?: string;
  rfidColor?: string;
  linkedTicketId?: string;
  createdAt: string;
  lastTopUpDate?: string;
}

// Clôture Journalière
export interface DailyClosingReport {
  dayNumber: number;
  date: string;
  totalGrossUSD: number;
  totalCommissionUSD: number; // 10% Fondation
  totalPayoutDueUSD: number;  // 90% Standiers
  totalTransactions: number;
  standBreakdown: {
    standId: string;
    standName: string;
    grossSalesUSD: number;
    commissionUSD: number;
    netPayoutUSD: number;
    phoneMpesa: string;
    payoutStatus: 'PENDING' | 'EXECUTED';
    mpesaTransactionId?: string;
  }[];
  isClosed: boolean;
  closedAt?: string;
}

// Demande d'installation de stand exposant dans une activite
export interface StandApplication {
  id: string;
  eventId: string;
  eventName: string;
  standName: string;
  specialty: string;
  applicantName: string;
  applicantPhone: string;
  applicantEmail: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  allocatedStandNumber?: number;
}

// Types d'activités publiables sur VUKA Pay
export type ActivityType = 'Événement' | 'Donation' | 'Concert' | 'Festival' | 'Conférence';

// Événement ou activité publiée sur la plateforme VUKA Pay
export interface VukaPublishedEvent {
  id: string;
  title: string;
  subtitle?: string;
  category: string;
  activityType: ActivityType;
  badge: string;
  dateStr: string;
  location: string;
  city: string;
  priceFrom: string;
  status: 'OPEN' | 'COMING_SOON';
  ticketsSold: number;
  totalCapacity: number;
  revenueUSD: number;
  scannedEntries: number;
  organizerName?: string;
  isFeatured?: boolean;
  imageUrl?: string;
  description?: string;
  metrics?: { label: string; value: string }[];
  ctaText?: string;
}
