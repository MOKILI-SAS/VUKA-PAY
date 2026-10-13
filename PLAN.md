# PLAN.md — FEUILLE DE ROUTE OPÉRATIONNELLE & GESTION PAR LOTS VUKA PAY

**Organisation :** MOKILI SAS  
**Document :** Plan d'exécution par lots testables (LOTS)  
**Version :** 1.1  
**Statut :** 100% Réalisé et Validé (Lots 0 à 6)

---

## 1. VUE D'ENSEMBLE DES LOTS

| Lot | Désignation | Statut | Dépendance |
|---|---|---|---|
| **LOT 0** | Constitution MOKILI, Socle technique & Design System VUKA | **TERMINÉ ✅** | Validation cadrage |
| **LOT 1** | Vitrine Publique Weezevent-Style & Billetterie en ligne | **TERMINÉ ✅** | LOT 0 |
| **LOT 2** | Espace Festivalier & VUKA Wallet (Cashless & QR Dynamique) | **TERMINÉ ✅** | LOT 1 |
| **LOT 3** | Terminal Marchand / POS Caisse (Sunmi V2S, Mobile & Offline-First) | **TERMINÉ ✅** | LOT 2 |
| **LOT 4** | Module Contrôle d'Accès (Scan Billets & RFID) | **TERMINÉ ✅** | LOT 1 |
| **LOT 5** | Back-Office Super Admin & Trésorerie Maître (Commission 10% & Payouts) | **TERMINÉ ✅** | LOT 2, LOT 3 |
| **LOT 6** | Tests, Audit de Sécurité, Documentation & Préparation Déploiement | **TERMINÉ ✅** | LOT 5 |
| **LOT UX**| Refonte UX & Charte Graphique VUKA v1.0 (Braise, Nuit, Soleil, Fleuve, Sable) | **TERMINÉ ✅** | Charte v1.0 |

---

## 2. DÉTAIL DES LOTS ET CRITÈRES D'ACCEPTATION

### LOT 0 : Constitution MOKILI, Socle technique & Design System VUKA
- [x] Initialisation Git du projet.
- [x] Création des 5 documents de gouvernance : `CLAUDE.md`, `PLAN.md`, `SUIVI.md`, `MOKILI-PROJECT-SPEC.md`, `README.md`.
- [x] Initialisation du projet Vite + React 19 + TypeScript.
- [x] Configuration de Tailwind CSS et des tokens de couleur VUKA (`#FF5722`, `#FFB300`, `#0A0D17`, `#00D2FF`, `#10B981`).
- [x] Création du socle de composants UI partagés (Header, Footer avec *« Propulsé par MOKILI »*, Boutons, Badges, Modales, Cartes).
- [x] Mise en place du switcher de rôles / simulateur multi-vues (Public, Festivalier, Standier POS, Contrôleur d'accès, Super Admin).
- **Validation :** L'application compile sans erreur TypeScript (`npm.cmd run build`), le design system s'affiche parfaitement et les 5 rôles sont commutables.

### LOT 1 : Vitrine Publique Weezevent-Style & Billetterie en Ligne
- [x] Page d'accueil publique inspirée de Weezevent :
  - [x] Barre de navigation moderne avec logo VUKA et présentation des solutions (VUKA Ticket, Access, Pay, POS).
  - [x] Hero chaleureux et énergique avec typographie vibrante et accroche forte.
  - [x] Section 4 piliers technologiques avec badges colorés d'inspiration Weezevent.
  - [x] Présentation de l'événement pilote : **Congo Food Week 6 (CFW6)**.
- [x] Module Billetterie :
  - [x] Grille des billets (Pass 6 Jours Tissu Premium à 25$, Pass Journaliers Jour 1 à 6 de 10$ à 15$, Pass VIP).
  - [x] Tunnel d'achat fluide (Sélection, Coordonnées participant, Paiement M-Pesa).
  - [x] Reçu de confirmation et génération de billet avec QR Code unique sécurisé et téléchargeable.
- [x] Footer officiel avec mention *« Propulsé par MOKILI »* pointant vers `https://mokili.io`.
- **Validation :** Parcours d'achat complet sans accroc, ticket généré avec QR code valide et données conformes aux spécifications CFW6.

### LOT 2 : Espace Festivalier & VUKA Wallet (Cashless & QR Dynamique)
- [x] Dashboard festivalier optimisé pour smartphone.
- [x] Affichage du solde virtuel en temps réel (USD et équivalent CDF).
- [x] Module de recharge instantanée via M-Pesa (simulation interactive C2B avec confirmation par notification).
- [x] Écran de paiement cashless :
  - [x] **QR Code dynamique sécurisé** : rotation automatique toutes les 30s avec timer visuel circulaire pour bloquer les fraudes par capture d'écran.
  - [x] Option d'affichage du token RFID associé (pour bracelet physique).
- [x] Historique complet des transactions avec horodatage, nom du stand et reçus numériques dématérialisés.
- [x] Consultation des menus et stands du festival en temps réel (23 stands exposants réels).
- **Validation :** Solde mis à jour instantanément lors de la recharge, QR code dynamique rafraîchi avec compte à rebours, transactions tracées.

### LOT 3 : Terminal Marchand / POS Caisse (Sunmi V2S, Mobile & Offline-First)
- [x] Interface tactile de caisse pour exposants/standiers :
  - [x] Prise de commande rapide avec sélection d'articles (grillades, boissons, spécialités).
  - [x] Récapitulatif du panier et total bidevise USD / CDF.
  - [x] Prélèvement automatique de la commission solidaire de 10% pour la Fondation Congolicious.
- [x] Encaissement sans contact :
  - [x] Scanner caméra du QR Code dynamique du festivalier (avec vérification cryptographique anti-fraude).
  - [x] Simulation de lecture du bracelet RFID sans contact.
- [x] **Architecture Offline-First :**
  - [x] Détection de l'état réseau (simulation coupure Starlink).
  - [x] Stockage local des transactions de vente en attente de reconnexion.
  - [x] Réconciliation et synchronisation automatique avec badge indicateur.
- [x] **Gestion stricte des stocks (CDC CFW6) :**
  - [x] Blocage des modifications libres de stock par le standier.
  - [x] Formulaire de soumission de réassort avec statut "EN ATTENTE D'APPROBATION".
- [x] Génération de tickets de caisse thermiques conformes Sunmi V2S.
- **Validation :** Vente complète réalisée avec succès, vérification du split 90/10, encaissement hors-ligne fonctionnel.

### LOT 4 : Module Contrôle d'Accès (Scan Billets & RFID)
- [x] Interface opérateur de filtrage pour les 6 postes d'entrée.
- [x] Scanner ultra-rapide de billets (< 500 ms) avec simulation laser/caméra.
- [x] Détection immédiate des fraudes :
  - [x] **Alerte Anti-Passback** en cas de billet déjà scanné.
  - [x] Alerte Billet Invalide / Inexistant.
- [x] Appairage du billet avec un bracelet RFID physique (simulation de puce sans contact).
- [x] Jauge d'affluence en direct sur le site (nombre d'entrants vs jauge max de 25 000).
- **Validation :** Scan immédiat, rejet strict en cas de réutilisation frauduleuse du même billet.

