# CLAUDE.md — DIRECTIVES OPÉRATIONNELLES DU PROJET VUKA PAY

**Organisation :** MOKILI SAS  
**Produit :** VUKA Pay (Super App Billetterie & Cashless Événementiel)  
**Client / Pilote :** Congo Food Week 6 (CFW6) & Fondation Congolicious / LAB3  
**Framework de référence :** MOKILI TECH CORE V1.0 / MOKILI MASTER PROMPT V1.1  
**Emplacement Framework :** `C:\Users\MONYANYO\Desktop\MONYANYO\ENTREPRISE\MOKILI\FRAMEWORK`  

---

## 1. RÈGLES DE CONDUITE POUR LES AGENTS IA

1. **Priorité absolue :** Toujours respecter `MOKILI TECH CORE`, `MOKILI-PROJECT-SPEC.md`, `PLAN.md` et `SUIVI.md`.
2. **Ne jamais inventer d'informations :** Utiliser les données des cahiers des charges (`CAHIER DES CHARGES - CFW6 Digital.pdf`, `CAHIER DES CHARGES TECHNIQUE v2.pdf`, `VUKA PRESENTATION.pdf`).
3. **Mention de marque obligatoire :** Mentionner obligatoirement *« Propulsé par MOKILI »* pointant vers `https://mokili.io` au pied de page de toutes les interfaces publiques et portails.
4. **Direction Artistique :** Inspirée de **Weezevent** ([weezevent.com/fr/](https://weezevent.com/fr/)) croisée avec une identité chaleureuse, africaine contemporaine, dynamique, avec typographie vibrante (couleurs coucher de soleil kinois : Terracotta `#FF5722`, Gold `#FFB300`, Nuit profonde `#0A0D17`, Cyan électrique `#00D2FF`).
5. **Gestion par Lots :** Ne jamais coder sans mettre à jour `SUIVI.md` et valider les critères d'acceptation du lot actif défini dans `PLAN.md`.

---

## 2. PROFIL DU PROJET & STACK

- **Profil MOKILI :** `P08 SaaS` + `P07 Web App` (Primary), `P10 Mobile` + `P14 Dashboard` + `P15 Portail/Marketplace` (Secondary), `P09 API/Passerelle` (Specialized).
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
# Installation des dépendances
npm install

# Démarrage de l'application en mode développement
npm run dev

# Construction pour la production
npm run build

# Exécution des tests de validation
npm run test
```

---

## 5. RÈGLE D'OR MOKILI

> *« Le développeur choisit le projet. MOKILI choisit la méthode. Le besoin choisit la technologie. »*
