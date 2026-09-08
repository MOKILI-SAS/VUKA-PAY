import { TicketDefinition, Stand, MenuItem, FestivalierWallet, PurchasedTicket, CashlessTransaction } from '../types';

// Définitions des Pass Billetterie officielles selon Cahier des Charges v2 (Section 2.2)
export const MOCK_TICKETS: TicketDefinition[] = [
  {
    id: 'pass-6-days',
    name: 'Pass 6 Jours Intégral',
    category: '6_DAYS_PREMIUM',
    priceUSD: 25,
    description: 'Accès illimité aux 6 jours du festival avec Bracelet en Tissu Premium Noir.',
    color: '#1E293B', // Tissu Noir Premium
    allottedQuantity: 2500,
    remainingQuantity: 1840,
    features: [
      'Accès tous les jours (J1 à J6)',
      'Bracelet RFID Tissu Noir Collector',
      'Coupe-file entrées express',
      'Recharge wallet prioritaire'
    ],
    isPopular: true
  },
  {
    id: 'pass-j1',
    name: 'Pass Jour 1 — Grand Opening',
    category: 'DAY_PASS',
    priceUSD: 10,
    description: 'Cérémonie d’ouverture officielle, dégustations exclusives et show inaugural.',
    dayNumber: 1,
    dayLabel: 'Vendredi 10 Octobre',
    color: '#EAB300', // Jaune
    allottedQuantity: 2000,
    remainingQuantity: 1420,
    features: ['Accès Jour 1 de 12h à 01h', 'Bracelet RFID Jaune', 'Accès aux 23 stands gastronomiques']
  },
  {
    id: 'pass-j2',
    name: 'Pass Jour 2 — Soirée Acoustique & Jazz',
    category: 'DAY_PASS',
    priceUSD: 10,
    description: 'Ambiance lounge gastronomique, grillades kinois et performances acoustiques.',
    dayNumber: 2,
    dayLabel: 'Samedi 11 Octobre',
    color: '#3B82F6', // Bleu
    allottedQuantity: 1500,
    remainingQuantity: 890,
    features: ['Accès Jour 2 de 12h à 01h', 'Bracelet RFID Bleu', 'Accès scène lounge']
  },
  {
    id: 'pass-j3',
    name: 'Pass Jour 3 — Saveurs du Fleuve Congo',
    category: 'DAY_PASS',
    priceUSD: 12,
    description: 'Focus sur les poissons braisés, maboke du fleuve et concours culinaire.',
    dayNumber: 3,
    dayLabel: 'Dimanche 12 Octobre',
    color: '#10B981', // Vert
    allottedQuantity: 2500,
    remainingQuantity: 1950,
    features: ['Accès Jour 3 de 11h à 00h', 'Bracelet RFID Vert', 'Dégustations gratuites du jury']
  },
  {
    id: 'pass-j4',
    name: 'Pass Jour 4 — Afrobeat Street Food',
    category: 'DAY_PASS',
    priceUSD: 12,
    description: 'Grillades épicées, street-food internationale et DJ sets survoltés.',
    dayNumber: 4,
    dayLabel: 'Lundi 13 Octobre',
    color: '#EF4444', // Rouge
    allottedQuantity: 4000,
    remainingQuantity: 2600,
    features: ['Accès Jour 4 de 14h à 02h', 'Bracelet RFID Rouge', 'Accès dancefloor scène centrale']
  },
  {
    id: 'pass-j5',
    name: 'Pass Jour 5 — Grand Samedi Culinaire',
    category: 'DAY_PASS',
    priceUSD: 15,
    description: 'Le pic festif du weekend : chefs étoilés, mixologie et concerts géants.',
    dayNumber: 5,
    dayLabel: 'Mardi 14 Octobre',
    color: '#F97316', // Orange
    allottedQuantity: 5500,
    remainingQuantity: 3100,
    features: ['Accès Jour 5 de 11h à 03h', 'Bracelet RFID Orange', 'Concerts en plein air']
  },
  {
    id: 'pass-j6',
    name: 'Pass Jour 6 — Méga Clôture & Gala',
    category: 'DAY_PASS',
    priceUSD: 15,
    description: 'Grande fête finale de remise des prix culinaires et feux d’artifice.',
    dayNumber: 6,
    dayLabel: 'Mercredi 15 Octobre',
    color: '#8B5CF6', // Violet
    allottedQuantity: 7000,
    remainingQuantity: 4200,
    features: ['Accès Jour 6 de 11h à 04h', 'Bracelet RFID Violet', 'Show pyrotechnique & Concert']
  }
];

