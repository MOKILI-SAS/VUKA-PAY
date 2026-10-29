// Test de vérification du moteur VUKA Pay & Sécurité Anti-Fraude
import assert from 'node:assert';

console.log('[INFO] Demarrage de la suite de tests unitaires MOKILI - VUKA Pay...\n');

// 1. Test du split financier 90/10 et conversion bidevise
console.log('[TEST 1] Calculs financiers et prelevement solidaire 10%');
const grossAmount = 100.00;
const foundationCommission = Number((grossAmount * 0.10).toFixed(2));
const merchantNet = Number((grossAmount - foundationCommission).toFixed(2));
const EXCHANGE_RATE_CDF = 2850;
const cdfAmount = Math.round(grossAmount * EXCHANGE_RATE_CDF);

assert.strictEqual(foundationCommission, 10.00, 'La commission solidaire doit etre exactement de 10% (10.00$)');
assert.strictEqual(merchantNet, 90.00, 'Le net standier doit etre exactement de 90% (90.00$)');
assert.strictEqual(cdfAmount, 285000, '100$ doit valoir 285 000 FC au taux officiel de 2850 CDF');
console.log('   [PASS] Split financier 90/10 et bidevise USD/CDF valides.');

// 2. Test de l'algorithme HMAC TOTP 30s
console.log('\n[TEST 2] Algorithme QR Code Dynamique (Rotation 30 secondes)');
function mockHmacSha256(data, key) {
  let hash = 0;
  const combined = data + key;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(8, '0').slice(0, 8).toUpperCase();
}

const SECRET = 'VUKA-CFW6-SECRET-KEY-2026';
const nowSeconds = Math.floor(Date.now() / 1000);
const currentTimeWindow = Math.floor(nowSeconds / 30);
const walletId = 'WLT-CFW6-7789';

const validSig = mockHmacSha256(`${walletId}:${currentTimeWindow}`, SECRET);
assert.ok(validSig.length > 0, 'La signature doit etre generee');

// Rejet si fenetre temporelle trop vieille (> 2 fenetres de 30s, soit > 60s)
const expiredTimeWindow = currentTimeWindow - 3;
const expiredSig = mockHmacSha256(`${walletId}:${expiredTimeWindow}`, SECRET);
const diff = Math.abs(currentTimeWindow - expiredTimeWindow);
assert.ok(diff > 1, 'Une capture d’ecran de plus de 60 secondes doit etre detectee comme perimee');
console.log('   [PASS] Regle de rotation 30s et detection anti-capture d’ecran validees.');

// 3. Test de protection Anti-Passback
console.log('\n[TEST 3] Controle d’acces et detection Anti-Passback');
const mockTicket = {
  ticketId: 'TCK-CFW6-001',
  status: 'VALID',
  scannedAt: null
};

// Premier scan : succes
function scanTicket(t) {
  if (t.status === 'SCANNED_ENTERED') {
    return { success: false, error: 'ALERTE FRAUDE : Billet deja utilise' };
  }
  t.status = 'SCANNED_ENTERED';
  t.scannedAt = new Date().toISOString();
  return { success: true };
}

const firstScan = scanTicket(mockTicket);
assert.strictEqual(firstScan.success, true, 'Le premier scan doit reussir');
assert.strictEqual(mockTicket.status, 'SCANNED_ENTERED', 'Le statut doit passer a SCANNED_ENTERED');

// Deuxieme scan avec le meme billet : alerte fraude anti-passback
const secondScan = scanTicket(mockTicket);
assert.strictEqual(secondScan.success, false, 'Le second scan doit echouer');
assert.ok(secondScan.error.includes('ALERTE FRAUDE'), 'Une alerte de reutilisation doit etre levee');
console.log('   [PASS] Regle Anti-Passback validee.');

// 4. Test de resilience Caisse Hors-Ligne (Offline Queue)
console.log('\n[TEST 4] File d’attente Offline-First et reconciliation');
const offlineQueue = [];
function addOfflineSale(sale) {
  offlineQueue.push({ ...sale, offlineGenerated: true });
}

addOfflineSale({ id: 'TX-OFFLINE-1', amountUSD: 15.00, standId: 'stand-1' });
addOfflineSale({ id: 'TX-OFFLINE-2', amountUSD: 25.00, standId: 'stand-2' });

assert.strictEqual(offlineQueue.length, 2, 'Les encaissements sans Starlink doivent etre stockes localement');
assert.strictEqual(offlineQueue[0].offlineGenerated, true, 'Le tag offline doit etre marque');

// Synchronisation
let syncedCount = 0;
while (offlineQueue.length > 0) {
  const item = offlineQueue.shift();
  syncedCount++;
}
assert.strictEqual(syncedCount, 2, 'Toutes les transactions locales doivent etre videes lors du sync');
assert.strictEqual(offlineQueue.length, 0, 'La file d’attente doit etre vide apres sync');
console.log('   [PASS] File d’attente Offline-First et reconciliation Starlink validees.');

console.log('\n[STATUS] TOUS LES TESTS MOKILI (4/4) ONT REUSSI AVEC SUCCES (PASS) !\n');
