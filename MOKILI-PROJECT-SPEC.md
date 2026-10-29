# MOKILI-PROJECT-SPEC — SPÉCIFICATION TECHNIQUE & MÉTIER : VUKA PAY

**Organisation :** MOKILI SAS  
**Document :** Spécification Technique Complète du Projet  
**Version :** 2.0  
**Statut :** Validé & Aligné sur MOKILI Framework V2.0  
**Date de révision :** 29 octobre 2026  
**Framework de référence :** MOKILI TECH CORE V2.0 / MOKILI MASTER PROMPT V2.0  

---

## 1. PROJECT & IDENTITY
- **Nom du produit :** **VUKA Pay** (Super App Billetterie & Cashless Événementiel)
- **Étymologie :** *VUKA* signifie « Traverser » en Swahili — symbole du saut technologique vers la souveraineté numérique et le 100% cashless en République Démocratique du Congo.
- **Organisation cliente / Partenaire :** LAB3 & Fondation Congolicious
- **Événement pilote :** Congo Food Week 6 (CFW6) — 25 000 participants, 23 stands exposants, 150 000 $ de flux de trésorerie prévus.
- **Mention obligatoire :** *« Propulsé par MOKILI »* avec lien vers `https://mokili.io` sur l'ensemble des pieds de page.

---

## 2. OBJECTIVE & BUSINESS MODEL
- **Objectif principal :** Fournir une alternative souveraine, ultra-rapide et locale aux solutions étrangères (Weezevent, Howler, Quicket), éliminant l'évasion de capitaux technologiques (environ 7 500 $ de commissions par événement envoyées à l'étranger).
- **Trinité LAB3 :** Organisateur ↔ Participant ↔ Connexion en harmonie parfaite.
- **Modèle solidaire :** Prélèvement automatique de **10% sur chaque transaction** validée par un stand, reversé directement au compte de la Fondation Congolicious pour financer des initiatives sociales (~15 000 $ générés lors du CFW6).
- **Frais d'activation :** 2 $ par bracelet/pass festivalier (50 000 $ pour 25 000 participants).

---

## 3. PROFILS MOKILI (MATRICE V2.0)
- **PRIMARY PROFILE :** `P06 — Application web complexe / SaaS`
  - Plateforme multi-tenant de gestion des commandes, billets, accès et paiements.
  - Tableaux de bord multi-rôles, supervision en direct de la trésorerie maître, gestion des approbations de réassort et clôture journalière groupée M-Pesa B2C.
- **COMBINED / SECONDARY PROFILES :**
  - `P07 — E-commerce / Billetterie & Marketplace multi-stands` : Vitrine de découverte inspirée de Weezevent, catalogue des 7 pass et des 23 stands exposants, menus interactifs et commandes sans contact.
  - `P05 — Frontend web riche / SPA PWA` : Interface utilisateur ultra-réactive React 19 + TypeScript + Vite + Tailwind CSS, rotation dynamique QR 30s HMAC, résilience offline-first (IndexedDB) pour terminaux Sunmi V2S et smartphones.
  - `P08 — API REST / Passerelle Mobile Money` : Intégration M-Pesa C2B et B2C, cryptographie des QR codes dynamiques anti-fraude, résilience Starlink.

---

## 4. AUDIENCE & USER ROLES
1. **Festivalier (Client) :**
   - Découverte des événements et achat de billets en ligne (Email & WhatsApp obligatoires pour délivrance).
   - Portefeuille numérique (VUKA Wallet) rechargeable via M-Pesa.
   - Génération d'un QR code dynamique sécurisé (renouvelé toutes les 30s) ou liaison d'un bracelet RFID pour le paiement sans contact.
   - Consultation des menus des stands et réception de reçus numériques instantanés.
2. **Tenancier de Stand (Vendeur / POS) :**
   - Deux modes de déploiement supportés :
     - *Option A :* Terminaux Android POS physiques (Sunmi V2S avec scanner et imprimante thermique intégrée).
     - *Option B :* Smartphone personnel (Android/iOS) avec scan par caméra et reçus dématérialisés.
   - Prise de commande rapide au toucher.
   - Encaissement ultra-rapide par scan du QR festivalier ou tag bracelet NFC.
   - Consultation de ses recettes en direct.
   - Déclaration de stock initial et signalement de ruptures.
   - *Contrainte stricte :* Modification de stock bloquée par défaut, soumission d'une requête de réassort soumise à validation de l'administrateur.
3. **Contrôleur d'Accès (Staff Entrées) :**
   - 6 terminaux dédiés au contrôle aux portes.
   - Scan des billets QR code (< 500 ms), vérification d'unicité (anti-passback), association immédiate avec bracelet RFID MIFARE.
4. **Organisateur d'Événements :**
   - Espace dédié avec connexion sécurisée, publication d'événements, suivi en direct de la billetterie, des revenus et des entrées scannées.
5. **Super Administrateur & Direction (Trésorerie Maître) :**
   - Vue consolidée de la trésorerie en temps réel (fonds M-Pesa centralisés).
   - Validation ou refus en un clic des demandes de réassort de stock des stands.
   - Monitoring des volumes de vente par stand et global.
   - Clôture de fin de journée avec déduction de la commission de 10% (net dû = 90% du CA).
   - Reversement groupé (Payouts M-Pesa B2C) vers les numéros M-Pesa des propriétaires de stands.

---

