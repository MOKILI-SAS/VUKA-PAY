# CLAUDE.md — DIRECTIVES OPÉRATIONNELLES DU PROJET VUKA PAY

**Organisation :** MOKILI SAS  
**Produit :** VUKA Pay (Super App Billetterie & Cashless Événementiel)  
**Client / Pilote :** Congo Food Week 6 (CFW6) & Fondation Congolicious / LAB3  
**Framework de référence :** MOKILI TECH CORE V2.0 / MOKILI MASTER PROMPT V2.0  
**Emplacement Framework :** `C:\Users\MONYANYO\Desktop\MONYANYO\ENTREPRISE\MOKILI\FRAMEWORK`  
**Instructions partagées :** Voir [`AGENTS.md`](file:///c:/Users/MONYANYO/Desktop/MONYANYO/ENTREPRISE/MOKILI/PROJET%20CODE%20ZIP%20DEV%20PROMPT/VUKA%20Pay/AGENTS.md) pour les règles transversales de gouvernance

---

## 1. RÈGLES DE CONDUITE POUR LES AGENTS IA

1. **Priorité absolue :** Toujours respecter `MOKILI TECH CORE V2.0`, `AGENTS.md`, `MOKILI-PROJECT-SPEC.md`, `PLAN.md` et `SUIVI.md`.
2. **Ne jamais inventer d'informations :** Utiliser les données des cahiers des charges (`CAHIER DES CHARGES - CFW6 Digital.pdf`, `CAHIER DES CHARGES TECHNIQUE v2.pdf`, `VUKA PRESENTATION.pdf`, `VUKA_Charte_graphique_v1.0.pdf`).
3. **Mention de marque obligatoire :** Mentionner obligatoirement *« Propulsé par MOKILI »* pointant vers `https://mokili.io` au pied de page de toutes les interfaces publiques et portails.
4. **Charte Graphique Officielle VUKA (v1.0) :**
   - **Braise (`#FF6A2B`)** : Énergie vitale, action prioritaire, boutons principaux.
   - **Nuit (`#14110F`)** : Socle de contraste, typographie, arrière-plans denses.
   - **Soleil (`#FFC21A`)** : Accents VIP, badges, célébration.
   - **Fleuve (`#0E5A8A`)** : Infrastructure, sécurité, staff.
   - **Sable (`#FBF6EE`)** & **Fumée (`#F3ECE2`)** : Fond principal et cartes secondaires.
   - **Règle WCAG AA stricte :** Texte sur Braise et Soleil systématiquement en Nuit (`#14110F`). Zéro texte blanc sur fond orange.
5. **Gestion par Lots :** Ne jamais coder sans mettre à jour `SUIVI.md` et valider les critères d'acceptation du lot actif défini dans `PLAN.md`.
6. **Sobriété :** Zéro emoji dans le code, l'UI et la documentation de pilotage.

---

## 2. PROFIL DU PROJET & STACK (MATRICE MOKILI V2.0)

- **Profil MOKILI :** 
  - `P06 — Application web complexe / SaaS` (Principal)
  - `P07 — E-commerce / Billetterie & Marketplace multi-stands` (Combiné)
  - `P05 — Frontend web riche / SPA PWA` (Interface client & marchande)
  - `P08 — API REST / Passerelle Mobile Money` (Intégration M-Pesa C2B/B2C)
- **Architecture :** Niveau C évolutif D (Web App responsive & PWA unifiée multi-rôles + API modulaire + Offline-First + Passerelle M-Pesa).
- **Stack :**
  - Frontend : React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, Framer Motion.
  - PWA / Offline : Service Workers, IndexedDB (`idb` / local storage résilient).
  - Backend : Node.js, TypeScript, REST API modulaire.
  - Base de données : SQLite (environnement local dev) / PostgreSQL (production).
  - Sécurité : Tokens QR dynamiques anti-fraude renouvelés toutes les 30s (HMAC/TOTP), Web NFC.

---

## 3. RÔLES SYSTÈME & MODULES ACTIFS

- **Rôles RBAC :**
  - `SUPER_ADMIN` : Contrôle absolu, trésorerie maître, validation réassorts, commission 10% Fondation Congolicious, reversements M-Pesa B2C.
  - `ORGANIZER` : Gestion des événements, jauges, billetterie, statistiques.
  - `STAND_MANAGER` (Vendeur POS) : Prise de commande, encaissement QR/NFC, inventaire et soumission de réassort (bloqué par défaut).
  - `STAFF_ACCESS` : Contrôle d'accès, scan de billets, appairage bracelets RFID.
  - `FESTIVALIER` : Achat de billets, wallet cashless, recharge M-Pesa, QR code dynamique de paiement, reçus numériques.
- **Modules MOKILI :**
  - `M01 AUTH`, `M02 RBAC`, `M03 USER/PROFILE`, `M04 PAYMENT (M-Pesa)`, `M05 BILLING (Commission 10%)`, `M07 STORAGE`, `M10 NOTIFICATIONS`, `M11 REALTIME`, `M12 QUEUE`, `M15 ANALYTICS`, `M25 ADMIN`.

---

## 4. COMMANDES DE DÉVELOPPEMENT

```bash
# Vérification TypeScript
npx tsc -b

# Exécution des tests de validation
npm test

# Démarrage de l'application en mode développement
npm run dev

# Construction pour la production
npm run build
```

---

## 5. RÈGLE D'OR MOKILI

> *« Le développeur choisit le projet. MOKILI choisit la méthode. Le besoin choisit la technologie. »*
