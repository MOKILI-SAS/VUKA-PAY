import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { generateDynamicQR } from '../../utils/qrCrypto';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, RefreshCw, Lock, Sparkles, CheckCircle2 } from 'lucide-react';

export const DynamicQRCode: React.FC = () => {
  const { wallet } = useApp();
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [secondsRemaining, setSecondsRemaining] = useState<number>(30);
  const [signature, setSignature] = useState<string>('');
  const [payloadPreview, setPayloadPreview] = useState<string>('');

  useEffect(() => {
    const updateQR = () => {
      const { payloadString, remainingSeconds, signature } = generateDynamicQR(
        wallet.id,
        wallet.festivalierName,
        wallet.phone
      );

      setSecondsRemaining(remainingSeconds);
      setSignature(signature);
      setPayloadPreview(payloadString);

      QRCode.toDataURL(payloadString, {
        width: 240,
        margin: 1,
        color: {
          dark: '#14110F',
          light: '#FFFFFF'
        }
      }).then(setQrDataUrl).catch(console.error);
    };

    updateQR();
    const interval = setInterval(updateQR, 1000);
    return () => clearInterval(interval);
  }, [wallet]);

  // Calcul du pourcentage restant pour l'anneau de progression (30 secondes)
  const progressPercent = (secondsRemaining / 30) * 100;
  const isUrgent = secondsRemaining <= 5;

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white border border-[#E5E0D8] rounded-[32px] max-w-sm mx-auto shadow-sm">
      
      {/* Header Badge */}
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFE3D3] border border-[#FF6A2B]/20 text-[#FF6A2B] text-xs font-bold uppercase tracking-wider mb-4">
        <Lock className="w-3.5 h-3.5 text-[#FF6A2B]" />
        <span>Paiement Sans Contact Sécurisé</span>
      </div>

      <h3 className="text-lg font-black text-[#14110F] text-center mb-1 font-poppins">
        Scannez pour payer au stand
      </h3>
      <p className="text-xs text-[#9C9488] text-center mb-6 font-normal">
        Ce QR Code tourne automatiquement toutes les 30 secondes pour bloquer les fraudes par capture d'écran.
      </p>

      {/* QR Code Container with Animated Ring */}
      <div className="relative p-5 rounded-3xl bg-[#FBF6EE] border border-[#E5E0D8] shadow-inner flex flex-col items-center justify-center">
        {qrDataUrl ? (
          <img src={qrDataUrl} alt="QR Code Dynamique VUKA" className="w-52 h-52 object-contain" />
        ) : (
          <div className="w-52 h-52 flex items-center justify-center">
            <RefreshCw className="w-8 h-8 text-[#9C9488] animate-spin" />
          </div>
        )}

        {/* Floating Rotating Signature */}
        <div className="mt-2 text-[10px] font-mono text-[#14110F] font-bold tracking-widest uppercase">
          ID: {wallet.id.slice(0, 10)} • KEY: {signature}
        </div>
      </div>

      {/* Countdown Progress Bar */}
      <div className="w-full mt-6 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#9C9488] flex items-center gap-1 font-medium">
            <RefreshCw className={`w-3.5 h-3.5 ${isUrgent ? 'animate-spin text-[#C62828]' : 'text-[#FF6A2B]'}`} />
            <span>Renouvellement automatique :</span>
          </span>
          <span className={`font-mono font-bold ${isUrgent ? 'text-[#C62828] animate-pulse' : 'text-[#14110F]'}`}>
            {secondsRemaining}s
          </span>
        </div>

        <div className="w-full h-2 rounded-full bg-[#F5F3EF] overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ${
              isUrgent ? 'bg-[#C62828]' : 'bg-[#FF6A2B]'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Anti-Fraud Notice */}
      <div className="mt-6 p-3 rounded-2xl bg-[#E3EEF6] border border-[#0E5A8A]/20 text-[11px] text-[#0E5A8A] flex items-start gap-2.5 font-medium">
        <ShieldAlert className="w-4 h-4 text-[#0E5A8A] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-[#14110F]">Protection Anti-Fraude :</span> Les captures d'écran et photos de ce QR code sont automatiquement rejetées par les caisses Sunmi V2S.
        </div>
      </div>

    </div>
  );
};