// Les 23 Stands du Congo Food Week 6 (selon CDC Technique Sunmi V2S)
export const MOCK_STANDS: Stand[] = [
  {
    id: 'stand-1',
    number: 1,
    name: 'Chez Ntemba Grill & Braises',
    category: 'Grillades & Poissons',
    ownerName: 'Maitre Jean-Paul Ntemba',
    ownerPhoneMpesa: '+243812345601',
    locationZone: 'Allée Gourmande — Stand 01',
    totalSalesUSD: 1420.00,
    transactionsCount: 88,
    isOnline: true
  },
  {
    id: 'stand-2',
    number: 2,
    name: 'Poulet Mayo King Kinshasa',
    category: 'Street Food Urbaine',
    ownerName: 'Christian Makiese',
    ownerPhoneMpesa: '+243812345602',
    locationZone: 'Village Central — Stand 02',
    totalSalesUSD: 1980.50,
    transactionsCount: 142,
    isOnline: true
  },
  {
    id: 'stand-3',
    number: 3,
    name: 'Saveurs du Kivu & Maboke',
    category: 'Tradition Congolaise',
    ownerName: 'Espérance Kavira',
    ownerPhoneMpesa: '+243812345603',
    locationZone: 'Allée Gourmande — Stand 03',
    totalSalesUSD: 1150.00,
    transactionsCount: 65,
    isOnline: true
  },
  {
    id: 'stand-4',
    number: 4,
    name: 'Barbaque 243 & Kamundele',
    category: 'Brochettes & BBQ',
    ownerName: 'Patrick Tshilombo',
    ownerPhoneMpesa: '+243812345604',
    locationZone: 'Village Central — Stand 04',
    totalSalesUSD: 1640.00,
    transactionsCount: 110,
    isOnline: true
  },
  {
    id: 'stand-5',
    number: 5,
    name: 'Cocktails Tropicaux & Jus de Bissap',
    category: 'Bar & Boissons Fraîches',
    ownerName: 'Sarah Mpoyi',
    ownerPhoneMpesa: '+243812345605',
    locationZone: 'Espace Rafraîchissement — Stand 05',
    totalSalesUSD: 2310.00,
    transactionsCount: 220,
    isOnline: true
  },
  {
    id: 'stand-6',
    number: 6,
    name: 'Malewa Chic & Fufu Royal',
    category: 'Cuisine du Terroir',
    ownerName: 'Mama Yvonne Bolenge',
    ownerPhoneMpesa: '+243812345606',
    locationZone: 'Allée Gourmande — Stand 06',
    totalSalesUSD: 980.00,
    transactionsCount: 54,
    isOnline: true
  },
  {
    id: 'stand-7',
    number: 7,
    name: 'Bière du Fleuve & Brasserie Kinois',
    category: 'Bières & Boissons',
    ownerName: 'Didier Kazadi',
    ownerPhoneMpesa: '+243812345607',
    locationZone: 'Espace Rafraîchissement — Stand 07',
    totalSalesUSD: 3120.00,
    transactionsCount: 310,
    isOnline: true
  },
  {
    id: 'stand-8',
    number: 8,
    name: 'Kalamú Burger & Frites Alloco',
    category: 'Fast-Food Fusion',
    ownerName: 'Cedric Ilunga',
    ownerPhoneMpesa: '+243812345608',
    locationZone: 'Village Central — Stand 08',
    totalSalesUSD: 1240.00,
    transactionsCount: 95,
    isOnline: true
  },
  {
    id: 'stand-9',
    number: 9,
    name: 'La Pâtisserie de Gombe',
    category: 'Desserts & Glaces',
    ownerName: 'Nathalie Vangu',
    ownerPhoneMpesa: '+243812345609',
    locationZone: 'Pavillon Sucré — Stand 09',
    totalSalesUSD: 780.00,
    transactionsCount: 72,
    isOnline: true
  },
  {
    id: 'stand-10',
    number: 10,
    name: 'Nganda VIP & Vins Sélectionnés',
    category: 'Cave & Lounge',
    ownerName: 'Hervé Bopili',
    ownerPhoneMpesa: '+243812345610',
    locationZone: 'Terrasse VIP — Stand 10',
    totalSalesUSD: 4100.00,
    transactionsCount: 85,
    isOnline: true
  },
  {
    id: 'stand-11',
    number: 11,
    name: 'Maboke du Fleuve & Chikwangue',
    category: 'Spécialités Fluviales',
    ownerName: 'Honoré Lokondo',
    ownerPhoneMpesa: '+243812345611',
    locationZone: 'Allée Gourmande — Stand 11',
    totalSalesUSD: 850.00,
    transactionsCount: 48,
    isOnline: true
  },
  {
    id: 'stand-12',
    number: 12,
    name: 'Congo Coffee & Chocolat de Virunga',
    category: 'Café & Douceurs',
    ownerName: 'Clarisse Mutombo',
    ownerPhoneMpesa: '+243812345612',
    locationZone: 'Pavillon Sucré — Stand 12',
    totalSalesUSD: 620.00,
    transactionsCount: 60,
    isOnline: true
  },
  {
    id: 'stand-13',
    number: 13,
    name: 'Shawarma & Falafel Kin-Beyrouth',
    category: 'Street Food Libano-Congolaise',
    ownerName: 'Tarek Haddad',
    ownerPhoneMpesa: '+243812345613',
    locationZone: 'Village Central — Stand 13',
    totalSalesUSD: 1490.00,
    transactionsCount: 115,
    isOnline: true
  },
  {
    id: 'stand-14',
    number: 14,
    name: 'Grillades du Bandundu',
    category: 'Viandes Braisées',
    ownerName: 'Felix Mavinga',
    ownerPhoneMpesa: '+243812345614',
    locationZone: 'Allée Gourmande — Stand 14',
    totalSalesUSD: 1040.00,
    transactionsCount: 68,
    isOnline: true
  },
  {
    id: 'stand-15',
    number: 15,
    name: 'Afro-Vegan Kinshasa',
    category: 'Cuisine Végétale & Bio',
    ownerName: 'Gloria Lumumba',
    ownerPhoneMpesa: '+243812345615',
    locationZone: 'Pavillon Bio — Stand 15',
    totalSalesUSD: 720.00,
    transactionsCount: 42,
    isOnline: true
  },
  {
    id: 'stand-16',
    number: 16,
    name: 'La Casa Tapas & Sangria Kinoise',
    category: 'Fusion Hispanique',
    ownerName: 'Marcello Costa',
    ownerPhoneMpesa: '+243812345616',
    locationZone: 'Terrasse VIP — Stand 16',
    totalSalesUSD: 1880.00,
    transactionsCount: 92,
    isOnline: true
  },
  {
    id: 'stand-17',
    number: 17,
    name: 'Délices de l’Équateur',
    category: 'Poisson d’Eau Douce',
    ownerName: 'Suzanne Bokungu',
    ownerPhoneMpesa: '+243812345617',
    locationZone: 'Allée Gourmande — Stand 17',
    totalSalesUSD: 930.00,
    transactionsCount: 51,
    isOnline: true
  },
  {
    id: 'stand-18',
    number: 18,
    name: 'Le Coin Crêpes & Waffles',
    category: 'Desserts & Street Snack',
    ownerName: 'Aline Zola',
    ownerPhoneMpesa: '+243812345618',
    locationZone: 'Pavillon Sucré — Stand 18',
    totalSalesUSD: 810.00,
    transactionsCount: 78,
    isOnline: true
  },
  {
    id: 'stand-19',
    number: 19,
    name: 'Pizza au Feu de Bois Kin',
    category: 'Pizzas Artisanales',
    ownerName: 'Gianni Masamba',
    ownerPhoneMpesa: '+243812345619',
    locationZone: 'Village Central — Stand 19',
    totalSalesUSD: 1760.00,
    transactionsCount: 105,
    isOnline: true
  },
  {
    id: 'stand-20',
    number: 20,
    name: 'Bar à Huîtres & Fruits de Mer Moanda',
    category: 'Fruits de Mer de l’Atlantique',
    ownerName: 'Capitaine Guy Malanda',
    ownerPhoneMpesa: '+243812345620',
    locationZone: 'Terrasse VIP — Stand 20',
    totalSalesUSD: 2450.00,
    transactionsCount: 62,
    isOnline: true
  },
  {
    id: 'stand-21',
    number: 21,
    name: 'Bissap & Tangawisi Bar Detox',
    category: 'Boissons Naturelles',
    ownerName: 'Bénédicte Kianza',
    ownerPhoneMpesa: '+243812345621',
    locationZone: 'Espace Rafraîchissement — Stand 21',
    totalSalesUSD: 990.00,
    transactionsCount: 135,
    isOnline: true
  },
  {
    id: 'stand-22',
    number: 22,
    name: 'Brochettes Suya & Épices Sahéliennes',
    category: 'Grillades Épicées',
    ownerName: 'Oumar Diallo',
    ownerPhoneMpesa: '+243812345622',
    locationZone: 'Allée Gourmande — Stand 22',
    totalSalesUSD: 1320.00,
    transactionsCount: 96,
    isOnline: true
  },
  {
    id: 'stand-23',
    number: 23,
    name: 'Glaces Tropicales & Sorbets Maracuja',
    category: 'Glaces Artisanales',
    ownerName: 'Priscille Lukusa',
    ownerPhoneMpesa: '+243812345623',
    locationZone: 'Pavillon Sucré — Stand 23',
    totalSalesUSD: 870.00,
    transactionsCount: 82,
    isOnline: true
  }
];

