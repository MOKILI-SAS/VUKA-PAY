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
          dark: '#0A0D17',
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
    <div className="flex flex-col items-center justify-center p-6 bg-slate-900 border border-slate-800 rounded-3xl max-w-sm mx-auto shadow-xl">
      
      {/* Header Badge */}
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF5722]/10 border border-[#FF5722]/20 text-[#FF5722] text-xs font-bold uppercase tracking-wider mb-4">
        <Lock className="w-3.5 h-3.5" />
        <span>Paiement Sans Contact Sécurisé</span>
      </div>

      <h3 className="text-lg font-bold text-white text-center mb-1">
        Scannez pour payer au stand
      </h3>
      <p className="text-xs text-slate-400 text-center mb-6">
        Ce QR Code tourne automatiquement toutes les 30 secondes pour bloquer les fraudes par capture d'écran.
      </p>

      {/* QR Code Container with Animated Ring */}
      <div className="relative p-5 rounded-3xl bg-white shadow-2xl flex flex-col items-center justify-center">
        {qrDataUrl ? (
          <img src={qrDataUrl} alt="QR Code Dynamique VUKA" className="w-52 h-52 object-contain" />
        ) : (
          <div className="w-52 h-52 flex items-center justify-center">
            <RefreshCw className="w-8 h-8 text-slate-400 animate-spin" />
          </div>
        )}

        {/* Floating Rotating Signature */}
        <div className="mt-2 text-[10px] font-mono text-slate-700 font-bold tracking-widest uppercase">
          ID: {wallet.id.slice(0, 10)} • KEY: {signature}
        </div>
      </div>

      {/* Countdown Progress Bar */}
      <div className="w-full mt-6 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 flex items-center gap-1">
            <RefreshCw className={`w-3.5 h-3.5 ${isUrgent ? 'animate-spin text-red-400' : 'text-[#FF5722]'}`} />
            <span>Renouvellement automatique :</span>
          </span>
          <span className={`font-mono font-bold ${isUrgent ? 'text-red-400 animate-pulse' : 'text-white'}`}>
            {secondsRemaining}s
          </span>
        </div>

        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ${
              isUrgent ? 'bg-red-500' : 'bg-gradient-to-r from-[#FF5722] to-[#FFB300]'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Anti-Fraud Notice */}
      <div className="mt-6 p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-[#FFB300] shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-200">Protection Anti-Fraude :</span> Les captures d'écran et photos de ce QR code sont automatiquement rejetées par les caisses Sunmi V2S.
        </div>
      </div>

    </div>
  );
};
