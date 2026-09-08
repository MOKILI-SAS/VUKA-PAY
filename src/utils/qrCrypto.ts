/**
 * Module de Cryptographie et Sécurité QR Code Dynamique VUKA Pay
 * Conforme au Cahier des Charges CFW6 : Chiffrement temporel anti-capture d'écran
 */

export interface DynamicQRPayload {
  version: string;
  walletId: string;
  festivalierName: string;
  phone: string;
  timestamp: number;
  timeWindow: number; // Fenêtre de 30 secondes
  signature: string;
}

// Fonction de hachage simple et rapide compatible navigateur (djb2 + salt)
export function generateTokenSignature(walletId: string, timestampWindow: number): string {
  const salt = "VUKA_KINSHASA_2026_CFW6_SECURE_SALT";
  const raw = `${walletId}:${timestampWindow}:${salt}`;
  let hash = 5381;
  for (let i = 0; i < raw.length; i++) {
    hash = ((hash << 5) + hash) + raw.charCodeAt(i);
    hash = hash & hash; // Convertir en entier 32-bit
  }
  return Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
}

/**
 * Génère le payload d'un QR code dynamique valide pour une fenêtre de 30 secondes
 */
export function generateDynamicQR(walletId: string, festivalierName: string, phone: string): {
  payloadString: string;
  remainingSeconds: number;
  signature: string;
} {
  const now = Date.now();
  const windowDurationMs = 30 * 1000; // 30 secondes
  const timeWindow = Math.floor(now / windowDurationMs);
  const remainingSeconds = 30 - Math.floor((now % windowDurationMs) / 1000);
  const signature = generateTokenSignature(walletId, timeWindow);

  const payload: DynamicQRPayload = {
    version: "vuka-1.0",
    walletId,
    festivalierName,
    phone,
    timestamp: now,
    timeWindow,
    signature
  };

  return {
    payloadString: JSON.stringify(payload),
    remainingSeconds,
    signature
  };
}

/**
 * Vérifie l'authenticité et la fraîcheur d'un QR code scanné
 * Accepte la fenêtre courante et la précédente (tolérance de décalage de 30s)
 */
export function verifyDynamicQRPayload(payloadStr: string): {
  isValid: boolean;
  walletId?: string;
  festivalierName?: string;
  error?: string;
} {
  try {
    const payload: DynamicQRPayload = JSON.parse(payloadStr);
    if (!payload.walletId || !payload.timeWindow || !payload.signature) {
      return { isValid: false, error: "Format de QR code invalide." };
    }

    const now = Date.now();
    const windowDurationMs = 30 * 1000;
    const currentWindow = Math.floor(now / windowDurationMs);

    // Vérifier si la signature est valide pour la fenêtre actuelle ou précédente (tolérance Starlink/latence)
    const isValidCurrent = payload.signature === generateTokenSignature(payload.walletId, currentWindow);
    const isValidPrevious = payload.signature === generateTokenSignature(payload.walletId, currentWindow - 1);

    if (!isValidCurrent && !isValidPrevious) {
      return { 
        isValid: false, 
        error: "QR Code expiré ou capture d'écran frauduleuse détectée !" 
      };
    }

    return {
      isValid: true,
      walletId: payload.walletId,
      festivalierName: payload.festivalierName
    };
  } catch {
    return { isValid: false, error: "Lecture du QR code impossible." };
  }
}