## 5. SCOPE & FONCTIONNALITÉS
### In Scope
- Vitrine Weezevent-Style présentant les solutions VUKA (*Ticket*, *Access*, *Pay*, *POS*).
- Header épuré et sobre avec navigation 3-zones et accès direct à l'Espace Organisateurs.
- Billetterie en ligne multi-pass (Pass 6 Jours Tissu Premium 25$, Pass Journaliers 10$-15$, Pass VIP Lounge 50$).
- Wallet numérique avec recharge M-Pesa C2B interactive.
- QR Code dynamique de paiement à renouvellement temporel anti-fraude (HMAC TOTP 30s).
- Caisse Marchande POS avec mode **Offline-First** (IndexedDB) pour pallier les coupures internet et synchronisation automatique Starlink.
- Module de gestion stricte des stocks avec circuit d'approbation Super Admin.
- Split automatique des revenus (10% commission Fondation Congolicious / 90% vendeur).
- Module Contrôle d'Accès avec jauge en direct et prévention anti-passback.
- Dashboard Super Admin et Payouts journaliers M-Pesa B2C.
- Espace Organisateurs avec publication d'événements et suivi des métriques.
- Conformité SEO technique : `robots.txt`, `sitemap.xml`, métas Open Graph (1200x630), Twitter Cards.
- Modalité légale et RGPD : Politique de Confidentialité (Loi RDC n° 20/017 relative aux TIC), CGU/CGV et Mentions Légales.
- Mention « Propulsé par MOKILI » pointant vers `https://mokili.io`.

### Out of Scope
- Fabrication industrielle physique des bracelets tissu et cartes PVC (sous-traitance matériel).
- Déploiement physique des antennes Starlink sur site (fourni par l'équipe logistique terrain).

---

## 6. ARCHITECTURE TECHNIQUE
```text
                         [ FESTIVALIER / ACHETEUR ]
                                      │
                      ┌───────────────┴───────────────┐
                      ▼                               ▼
        [ Vitrine & Billetterie Web ]       [ VUKA Wallet & QR Dynamique ]
                      │                               │
                      └───────────────┬───────────────┘
                                      │
                           [ VUKA UNIFIED CORE ]
                                      │
          ┌───────────────────────────┼───────────────────────────┐
          ▼                           ▼                           ▼
 [ POS Caisse Standier ]    [ Contrôle d'Accès ]        [ Super Admin & Trésorerie ]
  (Offline-First IndexedDB)  (Scan & Association RFID)   (Commission 10% & Payouts)
          │                           │                           │
          └───────────────────────────┼───────────────────────────┘
                                      ▼
                       [ M-Pesa Gateway Adapter ]
                          (C2B Top-Up / B2C Payout)
```

---

## 7. STACK & TECHNOLOGIES
- **Frontend :** React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, Framer Motion.
- **PWA & Offline :** Service Workers, IndexedDB (`idb` wrapper), localStorage sync queue.
- **Backend / API :** Node.js, TypeScript, REST API unifiée.
- **Base de Données :** SQLite en local dev / PostgreSQL en production multi-tenant.
- **Sécurité :** Chiffrement HMAC / TOTP pour la rotation des QR codes, Web NFC API.
- **Paiements :** M-Pesa Vodacom RDC (C2B et B2C Payout).

---

## 8. CHARTE GRAPHIQUE OFFICIELLE VUKA (v1.0)
- **Palette officielle :**
  - **Braise (`#FF6A2B`)** : Énergie vitale, action prioritaire, boutons principaux.
  - **Nuit (`#14110F`)** : Socle de contraste, typographie, surfaces sombres.
  - **Soleil (`#FFC21A`)** : Accents VIP, puces RFID, badges.
  - **Fleuve (`#0E5A8A`)** : Infrastructure, sécurité, staff.
  - **Sable (`#FBF6EE`)** & **Fumée (`#F3ECE2`)** : Fond principal et cartes secondaires.
  - **Règle WCAG AA stricte :** Texte sur fond Braise et Soleil systématiquement en Nuit (`#14110F`). Zéro texte blanc sur fond orange.
- **Typographie :** **Poppins** (titres, CTA, prix) et **Inter** (corps, données).
- **Zéro emoji :** Discipline visuelle stricte, design épuré et contemporain.

---

## 9. SÉCURITÉ & RÉSILIENCE
- **Anti-Fraude Billets :** QR code unique non réutilisable avec marquage d'entrée en base et prévention de passback.
- **Anti-Fraude Paiements :** QR code dynamique renouvelé toutes les 30 secondes avec horodatage signé, interdisant l'utilisation d'une capture d'écran.
- **Résilience Offline-First :** Lors d'une coupure internet ou latence réseau, les terminaux Sunmi V2S et smartphones vendeurs continuent à encaisser localement en mode dégradé sécurisé. Dès que la liaison Starlink est rétablie, les transactions sont synchronisées de manière idempotente.
- **Gouvernance des Stocks :** Aucun standier ne peut modifier son stock manuellement ; toute augmentation requiert l'approbation explicite de l'administrateur.

---

## 10. CRITÈRES DE SUCCÈS (DEFINITION OF DONE)
1. Parcours complet d'achat de billets et émission d'un pass avec QR code valide.
2. Recharge du portefeuille virtuel par simulation ou API M-Pesa.
3. Paiement en caisse avec scan du QR dynamique et déduction du solde en temps réel.
4. Prélèvement automatique de la commission de 10% sur chaque transaction.
5. Fonctionnement vérifié du mode offline-first en simulant une coupure réseau.
6. Validation administrative requise pour tout réassort de stock.
7. Clôture financière quotidienne avec calcul du net vendeur et simulation du payout M-Pesa B2C.
8. Présence impeccable de la mention « Propulsé par MOKILI » pointant vers `https://mokili.io`.
9. Conformité aux Quality Gates SEO, accessibilité et sécurité légale.