// Menus des stands avec gestion des stocks
export const MOCK_MENU_ITEMS: MenuItem[] = [
  // Stand 1: Chez Ntemba
  {
    id: 'prod-101',
    standId: 'stand-1',
    name: 'Capitaine Braisé Entier (1kg)',
    description: 'Poisson capitaine frais du fleuve, sauce aux épices locales et chikwangue.',
    category: 'FOOD',
    priceUSD: 15.00,
    currentStock: 24,
    initialStock: 40,
    isAvailable: true
  },
  {
    id: 'prod-102',
    standId: 'stand-1',
    name: 'Portion Brochettes de Bœuf (3 pcs)',
    description: 'Viande marinée façon kinois, piment vert et oignons grillés.',
    category: 'FOOD',
    priceUSD: 6.00,
    currentStock: 45,
    initialStock: 80,
    isAvailable: true
  },
  {
    id: 'prod-103',
    standId: 'stand-1',
    name: 'Frites de Banane Plantain (Alloco)',
    description: 'Bananes plantains mûres frites croustillantes et fondantes.',
    category: 'SNACK',
    priceUSD: 3.50,
    currentStock: 60,
    initialStock: 100,
    isAvailable: true
  },
  // Stand 2: Poulet Mayo King
  {
    id: 'prod-201',
    standId: 'stand-2',
    name: 'Le Grand Poulet Mayo Original',
    description: 'Demi-poulet fumé puis sauté à la mayonnaise relevée, servi chaud.',
    category: 'FOOD',
    priceUSD: 10.00,
    currentStock: 18,
    initialStock: 70,
    isAvailable: true
  },
  {
    id: 'prod-202',
    standId: 'stand-2',
    name: 'Box Ailes de Poulet Croustillantes',
    description: '6 ailes épicées avec sauce mayonnaise maison et frites de pomme de terre.',
    category: 'FOOD',
    priceUSD: 7.00,
    currentStock: 32,
    initialStock: 50,
    isAvailable: true
  },
  // Stand 5: Cocktails Tropicaux
  {
    id: 'prod-501',
    standId: 'stand-5',
    name: 'Cocktail Signature VUKA Sunset',
    description: 'Rhum local, maracuja, gingembre frais, jus de bissap et menthe écrasée.',
    category: 'DRINK',
    priceUSD: 6.50,
    currentStock: 85,
    initialStock: 150,
    isAvailable: true
  },
  {
    id: 'prod-502',
    standId: 'stand-5',
    name: 'Bissap Frais Gingembre (Grand Gobelet)',
    description: 'Infusion fraîche de fleurs d’hibiscus, extrait de menthe et citronnelle.',
    category: 'DRINK',
    priceUSD: 3.00,
    currentStock: 120,
    initialStock: 200,
    isAvailable: true
  },
  // Stand 7: Bières du Fleuve
  {
    id: 'prod-701',
    standId: 'stand-7',
    name: 'Bière Locale Pression (50cl)',
    description: 'Servie glacée à la tireuse sous le chapiteau.',
    category: 'DRINK',
    priceUSD: 3.00,
    currentStock: 180,
    initialStock: 300,
    isAvailable: true
  },
  {
    id: 'prod-702',
    standId: 'stand-7',
    name: 'Eau Minérale Locale (1.5L)',
    description: 'Eau de source naturelle fraîche.',
    category: 'DRINK',
    priceUSD: 1.50,
    currentStock: 95,
    initialStock: 150,
    isAvailable: true
  }
];

