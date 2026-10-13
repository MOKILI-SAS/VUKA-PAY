import React, { useState } from 'react';
import { MenuItem, CashlessTransaction } from '../../types';
import { useApp } from '../../context/AppContext';
import { generateDynamicQR, verifyDynamicQRPayload } from '../../utils/qrCrypto';
import { formatUSD, formatCDF } from '../../utils/formatters';
import { 
  X, 
  QrCode, 
  Radio, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw, 
  Zap, 
  Smartphone,
  ShieldAlert
} from 'lucide-react';

interface POSScannerModalProps {
  standId: string;
  cartItems: { product: MenuItem; quantity: number }[];
  totalAmountUSD: number;
  onClose: () => void;
  onSuccess: (tx: CashlessTransaction) => void;
}

export const POSScannerModal: React.FC<POSScannerModalProps> = ({
  standId,
  cartItems,
  totalAmountUSD,
  onClose,
  onSuccess
}) => {
  const { wallet, processPOSSale, isOffline } = useApp();

  const [paymentMode, setPaymentMode] = useState<'QR' | 'RFID'>('QR');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Simuler le scan du QR Code dynamique du festivalier
  const handleScanDynamicQR = async (simulateExpired = false) => {
    setIsProcessing(true);
    setErrorMessage(null);

    // Générer le payload
    const { payloadString } = generateDynamicQR(
      wallet.id,
      wallet.festivalierName,
      wallet.phone
    );

    let testPayload = payloadString;
    if (simulateExpired) {
      // Injecter une fenêtre temporelle vieille de 5 minutes pour tester le rejet anti-fraude
      const parsed = JSON.parse(payloadString);
      parsed.timeWindow -= 10;
      testPayload = JSON.stringify(parsed);
    }

    // Valider cryptographiquement le QR
    const verification = verifyDynamicQRPayload(testPayload);

    if (!verification.isValid) {
      setIsProcessing(false);
      setErrorMessage(verification.error || "Paiement rejeté : QR Code frauduleux ou expiré.");
      return;
    }

    // Effectuer la vente
    const res = await processPOSSale(standId, cartItems, 'WALLET_QR_DYNAMIC', verification.walletId);
    setIsProcessing(false);

    if (!res.success) {
      setErrorMessage(res.error || "Échec du règlement.");
      return;
    }

    if (res.transaction) {
      onSuccess(res.transaction);
    }
  };

  // Simuler le tag d'un bracelet RFID physique (MIFARE DESFire)
  const handleScanRFID = async () => {
    setIsProcessing(true);
    setErrorMessage(null);

    const res = await processPOSSale(standId, cartItems, 'WALLET_RFID', wallet.id);
    setIsProcessing(false);

    if (!res.success) {
      setErrorMessage(res.error || "Échec de lecture de la puce sans contact.");
      return;
    }

    if (res.transaction) {
      onSuccess(res.transaction);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md bg-[#1E1A17] border border-[#2A2420] rounded-[28px] p-6 sm:p-8 shadow-2xl my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#14110F] text-[#9C9488] hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFE3D3] border border-[#FF6A2B]/20 text-[#FF6A2B] text-xs font-bold uppercase tracking-wider mb-2">
            <span>Terminal d'Encaissement</span>
          </div>
          <h3 className="text-2xl font-black text-white font-poppins">
            Encaissement de {formatUSD(totalAmountUSD)}
          </h3>
          <p className="text-xs text-[#FFC21A] font-mono mt-0.5 font-bold">
            ≈ {formatCDF(totalAmountUSD)}
          </p>
        </div>

        {/* Offline Alert if applicable */}
        {isOffline && (
          <div className="mb-4 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="font-bold">Mode Hors-Ligne Actif :</span> L'encaissement sera validé en local et stocké dans le terminal jusqu'à la reconnexion Starlink.
            </div>
          </div>
        )}

        {/* Payment Method Switcher */}
        <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-[#14110F] border border-[#2A2420] mb-6">
          <button
            onClick={() => setPaymentMode('QR')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition ${
              paymentMode === 'QR' 
                ? 'bg-[#FF6A2B] text-[#14110F] shadow-sm font-black' 
                : 'text-[#9C9488] hover:text-white'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>Scan QR Dynamique</span>
          </button>

          <button
            onClick={() => setPaymentMode('RFID')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition ${
              paymentMode === 'RFID' 
                ? 'bg-[#FFC21A] text-[#14110F] shadow-sm font-black' 
                : 'text-[#9C9488] hover:text-white'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>Tag Bracelet RFID</span>
          </button>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="mb-4 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-2.5 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>{errorMessage}</div>
          </div>
        )}

        {/* Mode Content */}
        {paymentMode === 'QR' ? (
          <div className="space-y-4">
            {/* Simulated Camera Viewfinder */}
            <div className="relative w-full aspect-square max-w-[240px] mx-auto rounded-3xl bg-[#14110F] border-2 border-dashed border-[#FF6A2B]/80 flex flex-col items-center justify-center p-4 overflow-hidden">
              {/* Laser Scan Line */}
              <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#FF6A2B] to-transparent animate-pulse top-1/2 -translate-y-1/2 w-full" />
              
              <QrCode className="w-16 h-16 text-[#4A443D] mb-2" />
              <span className="text-[11px] text-[#9C9488] text-center font-medium">
                Visez le QR Code dynamique du festivalier
              </span>
              <span className="text-[9px] text-[#FF6A2B] font-mono mt-1 font-bold">
                Rotation 30s active
              </span>
            </div>

            {/* Test Action Trigger */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => handleScanDynamicQR(false)}
                disabled={isProcessing}
                className="w-full py-3.5 px-4 rounded-xl bg-[#FF6A2B] hover:bg-[#E24E10] disabled:opacity-50 text-[#14110F] font-bold text-xs uppercase tracking-wider shadow-md transition flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#14110F]" />
                    <span>Débit en cours...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-[#14110F]" />
                    <span>Débiter le Festivalier ({wallet.festivalierName})</span>
                  </>
                )}
              </button>

              {/* Negative Security Test: Simulate Expired / Screenshot Replay */}
              <button
                onClick={() => handleScanDynamicQR(true)}
                disabled={isProcessing}
                className="w-full py-2 px-3 rounded-xl bg-[#14110F] hover:bg-[#2A2420] border border-[#2A2420] text-[11px] text-[#9C9488] hover:text-[#C62828] transition flex items-center justify-center gap-1.5"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-[#C62828]" />
                <span>Tester le rejet d'une capture d'écran expirée</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* NFC Sensor Zone */}
            <div className="relative w-full aspect-square max-w-[240px] mx-auto rounded-3xl bg-[#14110F] border-2 border-dashed border-[#FFC21A]/60 flex flex-col items-center justify-center p-4">
              <div className="w-20 h-20 rounded-full bg-[#FFC21A]/10 border border-[#FFC21A]/30 flex items-center justify-center mb-3 animate-pulse">
                <Radio className="w-10 h-10 text-[#FFC21A]" />
              </div>
              <span className="text-[11px] text-[#F5F3EF] font-bold text-center">
                Approchez le bracelet du festivalier
              </span>
              <span className="text-[9px] text-[#FFC21A] text-center mt-0.5 font-bold">
                Puces MIFARE DESFire EV2/EV3
              </span>
            </div>

            <button
              onClick={handleScanRFID}
              disabled={isProcessing}
              className="w-full py-3.5 px-4 rounded-xl bg-[#FFC21A] hover:bg-[#E5A800] disabled:opacity-50 text-[#14110F] font-bold text-xs uppercase tracking-wider shadow-sm transition flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#14110F]" />
                  <span>Validation RFID...</span>
                </>
              ) : (
                <>
                  <Radio className="w-4 h-4 text-[#14110F]" />
                  <span>Approcher le bracelet ({wallet.rfidTagId})</span>
                </>
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
