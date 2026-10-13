import React from 'react';
import { ArrowRight, Check, Star, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Hero: React.FC<{ onExploreTickets: () => void }> = ({ onExploreTickets }) => {
  const { setCurrentRole } = useApp();

  return (
    <section className="relative overflow-hidden pt-8 pb-16 sm:pt-14 sm:pb-24 bg-[#FAFAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Weezevent Top Announcement Pill */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm text-xs font-semibold text-slate-800 hover:border-slate-300 transition-all cursor-pointer">
            <span className="px-2.5 py-0.5 rounded-full bg-[#FF6A2B] text-[#14110F] text-[10px] font-black uppercase tracking-wider">
              Nouveauté
            </span>
            <span className="text-slate-700">
              Découvrez ce qui accélère vos ventes de billets ! <span className="text-[#FF6A2B] font-bold">Faites le test gratuitement.</span>
            </span>
          </div>
        </div>

        {/* Hero Content Grid */}
        <div className="relative text-center max-w-4xl mx-auto">
          
          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-[76px] font-display font-black tracking-tight text-[#14110F] leading-[1.04] mb-6">
            Lancez rapidement. Vendez plus.
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-9 leading-relaxed font-normal">
            Depuis 2008, la seule{' '}
            <span className="text-[#14110F] font-semibold underline decoration-[#FF6A2B] decoration-2 underline-offset-4">
              billetterie
            </span>{' '}
            qui reste simple et évolue avec vos besoins. Adaptée pour Kinshasa et le Congo Food Week 6.
          </p>

          {/* Centered Primary CTA Pill Button */}
          <div className="flex justify-center mb-5">
            <button
              onClick={onExploreTickets}
              className="inline-flex items-center justify-center rounded-full bg-[#FF6A2B] text-[#14110F] font-display font-black px-10 py-4 text-base md:text-lg shadow-lg shadow-[#FF6A2B]/20 hover:bg-[#e0561d] hover:shadow-xl transition-all active:scale-[0.98]"
            >
              Créer ma billetterie
            </button>
          </div>

          {/* Weezevent Checkmarks List */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm font-semibold text-slate-700 mb-8">
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-[#FF6A2B] stroke-[3]" />
              <span>Pour tous les événements.</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-[#FF6A2B] stroke-[3]" />
              <span>Inscription gratuite et sans engagement.</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-[#FF6A2B] stroke-[3]" />
              <span>100% Cashless & Mobile Money.</span>
            </div>
          </div>

          {/* Made in / Origin Badge */}
          <div className="inline-flex items-center gap-2 text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-12">
            <span className="w-2 h-2 rounded-full bg-[#FF6A2B]" />
            <span>PROPULSÉ PAR MOKILI • CONÇU POUR LA RDC</span>
          </div>

          {/* Illustrations Flat 2D Weezevent Style (Left and Right) */}
          <div className="relative mt-4 flex items-center justify-between pointer-events-none">
            
            {/* Left 2D Illustration: Sofa / Laptop / Ticket */}
            <div className="hidden md:flex flex-col items-center absolute -left-12 bottom-0 w-64 text-left">
              {/* Ticket screen card */}
              <div className="w-32 h-16 rounded-xl border-2 border-[#14110F] bg-white p-2 shadow-sm mb-2 transform -rotate-6">
                <div className="flex items-center justify-between border-b border-slate-200 pb-1">
                  <span className="text-[9px] font-black text-[#FF6A2B]">VUKA PASS</span>
                  <div className="w-2 h-2 rounded-full bg-[#FF6A2B]"></div>
                </div>
                <div className="text-[10px] font-mono mt-1 font-bold">CFW6 • VIP</div>
              </div>
              {/* Character sitting on sofa */}
              <div className="relative w-44 h-28 border-2 border-[#14110F] rounded-3xl bg-white p-3 shadow-md flex items-end justify-center">
                <div className="w-8 h-8 rounded-full bg-[#FF6A2B] border-2 border-[#14110F] absolute -top-4 left-10"></div>
                <div className="w-14 h-12 rounded-2xl bg-[#14110F] text-white text-[8px] flex items-center justify-center font-bold">
                  LAPTOP
                </div>
              </div>
              {/* Braise doodle swoosh */}
              <svg className="w-20 h-10 text-[#FF6A2B] -mt-2" viewBox="0 0 100 40" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 20 Q 30 5, 60 25 T 90 10" />
              </svg>
            </div>

            {/* Right 2D Illustration: Stage Spotlights & Dancers */}
            <div className="hidden md:flex flex-col items-center absolute -right-12 bottom-0 w-64 text-right">
              {/* Stage lights grid */}
              <div className="w-48 h-8 border-2 border-[#14110F] rounded-lg bg-slate-100 flex items-center justify-around px-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-[#FFC21A] border border-[#14110F]"></div>
                <div className="w-3 h-3 rounded-full bg-[#FF6A2B] border border-[#14110F]"></div>
                <div className="w-3 h-3 rounded-full bg-[#0E5A8A] border border-[#14110F]"></div>
              </div>
              {/* Character dancing / celebrating */}
              <div className="relative w-40 h-28 border-2 border-[#14110F] rounded-2xl bg-white p-3 shadow-md flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-[#FF6A2B] border-2 border-[#14110F] absolute -top-4 right-10"></div>
                <div className="text-center">
                  <span className="text-xs font-black text-[#14110F]">25 000</span>
                  <div className="text-[9px] text-slate-500 font-bold uppercase">Festivaliers</div>
                </div>
              </div>
              {/* Braise doodle swirl */}
              <svg className="w-20 h-10 text-[#FF6A2B] -mt-2" viewBox="0 0 100 40" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 10 Q 50 35, 90 15" />
              </svg>
            </div>

          </div>

        </div>

        {/* Floating Testimonial Card */}
        <div className="mt-14 max-w-sm rounded-2xl bg-white border border-slate-200 p-4 shadow-lg shadow-slate-200/50 flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FF6A2B] text-[#14110F] flex items-center justify-center font-display font-black text-sm flex-shrink-0">
            CFW
          </div>
          <div>
            <div className="flex items-center gap-1 text-[#FF8A00] mb-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-[#FF8A00]" />
              ))}
            </div>
            <p className="text-[12px] text-slate-700 leading-snug font-medium mb-1.5">
              "L'interface de gestion de la billetterie et l'application de scan sont fluides et intuitives. Zéro coupure pendant le festival."
            </p>
            <div className="text-[10px] text-slate-500 font-semibold">
              Julie M. • Directrice de Projets — Congo Food Week
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
