import React from 'react';
import { Ticket, QrCode, Wallet, Store, ArrowRight, CheckCircle2, Shield, Wifi, Zap } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SolutionsGalaxy: React.FC<{ onSelectTicket: () => void }> = ({ onSelectTicket }) => {
  const { setCurrentRole } = useApp();

  const solutions = [
    {
      id: 'ticket',
      badge: 'VUKA TICKET',
      badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      title: 'Billetterie en Ligne Intelligente',
      desc: 'Vente de billets dématérialisés en ligne, pass multijours personnalisés, quotas en temps réel et paiement direct par M-Pesa.',
      features: [
        'Pass 6 Jours Tissu Premium & Pass Journaliers',
        'Paiement sécurisé Vodacom M-Pesa C2B',
        'Billet numérique avec QR Code sécurisé infalsifiable',
        'Zéro commission envoyée à l’étranger'
      ],
      ctaText: 'Commander un Pass',
      action: onSelectTicket,
      icon: <Ticket className="w-6 h-6 text-blue-400" />,
      accentBorder: 'hover:border-blue-500/40'
    },
    {
      id: 'access',
      badge: 'VUKA ACCESS',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      title: 'Contrôle d’Accès & Puces RFID',
      desc: 'Validation des entrées en moins de 500 millisecondes sur 6 postes de filtrage aux portes avec détection stricte des tentatives de réutilisation (anti-passback).',
      features: [
        'Scan ultra-rapide par caméra ou lecteur laser',
        'Appairage en un clic billet ➔ bracelet RFID MIFARE',
        'Jauge des festivaliers présents en temps réel',
        'Alerte sonore et visuelle en cas de faux billet'
      ],
      ctaText: 'Tester le Contrôle d’Accès',
      action: () => setCurrentRole('STAFF_ACCESS'),
      icon: <QrCode className="w-6 h-6 text-emerald-400" />,
      accentBorder: 'hover:border-emerald-500/40'
    },
    {
      id: 'pay',
      badge: 'VUKA PAY',
      badgeColor: 'bg-[#FF5722]/10 text-[#FF5722] border-[#FF5722]/30',
      title: 'Portefeuille Cashless 100% Mobile',
      desc: 'Le portefeuille numérique du festivalier pour recharger ses fonds via M-Pesa et payer instantanément sans espèces aux stands.',
      features: [
        'QR Code dynamique tournant toutes les 30 secondes (anti-capture)',
        'Support bracelet NFC / MIFARE DESFire sans contact',
        'Historique complet des commandes et reçus numériques',
        '10% prélevés automatiquement pour la Fondation Congolicious'
      ],
      ctaText: 'Ouvrir mon Wallet Démo',
      action: () => setCurrentRole('FESTIVALIER'),
      icon: <Wallet className="w-6 h-6 text-[#FF5722]" />,
      accentBorder: 'hover:border-[#FF5722]/40'
    },
    {
      id: 'pos',
      badge: 'VUKA POS',
      badgeColor: 'bg-[#FFB300]/10 text-[#FFB300] border-[#FFB300]/30',
      title: 'Terminaux Caisses Standiers',
      desc: 'Application d’encaissement tactile optimisée pour les terminaux Android Sunmi V2S et smartphones vendeurs avec résilience hors-ligne totale.',
      features: [
        'Mode Offline-First complet (encaissement sans Starlink)',
        'Débit instantané par scan du QR festivalier',
        'Gestion stricte des stocks avec validation admin obligatoire',
        'Ticket de caisse thermique ou numérique'
      ],
      ctaText: 'Lancer la Caisse Marchande',
      action: () => setCurrentRole('STAND_MANAGER'),
      icon: <Store className="w-6 h-6 text-[#FFB300]" />,
      accentBorder: 'hover:border-[#FFB300]/40'
    }
  ];

  return (
    <section className="py-20 bg-[#070A12] border-y border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">
            <Zap className="w-3.5 h-3.5 text-[#FF5722]" />
            <span>Architecture 4 Piliers (Inspiration Weezevent)</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Une suite événementielle complète, pensée pour l'Afrique
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            De la mise en vente des billets jusqu'au reversement final des recettes aux stands exposants, chaque brique fonctionne de manière autonome et synchronisée.
          </p>
        </div>

        {/* 4 Solutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {solutions.map((sol) => (
            <div
              key={sol.id}
              className={`p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 transition-all hover:bg-slate-900/90 ${sol.accentBorder} flex flex-col justify-between group shadow-lg`}
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className={`px-3 py-1 rounded-full text-xs font-bold border tracking-wider uppercase ${sol.badgeColor}`}>
                    {sol.badge}
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-slate-800/80 flex items-center justify-center border border-slate-700/60 group-hover:scale-110 transition-transform">
                    {sol.icon}
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-3">
                  {sol.title}
                </h3>

                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  {sol.desc}
                </p>

                <ul className="space-y-2.5 mb-8">
                  {sol.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={sol.action}
                className="w-full py-3.5 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700/90 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 border border-slate-700 group-hover:border-slate-500"
              >
                <span>{sol.ctaText}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
