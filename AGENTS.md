# AGENTS.md — DIRECTIVES DE GOUVERNANCE MOKILI (V2.0)
## Instructions de projet multi-agents pour VUKA Pay

**Organisation :** MOKILI SAS  
**Produit :** VUKA Pay (Super App de Billetterie & Paiement Cashless Événementiel)  
**Client / Partenaire :** LAB3 & Fondation Congolicious  
**Événement Pilote :** Congo Food Week 6 (CFW6) — Kinshasa, RDC  
**Framework de référence :** MOKILI TECH CORE V2.0 / MOKILI MASTER PROMPT V2.0  
**Emplacement Framework :** `C:\Users\MONYANYO\Desktop\MONYANYO\ENTREPRISE\MOKILI\FRAMEWORK`  
**Configuration locale :** `.mokili/config` dans l'arborescence parente

---

## 1. SOURCES DE VÉRITÉ & GOUVERNANCE

1. **Hiérarchie stricte des règles (MOKILI TECH CORE V2.0) :**
   * Niveau 1 : Obligations légales, réglementaires et exigences critiques de sécurité (protection des données Mobile Money, non-divulgation de secrets).
   * Niveau 2 : Instructions explicites du responsable de projet MOKILI.
   * Niveau 3 : MOKILI TECH CORE V2.0.
   * Niveau 4 : Profil et architecture validés (`P06 SaaS` + `P07 E-commerce` + `P05 Frontend` + `P08 API`).
   * Niveau 5 : Modules MOKILI actifs (`M01`, `M02`, `M03`, `M04`, `M05`, `M07`, `M10`, `M11`, `M12`, `M15`, `M25`).
   * Niveau 6 : Matrice d'hébergement et d'infrastructure.
   * Niveau 7 : Standards spécialisés actifs (SEO Quality Gate, Testing & Verification, Charte Graphique VUKA v1.0).
   * Niveau 8 : Constitution locale et décisions des 5 fichiers de gouvernance du projet (`MOKILI-PROJECT-SPEC.md`, `PLAN.md`, `SUIVI.md`, `AGENTS.md` / `CLAUDE.md`, `README.md`).
2. **Découverte du Framework :**
   * Toujours lire `.mokili/config` avant toute décision architecturale structurante.
   * Ne jamais supposer une technologie ou une bibliothèque par simple réflexe ou habitude.
3. **Exactitude et intégrité documentaire :**
   * Ne jamais inventer d'informations sur les partenaires, l'équipe, les chiffres ou les fonctionnalités.
   * Se baser exclusivement sur les cahiers des charges (`CAHIER DES CHARGES - CFW6 Digital.pdf`, `CAHIER DES CHARGES TECHNIQUE v2.pdf`, `VUKA PRESENTATION.pdf`, `VUKA_Charte_graphique_v1.0.pdf`).

---

## 2. PROFIL DU PRODUIT & ARCHITECTURE (MATRICE MOKILI V2.0)

* **PROFIL PRINCIPAL :** `P06 — Application web complexe / SaaS`
  * Plateforme multi-rôles unifiée : Festivalier, Organisateur, Marchand POS, Contrôleur d'accès, Super Admin.
  * Trésorerie maître, réconciliation financière bidevise USD/CDF, calcul de la commission solidaire 10% Fondation Congolicious et clôture journalière groupée M-Pesa B2C.
* **PROFILS ASSOCIÉS :**
  * `P07 — E-commerce / Billetterie & Marketplace multi-stands` : Vente en ligne de 7 pass, catalogue des 23 stands exposants et menus, tickets numériques infalsifiables.
  * `P05 — Frontend web riche / SPA PWA` : Interface tactile réactive React 19 + TypeScript + Vite + Tailwind CSS, rotation dynamique QR HMAC 30s anti-fraude, résilience offline-first (IndexedDB) pour terminaux Sunmi V2S et smartphones.
  * `P08 — API REST / Passerelle Mobile Money` : Intégration M-Pesa C2B et B2C, synchronisation Starlink idempotente.

---

## 3. CHARTE GRAPHIQUE OFFICIELLE VUKA (v1.0)

* **Discipline des Couleurs :**
  * **Braise (`#FF6A2B`)** : Énergie vitale, boutons d'action prioritaires, accents.
  * **Nuit (`#14110F`)** : Socle, typographie principale, surfaces sombres.
  * **Soleil (`#FFC21A`)** : Accents VIP, puces RFID, badges.
  * **Fleuve (`#0E5A8A`)** : Infrastructure, sécurité, staff.
  * **Sable (`#FBF6EE`)** & **Fumée (`#F3ECE2`)** : Fond principal et surfaces secondaires.
  * **Règle de contraste WCAG AA stricte :** Le texte sur fond Braise ou Soleil est **toujours en Nuit (`#14110F`)**, jamais en blanc.
* **Typographies :**
  * **Poppins** : Titres percutants (`font-heading`), CTA, boutons d'action, montants.
  * **Inter** : Corps de texte, tableaux de données, formulaires (`font-sans`).
* **Sobriété stricte :**
  * **Zéro emoji** dans le code, l'interface et la documentation de pilotage.
  * L'interface doit rester épurée, équilibrée et d'un niveau fintech mondial.
  * Mention de marque obligatoire : *« Propulsé par MOKILI »* liant vers `https://mokili.io` au pied de page.

---

## 4. CONVENTIONS D'INGÉNIERIE & DE TESTS

1. **Cycle de Travail par Lots :**
   * Mettre à jour `SUIVI.md` à chaque session de travail pour consigner les actions, décisions et preuves de test.
   * Valider systématiquement la suite de tests automatisés (`npm test`) et la compilation TypeScript (`npx tsc -b`) avant tout commit.
2. **Vocabulaire des Tests MOKILI (Document 14) :**
   * `PASS` : Vérification exécutée et confirmée.
   * `FAIL` : Assertion échouée ou anomalie observée.
   * `BLOCKED` : Prérequis manquant.
   * `NOT APPLICABLE — JUSTIFIED` : Contrôle hors périmètre avec justification.
3. **Sécurité & Données :**
   * Jamais de secrets, tokens d'API ou clés privées dans le bundle client ou dans les commits Git.
   * Respect de la loi congolaise n° 20/017 relative aux TIC et du RGPD pour les données personnelles.

---

## 5. COMMANDES OFFICIELLES

```bash
# Vérification des types TypeScript
npx tsc -b

# Exécution de la suite de tests unitaires
npm test

# Démarrage du serveur de développement Vite
npm run dev

# Construction de l'artefact de production
npm run build
```

---

## 6. RÈGLE D'OR MOKILI

> *« Le développeur choisit le projet. MOKILI choisit la méthode. Le besoin choisit la technologie. »*