### LOT 5 : Back-Office Super Admin & Trésorerie Maître (Commission 10% & Payouts)
- [x] Vue d'ensemble de la Trésorerie Centrale (compte Vodacom M-Pesa de la direction) :
  - [x] Volume total des recharges et des ventes en USD et CDF.
  - [x] Séquestre des 10% de prélèvement solidaire pour la Fondation Congolicious.
  - [x] Total du net dû aux 23 stands (90%).
- [x] **Module d'approbation des réassorts de stock :**
  - [x] File d'attente des demandes de réassort envoyées par les standiers.
  - [x] Boutons d'action : Approuver (met à jour le stock en temps réel) ou Rejeter.
- [x] Suivi et classement en temps réel des 23 stands (CA, nombre de commandes, panier moyen).
- [x] **Clôture journalière & Reversements groupés M-Pesa B2C :**
  - [x] Rapport de clôture journalière scellé et téléchargeable/imprimable.
  - [x] Simulation de l'ordre de virement automatisé M-Pesa B2C vers les 23 gérants de stands.
- **Validation :** Calcul exact des commissions 10%, approbation de réassort fonctionnelle, clôture financière vérifiée.

### LOT 6 : Tests, Audit de Sécurité, Documentation & Préparation Déploiement
- [x] Validation de compilation TypeScript et packaging Vite sans erreurs (`dist/` généré).
- [x] Suite de tests unitaires automatisés (`scripts/test-engine.js` exécuté via `npm.cmd test`) couvrant :
  - Split financier 90/10 et conversion bidevise USD/CDF (2850 CDF).
  - Algorithme HMAC TOTP et rejet des captures d'écran après 30s-60s.
  - Protection Anti-Passback au contrôle d'accès.
  - File d'attente Offline-First et synchronisation Starlink.
- [x] Vérification de conformité des 5 fichiers de gouvernance MOKILI.
- [x] Vérification de la présence obligatoire de la mention *« Propulsé par MOKILI »* pointant vers `https://mokili.io`.
- **Validation :** 4/4 tests unitaires réussis avec code de sortie 0, documentation synchronisée.
