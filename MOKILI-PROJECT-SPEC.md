# MOKILI-PROJECT-SPEC — SPÉCIFICATION TECHNIQUE & MÉTIER : VUKA PAY

**Organisation :** MOKILI SAS  
**Document :** Spécification Technique Complète du Projet  
**Version :** 1.0  
**Statut :** Validé  
**Date :** 08 septembre 2026  
**Auteur :** Ingénieur Full-Stack Senior & World-Class Product Designer  

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

## 3. PROFILES MOKILI
- **PRIMARY :** `P08 SaaS` + `P07 Web App` (Plateforme multi-tenant de gestion des commandes, billets et paiements).
- **SECONDARY :**
  - `P10 Mobile` (PWA installable et interface mobile responsive pour Festivaliers et Standiers).
  - `P14 Dashboard / Back-Office` (Supervision globale temps réel, trésorerie maître, gestion des stocks et reversements journaliers).
  - `P15 Portail / Marketplace` (Vitrine publique inspirée de Weezevent pour la découverte et la vente de billets).
- **SPECIALIZED :** `P09 API / Passerelle Mobile Money` (Intégration M-Pesa C2B et B2C, cryptographie des QR codes dynamiques anti-fraude, résilience offline-first).

---

## 4. AUDIENCE & USER ROLES
1. **Festivalier (Client) :**
   - Découverte des événements et achat de billets en ligne.
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
   - Scan des billets QR code, vérification d'unicité (anti-passback), association immédiate avec bracelet RFID MIFARE.
4. **Super Administrateur & Organisateur (Trésorerie Maître) :**
   - Vue consolidée de la trésorerie en temps réel (fonds M-Pesa centralisés).
   - Validation ou refus en un clic des demandes de réassort de stock des stands.
   - Monitoring des volumes de vente par stand et global.
   - Clôture de fin de journée avec déduction de la commission de 10% (net dû = 90% du CA).
   - Reversement groupé (Payouts M-Pesa B2C) vers les numéros M-Pesa des propriétaires de stands.

---

## 5. SCOPE & FONCTIONNALITÉS
### In Scope (MVP & V1)
- Vitrine Weezevent-Style présentant les solutions VUKA (*Ticket*, *Access*, *Pay*, *POS*).
- Billetterie en ligne multi-pass (Pass 6 Jours Tissu Premium 25$, Pass Journaliers 10$-15$, Pass VIP).
- Wallet numérique avec recharge M-Pesa C2B interactive.
- QR Code dynamique de paiement à renouvellement temporel anti-fraude.
- Caisse Marchande POS avec mode **Offline-First** (IndexedDB) pour pallier les coupures internet et synchronisation automatique.
- Module de gestion stricte des stocks avec circuit d'approbation Super Admin.
- Split automatique des revenus (10% commission Fondation Congolicious / 90% vendeur).
- Module Contrôle d'Accès avec jauge en direct et prévention de la fraude.
- Dashboard Super Admin et Payouts journaliers M-Pesa B2C.
- Mention « Propulsé par MOKILI » pointant vers `mokili.io`.

### Out of Scope (V1)
- Impression physique de bracelets en usine (géré par prestataire externe).
- Déploiement matériel physique de Starlink sur site (fourni par l'équipe logistique terrain).

---

## 6. ARCHITECTURE TECHNIQUE
```text
                         [ FESTIVALIER / VISITEUR ]
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

## 8. DESIGN SYSTEM & IDENTITÉ VISUELLE
- **Inspiration :** [Weezevent](https://weezevent.com/fr/) + Chaleur africaine contemporaine et vibrante.
- **Couleurs :**
  - Primaire : Terracotta Sunset (`#FF5722` / `#F4511E`)
  - Accent Chaud : Kinshasa Gold / Ochre (`#FFB300` / `#F59E0B`)
  - Nuit Profonde : Deep Night Indigo (`#0A0D17` / `#111827`)
  - Accent Tech : Electric Cyan NFC (`#00D2FF` / `#06B6D4`)
  - Succès : Congo Emerald (`#10B981`)
- **Typographie :** Display percutant et géométrique pour les titres, typographie claire pour les données et prix, monospace stylisé pour les tokens de sécurité et billets.
- **Mention Footer :** « Propulsé par MOKILI » -> `https://mokili.io`.

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
8. Présence impeccable de la mention « Propulsé par MOKILI » pointant vers `mokili.io`.
