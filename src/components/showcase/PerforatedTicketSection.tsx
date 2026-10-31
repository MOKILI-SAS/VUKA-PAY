import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { useApp } from '../../context/AppContext';
import { ArrowRight, Smartphone, CheckCircle2 } from 'lucide-react';

interface PerforatedTicketSectionProps {
  onExploreTickets?: () => void;
}

export const PerforatedTicketSection: React.FC<PerforatedTicketSectionProps> = ({ onExploreTickets }) => {
  const { setCurrentRole } = useApp();
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  useEffect(() => {
    // Génération d'un QR code test pointant vers le portefeuille / démo festivalier
    const demoUrl = window.location.origin + '?mode=festivalier_demo';
    QRCode.toDataURL(demoUrl, {
      width: 260,
      margin: 1,
      color: {
        dark: '#14110F',
        light: '#FFFFFF'
      }
    }).then(setQrCodeDataUrl).catch(console.error);
  }, []);

  return (
    <section id="cashless-section" className="py-16 sm:py-20 bg-[#FBF6EE] overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Headline */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="w-8 h-1 bg-[#FF6A2B] rounded-full mx-auto mb-3" />
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#14110F] leading-tight mb-4 font-heading">
            80% des participants réservent depuis leur téléphone.
            <br />
            <span className="text-[#FF6A2B]">Scannez et testez !</span>
          </h2>
          <p className="text-base sm:text-lg text-[#7A7068]">
            Une billetterie mobile-first fluide conçue pour convertir sans friction avec Vodacom M-Pesa.
          </p>
        </div>

        {/* The Giant Deep Nuit Perforated Ticket Graphic */}
        <div className="relative max-w-4xl mx-auto">
          
          {/* Decorative swooshes */}
          <svg 
            className="absolute -top-8 -left-8 w-20 h-20 text-[#FF6A2B] opacity-40 pointer-events-none hidden sm:block"
            viewBox="0 0 100 100" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="3"
          >
            <path d="M10 80 Q 40 10, 90 20 M30 85 Q 60 40, 95 60" />
          </svg>

          <svg 
            className="absolute -bottom-8 -right-8 w-24 h-24 text-[#FFC21A] opacity-40 pointer-events-none hidden sm:block"
            viewBox="0 0 100 100" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="3"
          >
            <path d="M20 10 Q 80 40, 70 90 M40 15 Q 90 60, 90 95" />
          </svg>

          {/* Ticket Card Container with Notches */}
          <div className="relative rounded-[24px] bg-[#14110F] text-[#FBF6EE] p-6 sm:p-12 shadow-level2 overflow-hidden">
            
            {/* Ticket Notches: Half-circles on left and right borders matching page background */}
            <div className="absolute top-1/2 -left-6 -translate-y-1/2 w-12 h-12 rounded-full bg-[#FBF6EE] z-10" />
            <div className="absolute top-1/2 -right-6 -translate-y-1/2 w-12 h-12 rounded-full bg-[#FBF6EE] z-10" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Half: Scannable QR Code Stub */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center p-4">
                <div className="relative bg-white p-5 rounded-[20px] shadow-level2 flex flex-col items-center">
                  {qrCodeDataUrl ? (
                    <img 
                      src={qrCodeDataUrl} 
                      alt="Scannez pour tester VUKA Pay" 
                      className="w-48 h-48 sm:w-56 sm:h-56 object-contain rounded-[12px]"
                    />
                  ) : (
                    <div className="w-48 h-48 sm:w-56 sm:h-56 bg-[#F3ECE2] animate-pulse rounded-[12px]" />
                  )}
                  <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-[#FF6A2B] uppercase tracking-wider">
                    <Smartphone className="w-4 h-4 text-[#FF6A2B]" />
                    <span>Scannez avec l'appareil photo</span>
                  </div>
                </div>
              </div>

              {/* Middle Dashed Perforation Line */}
              <div className="hidden lg:flex lg:col-span-1 justify-center h-full">
                <div className="w-px border-r-2 border-dashed border-white/20 h-64" />
              </div>

              {/* Right Half: Body & Interactive Copy */}
              <div className="lg:col-span-6 space-y-5 text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-[#FFC21A] text-xs font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFC21A]" />
                  <span>Expérience Live Sans App</span>
                </div>

                <h3 className="text-2xl sm:text-4xl font-bold text-[#FBF6EE] leading-tight font-heading">
                  Un événement commence par sa billetterie.
                </h3>

                <p className="text-[#D9D0C6] text-sm sm:text-base leading-relaxed font-normal">
                  VUKA Pay offre une expérience de réservation simple et accessible, sans création de compte. Testez par vous-même en scannant ce QR code avec votre smartphone ou en cliquant directement ci-dessous.
                </p>

                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    onClick={() => setCurrentRole('FESTIVALIER')}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#FF6A2B] hover:bg-[#E24E10] text-[#14110F] font-bold text-sm transition shadow-sm active:scale-95"
                  >
                    <span>Ouvrir la démo mobile</span>
                    <ArrowRight className="w-4 h-4 text-[#14110F]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (onExploreTickets) {
                        onExploreTickets();
                      } else {
                        const el = document.getElementById('evenements');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="inline-flex items-center justify-center px-5 py-3.5 rounded-full border border-white/30 text-[#FBF6EE] font-semibold text-sm hover:bg-white/10 transition active:scale-95"
                  >
                    Voir les pass CFW6
                  </button>
                </div>

                <div className="pt-2 flex items-center gap-3 text-xs text-[#D9D0C6] font-medium">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#FFC21A]" />
                    Compatible iOS & Android
                  </span>
                  <span>•</span>
                  <span>Zéro installation requise</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