// Portefeuille par défaut pour le mode démo Festivalier
export const INITIAL_FESTIVALIER_WALLET: FestivalierWallet = {
  id: 'wallet-fest-001',
  festivalierName: 'Moïse Mutombo',
  phone: '+243815550199',
  balanceUSD: 45.00, // Solde initial pour test
  rfidTagId: 'RFID-DESFIRE-8842',
  rfidColor: '#1E293B',
  linkedTicketId: 'TCK-CFW6-7789',
  createdAt: '2026-09-08T10:00:00Z',
  lastTopUpDate: '2026-09-08T14:30:00Z'
};

// Billet acheté par défaut pour le festivalier de démo
export const INITIAL_PURCHASED_TICKETS: PurchasedTicket[] = [
  {
    ticketId: 'TCK-CFW6-7789',
    ticketDefId: 'pass-6-days',
    ticketName: 'Pass 6 Jours Intégral',
    buyerName: 'Moïse Mutombo',
    buyerPhone: '+243815550199',
    buyerEmail: 'moise.mutombo@mokili.cd',
    pricePaidUSD: 25.00,
    purchaseDate: '2026-09-08T10:00:00Z',
    qrCodeToken: 'VUKA-TICKET-CFW6-7789-SECURE-KEY',
    rfidTagId: 'RFID-DESFIRE-8842',
    status: 'VALID'
  }
];

