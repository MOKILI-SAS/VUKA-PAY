# VUKA Pay — Super App de Billetterie & Paiement Cashless Événementiel

[![Standard MOKILI](https://img.shields.io/badge/MOKILI-TECH%20CORE%20V1.0-orange.svg)](https://mokili.io)
[![License](https://img.shields.io/badge/License-Proprietary-blue.svg)](https://mokili.io)
[![Framework](https://img.shields.io/badge/Stack-React%2019%20%2F%20Vite%20%2F%20TypeScript-purple.svg)](https://react.dev)

> **VUKA Pay** est la première super app événementielle souveraine conçue pour les grands événements culturels, festivals et conférences en République Démocratique du Congo et en Afrique.
> 
> *VUKA* signifie **« Traverser »** en Swahili — le saut technologique qui libère les organisateurs locaux de la dépendance envers les plateformes étrangères (Weezevent, Howler, Quicket) et conserve 100% de la valeur et des données au pays.

---

## 🌟 Les 4 Piliers VUKA (Inspiration Weezevent)

1. **VUKA Ticket :** Billetterie en ligne multi-tarifs, pass festivaliers 6 jours et journaliers, paiement mobile money instantané (M-Pesa) et billets numériques infalsifiables.
2. **VUKA Access :** Contrôle d'accès ultra-rapide (< 500 ms) aux portes, détection anti-passback et appairage avec bracelets RFID / puces MIFARE DESFire.
3. **VUKA Pay (Cashless) :** Portefeuille numérique (Wallet), recharge M-Pesa C2B en amont ou sur site, paiement sans contact par QR Code dynamique sécurisé (renouvelé toutes les 30s) ou bracelet NFC.
4. **VUKA POS (Caisse Standier) :** Prise de commande tactile ultra-fluide pour les exposants sur terminaux Sunmi V2S et smartphones, fonctionnement **Offline-First** lors des micro-coupures réseau et synchronisation Starlink.

---

## 🤝 Le Modèle Solidaire (Congo Food Week 6)

- **10% de prélèvement automatique** sur chaque transaction validée par un stand, reversé directement au compte de la **Fondation Congolicious** pour financer des actions d'impact social.
- **Trésorerie Maître :** Centralisation des flux sur le compte administrateur M-Pesa.
- **Gouvernance stricte des stocks :** Tout réassort de stock est bloqué par défaut et doit être expressément validé par l'Administrateur.
- **Clôture journalière automatisée :** Calcul du net vendeur (90%) et déclenchement des reversements groupés (Payouts M-Pesa B2C).

---

## 🚀 Démarrage Rapide

### Prérequis
- Node.js version 18+ (testé avec v24.16.0)
- npm version 9+

### Installation & Lancement
```bash
# 1. Cloner ou ouvrir le dossier du projet
cd "c:\Users\MONYANYO\Desktop\MONYANYO\ENTREPRISE\MOKILI\PROJET CODE ZIP DEV PROMPT\VUKA Pay"

# 2. Installer les dépendances
npm install

# 3. Lancer le serveur de développement
npm run dev

# 4. Ouvrir dans le navigateur
# http://localhost:5173
```

---

## 📱 Rôles & Comptes de Test Intégrés

L'application intègre un **sélecteur de rôles instantané** permettant de naviguer et tester en direct tous les flux :
- **Visiteur / Acheteur :** Découverte de la vitrine Weezevent-Style, consultation du catalogue et achat de billets.
- **Festivalier :** Consultation du solde du wallet, recharge M-Pesa, génération du QR Code dynamique de paiement.
- **Standier / Vendeur (POS) :** Sélection de son stand parmi les 23 stands du CFW6, catalogue tactile, encaissement et demande de réassort.
- **Contrôleur d'Accès :** Scan des billets aux entrées, appairage bracelet RFID, suivi de la jauge en direct.
- **Super Admin :** Tableau de bord de trésorerie maître, validation/rejet des réassorts de stock, suivi de la commission 10% et déclenchement des payouts M-Pesa B2C.

---

## 📚 Documentation de Gouvernance MOKILI

- `CLAUDE.md` : Directives opérationnelles pour les agents de développement.
- `PLAN.md` : Feuille de route par lots testables (LOTS 0 à 6).
- `SUIVI.md` : Journal des actions, décisions et validations.
- `MOKILI-PROJECT-SPEC.md` : Spécification technique et fonctionnelle détaillée.

---

## 🏛️ Crédits & Attribution

Propulsé par [MOKILI SAS](https://mokili.io) — Excellence logicielle & ingénierie souveraine africaine.
Conçu pour **LAB3** et la **Fondation Congolicious** dans le cadre du **Congo Food Week 6**.
