import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, FileText, Scale } from 'lucide-react';

export type LegalTab = 'PRIVACY' | 'TERMS' | 'LEGAL_NOTICE';

interface LegalModalProps {
  isOpen: boolean;
  initialTab?: LegalTab;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  initialTab = 'PRIVACY',
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<LegalTab>(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
    >
      <div className="bg-white rounded-3xl border border-[#D9D0C6] shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden text-[#14110F]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#F3ECE2] flex items-center justify-between bg-[#FBF6EE]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FFE3D3] text-[#FF6A2B] flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 id="legal-modal-title" className="text-lg font-bold font-heading">
                Informations Légales & Conformité
              </h2>
              <p className="text-xs text-[#7A7068]">
                VUKA Pay • Plateforme opérée par MOKILI SAS
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white hover:bg-[#F3ECE2] border border-[#D9D0C6] text-[#14110F] flex items-center justify-center transition active:scale-95"
            aria-label="Fermer la modal légale"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#F3ECE2] px-5 sm:px-6 bg-white gap-2 overflow-x-auto text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('PRIVACY')}
            className={`py-3.5 px-3 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'PRIVACY'
                ? 'border-[#FF6A2B] text-[#FF6A2B]'
                : 'border-transparent text-[#7A7068] hover:text-[#14110F]'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Politique de Confidentialité</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('TERMS')}
            className={`py-3.5 px-3 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'TERMS'
                ? 'border-[#FF6A2B] text-[#FF6A2B]'
                : 'border-transparent text-[#7A7068] hover:text-[#14110F]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Conditions Générales (CGU / CGV)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('LEGAL_NOTICE')}
            className={`py-3.5 px-3 border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'LEGAL_NOTICE'
                ? 'border-[#FF6A2B] text-[#FF6A2B]'
                : 'border-transparent text-[#7A7068] hover:text-[#14110F]'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>Mentions Légales</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-sm text-[#4A433D] leading-relaxed">
          {activeTab === 'PRIVACY' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-[#14110F] font-heading">
                Politique de Protection des Données Personnelles
              </h3>
              <p>
                La présente politique définit la manière dont <strong>VUKA Pay</strong>, solution développée par <strong>MOKILI SAS</strong>, collecte, traite et protège vos données personnelles conformément aux réglementations applicables en République Démocratique du Congo (Loi n° 20/017 du 25 novembre 2020 relative aux télécommunications et aux technologies de l'information et de la communication) ainsi qu'aux standards internationaux de protection de la vie privée (RGPD).
              </p>

              <h4 className="font-bold text-[#14110F] pt-2">1. Données collectées</h4>
              <p>
                Dans le cadre de l'émission des billets, de la recharge de portefeuille sans contact et de l'accès aux festivals :
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Identité et contact :</strong> Nom complet, adresse e-mail, numéro WhatsApp / téléphone (nécessaire à l'envoi du billet numérique et aux transactions Mobile Money).</li>
                <li><strong>Données de transaction :</strong> Montants rechargés, tickets achetés, horodatage des paiements (aucun numéro secret ou code PIN bancaire n'est stocké).</li>
                <li><strong>Identifiants techniques :</strong> Identifiant RFID MIFARE du bracelet festivalier et signature cryptographique HMAC du QR Code dynamique de paiement (rotation 30s).</li>
              </ul>

              <h4 className="font-bold text-[#14110F] pt-2">2. Finalité des traitements</h4>
              <p>
                Vos données sont exclusivement utilisées pour :
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>La délivrance et le contrôle d'accès sécurisé à votre événement.</li>
                <li>Le bon fonctionnement du portefeuille Cashless sans contact.</li>
                <li>La lutte contre la fraude (règle Anti-Passback, prévention des doubles dépenses).</li>
                <li>Le reversement de la part de solidarité (ex : 10% Fondation Congolicious) en toute transparence.</li>
              </ul>

              <h4 className="font-bold text-[#14110F] pt-2">3. Non-vente et sécurité des données</h4>
              <p>
                VUKA Pay et MOKILI SAS ne vendent, ne louent ni ne cèdent aucune donnée personnelle à des courtiers ou annonceurs tiers. Toutes les transmissions sont chiffrées selon les protocoles TLS 1.3 et les bases de données bénéficient de sauvegardes chiffrées.
              </p>

              <h4 className="font-bold text-[#14110F] pt-2">4. Vos droits</h4>
              <p>
                Vous disposez d'un droit d'accès, de rectification, de portabilité et de suppression de vos données personnelles. Vous pouvez exercer ce droit à tout moment en contactant notre délégué à la protection des données à l'adresse : <strong>privacy@mokili.io</strong> ou <strong>support@vukapay.cd</strong>.
              </p>
            </div>
          )}

          {activeTab === 'TERMS' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-[#14110F] font-heading">
                Conditions Générales d'Utilisation et de Vente (CGU / CGV)
              </h3>
              
              <h4 className="font-bold text-[#14110F] pt-2">1. Objet du service</h4>
              <p>
                VUKA Pay fournit une infrastructure logicielle et matérielle unifiée permettant aux organisateurs d'événements de commercialiser des billets d'entrée, de gérer le contrôle d'accès physique et d'opérer des encaissements cashless sans contact (terminaux POS Sunmi, puces RFID MIFARE DESFire et QR codes dynamiques).
              </p>

              <h4 className="font-bold text-[#14110F] pt-2">2. Achat de billets et délivrance</h4>
              <p>
                Tout achat de billet validé par paiement Mobile Money (M-Pesa, Orange Money, Airtel Money) ou carte bancaire génère un billet électronique unique infalsifiable. Le billet est délivré instantanément par affichage écran, email de confirmation et/ou notification WhatsApp.
              </p>

              <h4 className="font-bold text-[#14110F] pt-2">3. Contrôle d'accès & Règle Anti-Passback</h4>
              <p>
                Chaque billet ne peut être scanné qu'une seule fois à l'entrée du site pour un jour donné. Toute tentative de réutilisation d'un même code pour une tierce personne déclenchera une alerte Anti-Passback et sera refusée par les agents de filtrage.
              </p>

              <h4 className="font-bold text-[#14110F] pt-2">4. Solde Cashless et Remboursements</h4>
              <p>
                Les fonds chargés sur le portefeuille Cashless VUKA Pay sont utilisables sur l'ensemble des stands partenaires de l'événement. À l'issue de l'événement, les festivaliers peuvent solliciter le remboursement du solde résiduel sur leur compte Mobile Money conformément aux modalités fixées par l'organisateur.
              </p>

              <h4 className="font-bold text-[#14110F] pt-2">5. Force majeure et annulations</h4>
              <p>
                En cas d'annulation totale d'un événement par décision de l'organisateur ou pour cause de force majeure (décision administrative, intempéries exceptionnelles), les modalités de report ou de remboursement intégral sont régies par la politique officielle de l'organisateur concerné.
              </p>
            </div>
          )}

          {activeTab === 'LEGAL_NOTICE' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-[#14110F] font-heading">
                Mentions Légales Obligatoires
              </h3>

              <h4 className="font-bold text-[#14110F] pt-2">1. Éditeur de la Plateforme</h4>
              <p>
                La plateforme <strong>VUKA Pay</strong> (vukapay.cd) est éditée et exploitée par :
              </p>
              <div className="p-4 rounded-2xl bg-[#FBF6EE] border border-[#D9D0C6] space-y-1 text-xs">
                <div><strong>Raison sociale :</strong> MOKILI SAS</div>
                <div><strong>Forme juridique :</strong> Société par Actions Simplifiée (SAS)</div>
                <div><strong>Siège social :</strong> Boulevard du 30 Juin, Kinshasa - Gombe, RDC</div>
                <div><strong>Courriel officiel :</strong> contact@mokili.io</div>
                <div><strong>Site web officiel :</strong> <a href="https://mokili.io" target="_blank" rel="noopener noreferrer" className="text-[#FF6A2B] underline">https://mokili.io</a></div>
              </div>

              <h4 className="font-bold text-[#14110F] pt-2">2. Direction de la publication</h4>
              <p>
                <strong>Directeur de la publication :</strong> Direction Générale MOKILI SAS.
              </p>

              <h4 className="font-bold text-[#14110F] pt-2">3. Hébergement de la plateforme</h4>
              <p>
                L'infrastructure serveur et le réseau de distribution mondial (CDN) sont opérés sur des datacenters haute disponibilité avec redondance satellite Starlink pour les déploiements terrain à Kinshasa.
              </p>
              <div className="p-4 rounded-2xl bg-[#FBF6EE] border border-[#D9D0C6] space-y-1 text-xs">
                <div><strong>Fournisseur d'infrastructure Cloud :</strong> Vercel Inc. & Cloudflare Inc.</div>
                <div><strong>Liaison satellite locale :</strong> Réseau Starlink RDC redondé</div>
              </div>

              <h4 className="font-bold text-[#14110F] pt-2">4. Propriété intellectuelle</h4>
              <p>
                L'ensemble des marques, logos (dont VUKA et MOKILI), interfaces graphiques, algorithmes cryptographiques de rotation QR et codes sources sont la propriété exclusive de MOKILI SAS. Toute reproduction ou contrefaçon est strictement interdite.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-[#F3ECE2] bg-[#FBF6EE] flex items-center justify-between">
          <span className="text-xs text-[#7A7068]">
            Dernière mise à jour : Octobre 2026
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-full bg-[#14110F] hover:bg-[#2B2623] text-[#FBF6EE] text-xs font-semibold transition active:scale-95"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
};