// Transactions initiales pour simuler l'historique
export const INITIAL_TRANSACTIONS: CashlessTransaction[] = [
  {
    id: 'TXN-901',
    timestamp: '2026-09-08T10:00:00Z',
    type: 'TOPUP',
    amountUSD: 50.00,
    festivalierId: 'wallet-fest-001',
    festivalierPhone: '+243815550199',
    paymentMethod: 'MPESA_C2B',
    commissionAmountUSD: 0,
    merchantNetUSD: 50.00,
    isSynced: true,
    notes: 'Recharge M-Pesa C2B réussie'
  },
  {
    id: 'TXN-902',
    timestamp: '2026-09-08T12:35:00Z',
    type: 'PAYMENT',
    amountUSD: 5.00,
    festivalierId: 'wallet-fest-001',
    festivalierPhone: '+243815550199',
    standId: 'stand-5',
    standName: 'Cocktails Tropicaux & Jus de Bissap',
    items: [
      {
        productId: 'prod-502',
        productName: 'Bissap Frais Gingembre',
        quantity: 1,
        priceUSD: 3.00
      },
      {
        productId: 'prod-702',
        productName: 'Eau Minérale Locale',
        quantity: 1,
        priceUSD: 2.00
      }
    ],
    paymentMethod: 'WALLET_QR_DYNAMIC',
    commissionAmountUSD: 0.50, // 10%
    merchantNetUSD: 4.50,      // 90%
    isSynced: true,
    notes: 'Paiement sans contact par QR Dynamique'
  }
];
