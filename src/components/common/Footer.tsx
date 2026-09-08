import React from 'react';
import { ShieldCheck, Heart, Sparkles, ExternalLink, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800 bg-[#070A12] text-slate-400 py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF5722] to-[#FFB300] flex items-center justify-center font-bold text-white shadow-vuka text-xl">
                V
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                VUKA<span className="text-[#FF5722]">Pay</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Super App souveraine de billetterie, contrôle d'accès et cashless 100% sans contact. Conçue pour les réalités du terrain congolais et les grands événements africains.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              <span>Souveraineté des données & Sécurité bancaire</span>
            </div>
          </div>

          {/* Solutions Weezevent-Style */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Solutions Événementielles
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <span className="text-slate-300 hover:text-white transition cursor-pointer flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#3B82F6]"></span>
                  VUKA Ticket — Billetterie en ligne
                </span>
              </li>
              <li>
                <span className="text-slate-300 hover:text-white transition cursor-pointer flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
                  VUKA Access — Contrôle d'accès RFID
                </span>
              </li>
              <li>
                <span className="text-slate-300 hover:text-white transition cursor-pointer flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#FF5722]"></span>
                  VUKA Pay — Portefeuille & Cashless
                </span>
              </li>
              <li>
                <span className="text-slate-300 hover:text-white transition cursor-pointer flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#FFB300]"></span>
                  VUKA POS — Terminaux Caisse Sunmi
                </span>
              </li>
            </ul>
          </div>

          {/* Impact & Partenaires */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Modèle Solidaire
            </h4>
            <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900/90 to-slate-900/50 border border-slate-800 text-xs space-y-2">
              <div className="flex items-center gap-1.5 text-[#FFB300] font-semibold">
                <Heart className="w-4 h-4 fill-[#FFB300]" />
                <span>10% reversés à la Fondation</span>
              </div>
              <p className="text-slate-400">
                Sur chaque transaction effectuée sur les 23 stands du Congo Food Week 6, 10% financent des actions d'impact social pour la Fondation Congolicious.
              </p>
            </div>
          </div>

          {/* Technologie & LAB3 */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Infrastructures RDC
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00D2FF]"></span>
                <span>Terminaux Android Sunmi V2S</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00D2FF]"></span>
                <span>Double liaison Starlink redondante</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00D2FF]"></span>
                <span>Puces MIFARE DESFire & QR Dynamique</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00D2FF]"></span>
                <span>Passerelle M-Pesa Vodacom intégrée</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar — Mention OBLIGATOIRE "Propulsé par MOKILI" */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 VUKA Pay & LAB3. Développé pour le Congo Food Week 6.</p>
          
          {/* MENTION OFFICIELLE MOKILI */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/90 border border-slate-800 text-slate-300">
            <span>Propulsé par</span>
            <a 
              href="https://mokili.io" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-bold text-[#FF5722] hover:text-[#FFB300] transition flex items-center gap-1 group"
            >
              <span>MOKILI</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">mokili.io</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <span>Kinshasa, RDC</span>
            <span>•</span>
            <span>Mode Offline-First</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
