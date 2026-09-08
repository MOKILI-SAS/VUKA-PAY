/**
 * Utilitaires de formatage monétaire et date pour la RDC
 */

// Taux indicatif de référence (Kinshasa 2026 : 1 USD = 2850 CDF)
export const EXCHANGE_RATE_USD_CDF = 2850;

export function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

export function formatCDF(amountUSD: number): string {
  const cdf = Math.round(amountUSD * EXCHANGE_RATE_USD_CDF);
  return new Intl.NumberFormat('fr-CD', {
    style: 'decimal',
    maximumFractionDigits: 0
  }).format(cdf) + ' FC';
}

export function formatDualCurrency(amountUSD: number): string {
  return `${formatUSD(amountUSD)} (${formatCDF(amountUSD)})`;
}

export function formatDateTime(isoString: string): string {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

export function formatPhoneNumber(phone: string): string {
  // Nettoyer et formater au format standard congolais (+243 81 ...)
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('243') && cleaned.length >= 12) {
    return `+243 ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`;
  }
  return phone;
}
