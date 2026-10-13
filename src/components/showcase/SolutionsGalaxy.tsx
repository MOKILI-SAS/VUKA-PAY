import React from 'react';
import { useApp } from '../../context/AppContext';
import { Star, ShieldCheck, Heart, Sparkles, Check, ArrowRight } from 'lucide-react';

export const SolutionsGalaxy: React.FC<{ onSelectTicket: () => void }> = ({ onSelectTicket }) => {
  const { setCurrentRole } = useApp();

  return (
    <section id="tarifs" className="py-16 sm:py-20 bg-[#FBF6EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Headline */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="w-8 h-1 bg-[#FF6A2B] rounded-full mx-auto mb-3" />
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#14110F] leading-tight font-heading">
            La billetterie & cashless souveraine pensée pour l'Afrique.
          </h2>
          <p className="text-sm sm:text-base text-[#7A7068] mt-3">
            Trois fondations d'excellence : Fluide, Chaleureux et Fiable.
          </p>
        </div>

        {/* 3 Pillar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          
          {/* Card 1: Fluide — Header Braise #FF6A2B */}
          <div className="rounded-[24px] bg-white border border-[#D9D0C6] shadow-level1 hover:shadow-md transition-all duration-300 flex flex-col p-3">
            
            {/* Header Box: Braise #FF6A2B (Règle : Texte Nuit #14110F) */}
            <div className="rounded-[18px] bg-[#FF6A2B] text-[#14110F] p-6 relative overflow-hidden flex flex-col justify-between min-h-[190px]">
              <div className="flex justify-between items-start">
                <svg className="w-16 h-16 text-[#14110F]" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M24 38 L20 22 C19 18 24 16 26 20 L28 28 L28 14 C28 10 33 10 34 14 L34 28 L35 12 C36 8 41 8 42 12 L42 28 L43 14 C44 10 49 10 50 14 L50 36 C50 48 40 56 30 56 C20 56 16 48 16 40" />
                  <path d="M14 44 C18 42 34 42 46 48" strokeWidth="3.5" stroke="#FFC21A" />
                </svg>
                <span className="px-2.5 py-1 rounded-full bg-black/10 text-xs font-bold font-mono">0 friction</span>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-[#14110F] leading-tight font-heading">Fluide.</h3>
                <p className="text-[#14110F]/80 text-xs font-semibold mt-0.5">Aucune friction, aucun temps d'attente.</p>
              </div>
            </div>

            {/* Card 1 Body */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-6">
              <div>
                <p className="text-xs sm:text-sm text-[#4A433D] font-normal leading-relaxed mb-4">
                  Pour 10 ou 25 000 participants, lancez votre billetterie et cashless en quelques clics :
                </p>

                <ul className="space-y-2 text-xs text-[#7A7068] font-medium">
                  <li className="flex items-start gap-2">
                    <span className="text-[#FF6A2B] font-bold">•</span>
                    <span>Créez votre événement et vos pass en toute autonomie</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#FF6A2B] font-bold">•</span>
                    <span>Payer en un geste partout avec le moyen de son choix</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#FF6A2B] font-bold">•</span>
                    <span>Vendez, invitez et partagez vos QR codes instantanément</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#FF6A2B] font-bold">•</span>
                    <span>Gestion des stocks et des flux en temps réel</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#FF6A2B] font-bold">•</span>
                    <span>Support dédié et assistance technique sur site</span>
                  </li>
                </ul>
              </div>

              <div className="pt-2">
                <button
                  onClick={onSelectTicket}
                  className="w-full inline-flex items-center justify-center rounded-full bg-[#FF6A2B] hover:bg-[#E24E10] text-[#14110F] font-bold py-3 text-xs uppercase tracking-wider transition shadow-sm active:scale-95"
                >
                  Créer une billetterie
                </button>
              </div>
            </div>

          </div>

          {/* Card 2: Chaleureux / Solidaire — Header Nuit #14110F */}
          <div className="rounded-[24px] bg-white border border-[#D9D0C6] shadow-level1 hover:shadow-md transition-all duration-300 flex flex-col p-3">
            
            {/* Header Box: Nuit #14110F */}
            <div className="rounded-[18px] bg-[#14110F] text-[#FBF6EE] p-6 relative overflow-hidden flex flex-col justify-between min-h-[190px]">
              <div className="flex justify-between items-start">
                <svg className="w-16 h-16 text-[#FFC21A]" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="32" cy="26" r="16" />
                  <path d="M32 16 L35 23 L42 24 L37 29 L38 36 L32 32 L26 36 L27 29 L22 24 L29 23 Z" fill="#FFC21A" />
                  <path d="M24 38 L18 56 L30 50 L34 52" />
                  <path d="M40 38 L46 56 L34 50" />
                </svg>
                <span className="px-2.5 py-1 rounded-full bg-white/10 text-xs font-bold text-[#FFC21A] font-mono">Ancré Kinshasa</span>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-[#FBF6EE] leading-tight font-heading">Chaleureux.</h3>
                <p className="text-[#D9D0C6] text-xs font-normal mt-0.5">Festif, gourmand, transparent & solidaire.</p>
              </div>
            </div>

            {/* Card 2 Body */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-6">
              <div>
                <div className="mb-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl sm:text-5xl font-bold text-[#FF6A2B] tracking-tight font-mono tnum">2,5%</span>
                    <span className="text-[11px] text-[#7A7068] font-bold uppercase">par billet en ligne</span>
                  </div>
                  <div className="text-xs text-[#14110F] font-bold mt-1 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#FF6A2B]" />
                    <span>+ 10% solidaire pour la Fondation Congolicious</span>
                  </div>
                </div>

                <ul className="space-y-2 text-xs text-[#7A7068] font-medium">
                  <li className="flex items-start gap-2">
                    <span className="text-[#FF6A2B] font-bold">•</span>
                    <span>Tous les moyens de paiement acceptés (M-Pesa, Orange, Airtel, Visa)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#FF6A2B] font-bold">•</span>
                    <span>Sans frais d'installation ni de mise en service</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#FF6A2B] font-bold">•</span>
                    <span>Sans abonnement, ni engagement de durée</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#FF6A2B] font-bold">•</span>
                    <span>Recettes nettes reversées chaque soir aux 23 stands</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#FF6A2B] font-bold">•</span>
                    <span>Gratuit pour les billets gratuits et invitations</span>
                  </li>
                </ul>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setCurrentRole('SUPER_ADMIN')}
                  className="w-full inline-flex items-center justify-center rounded-full bg-[#14110F] text-[#FBF6EE] font-bold py-3 text-xs uppercase tracking-wider hover:bg-[#2A2420] transition active:scale-95"
                >
                  Voir la trésorerie
                </button>
              </div>
            </div>

          </div>

          {/* Card 3: Fiable — Header Fleuve #0E5A8A */}
          <div className="rounded-[24px] bg-white border border-[#D9D0C6] shadow-level1 hover:shadow-md transition-all duration-300 flex flex-col p-3">
            
            {/* Header Box: Fleuve #0E5A8A */}
            <div className="rounded-[18px] bg-[#0E5A8A] text-white p-6 relative overflow-hidden flex flex-col justify-between min-h-[190px]">
              <div className="flex justify-between items-start">
                <svg className="w-16 h-16 text-white" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="18" y="26" width="28" height="24" rx="6" />
                  <path d="M24 26 V18 C24 13.5 27.5 10 32 10 C36.5 10 40 13.5 40 18 V26" />
                  <path d="M32 34 V42" strokeWidth="3" />
                  <circle cx="32" cy="38" r="2" fill="#FFC21A" />
                </svg>
                <span className="px-2.5 py-1 rounded-full bg-white/15 text-xs font-bold text-white font-mono">100% Offline</span>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white leading-tight font-heading">Fiable.</h3>
                <p className="text-white/80 text-xs font-normal mt-0.5">L'argent est traité avec sérieux et clarté.</p>
              </div>
            </div>

            {/* Card 3 Body */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-6">
              <div>
                <p className="text-xs sm:text-sm text-[#4A433D] font-normal leading-relaxed mb-4">
                  Depuis toujours, VUKA s'engage à ne jamais bloquer vos événements, ni exploiter vos données :
                </p>

                <ul className="space-y-2 text-xs text-[#7A7068] font-medium">
                  <li className="flex items-start gap-2">
                    <span className="text-[#0E5A8A] font-bold">•</span>
                    <span>100% Offline-First : encaissements garantis sans réseau</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0E5A8A] font-bold">•</span>
                    <span>Synchronisation asynchrone par antenne Starlink</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0E5A8A] font-bold">•</span>
                    <span>QR Codes dynamiques tournant toutes les 30s anti-fraude</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0E5A8A] font-bold">•</span>
                    <span>Contrôle d'accès certifié anti-passback en &lt; 500 ms</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#0E5A8A] font-bold">•</span>
                    <span>Vous êtes les seuls propriétaires de vos données</span>
                  </li>
                </ul>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setCurrentRole('STAND_MANAGER')}
                  className="w-full inline-flex items-center justify-center rounded-full border border-[#0E5A8A] text-[#0E5A8A] font-bold py-2.5 text-xs uppercase tracking-wider hover:bg-[#E3EEF6] transition active:scale-95"
                >
                  Tester la caisse POS
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* Floating Testimonial Widget */}
        <div className="mt-12 max-w-sm rounded-2xl bg-white border border-slate-200 p-4 shadow-sm flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FF6A2B] text-[#14110F] flex items-center justify-center font-display font-black text-xs flex-shrink-0">
            CFW
          </div>
          <div>
            <div className="flex items-center gap-1 text-[#FFB300] mb-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-[#FFB300]" />
              ))}
            </div>
            <p className="text-[12px] text-slate-700 leading-snug font-medium mb-1.5">
              "Nous apprécions l'autonomie qu'offre VUKA Pay. Le fait de maîtriser les encaissements sur les 23 stands nous permet d'être réactifs en temps réel."
            </p>
            <div className="text-[10px] text-slate-500 font-semibold">
              Benjamin C. / Billetterie & Développement — Kinshasa
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
