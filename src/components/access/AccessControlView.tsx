import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PurchasedTicket } from '../../types';
import { formatDateTime } from '../../utils/formatters';
import { 
  ShieldCheck, 
  Scan, 
  QrCode, 
  Radio, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Users, 
  Clock, 
  Sparkles, 
  RefreshCw, 
  Search 
} from 'lucide-react';

export const AccessControlView: React.FC = () => {
  const { purchasedTickets, scanAccessTicket, totalAttendeesEntered } = useApp();

  const [ticketInput, setTicketInput] = useState('');
  const [rfidTagInput, setRfidTagInput] = useState('');
  const [lastScanResult, setLastScanResult] = useState<{
    success: boolean;
    status: 'VALID' | 'ALREADY_USED' | 'INVALID';
    ticket?: PurchasedTicket;
    message: string;
  } | null>(null);

  const handleScan = (codeToScan: string) => {
    if (!codeToScan.trim()) return;
    const res = scanAccessTicket(codeToScan.trim(), rfidTagInput.trim() || undefined);
    setLastScanResult(res);
    setTicketInput('');
    setRfidTagInput('');
  };

  // 6 Postes de contrôle selon CDC v2
  const [gateNumber, setGateNumber] = useState<number>(1);

  return (
    <div className="py-6 px-4 sm:px-6 max-w-5xl mx-auto space-y-6">
      
      {/* Header & Gate Selection */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-[28px] bg-white border border-[#E5E0D8] shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FFE3D3] border border-[#FF6A2B]/20 text-[#FF6A2B] flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-[#14110F] font-poppins">VUKA Access — Contrôle Portes</h2>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FFE3D3] text-[#FF6A2B] border border-[#FF6A2B]/20">
                Poste #{gateNumber} Actif
              </span>
            </div>
            <p className="text-xs text-[#9C9488] font-mono mt-0.5">
              Filtrage entrées & appairage bracelets RFID MIFARE DESFire
            </p>
          </div>
        </div>

        {/* Gate Selector */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#9C9488] font-bold">Poste d'entrée :</span>
          <select
            value={gateNumber}
            onChange={(e) => setGateNumber(parseInt(e.target.value))}
            className="px-3 py-2 rounded-xl bg-[#FBF6EE] border border-[#E5E0D8] text-xs text-[#14110F] font-bold focus:outline-none focus:border-[#FF6A2B]"
          >
            {[1, 2, 3, 4, 5, 6].map(num => (
              <option key={num} value={num}>Porte #{num} (Scanner Laser)</option>
            ))}
          </select>
        </div>
      </div>

      {/* Live Attendance Metric & Capacity */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-[24px] bg-white border border-[#E5E0D8] flex items-center justify-between shadow-sm">
          <div>
            <div className="text-xs text-[#9C9488] font-bold uppercase tracking-wider">Participants Entrés</div>
            <div className="text-3xl font-black text-[#FF6A2B] font-mono mt-1">
              {totalAttendeesEntered}
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-[#FFE3D3] text-[#FF6A2B]">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-[24px] bg-white border border-[#E5E0D8] flex items-center justify-between shadow-sm">
          <div>
            <div className="text-xs text-[#9C9488] font-bold uppercase tracking-wider">Billets Émis</div>
            <div className="text-3xl font-black text-[#14110F] font-mono mt-1">
              {purchasedTickets.length}
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-[#F5F3EF] text-[#14110F]">
            <QrCode className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-[24px] bg-white border border-[#E5E0D8] flex items-center justify-between shadow-sm">
          <div>
            <div className="text-xs text-[#9C9488] font-bold uppercase tracking-wider">Jauge Max Site</div>
            <div className="text-3xl font-black text-[#FFC21A] font-mono mt-1">
              25 000
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-[#FFF3CC] text-[#FFC21A]">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Scan Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* Left: Input / Scanner Simulator */}
        <div className="p-6 rounded-[28px] bg-white border border-[#E5E0D8] shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-[#14110F] flex items-center gap-2 font-poppins">
              <Scan className="w-5 h-5 text-[#FF6A2B]" />
              <span>Poste de Scan Laser / Caméra</span>
            </h3>
            <span className="text-[10px] font-mono text-[#FF6A2B] bg-[#FFE3D3] px-2 py-0.5 rounded font-bold border border-[#FF6A2B]/20">
              &lt; 500ms
            </span>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleScan(ticketInput); }} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#4A443D] mb-1.5 uppercase tracking-wider">
                Code Billet ou QR Code scanné *
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ex: TCK-CFW6-7789 ou flashez un billet"
                  value={ticketInput}
                  onChange={(e) => setTicketInput(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 rounded-xl bg-[#FBF6EE] border border-[#E5E0D8] text-[#14110F] font-mono text-xs focus:outline-none focus:border-[#FF6A2B] focus:bg-white"
                />
                <QrCode className="w-4 h-4 text-[#9C9488] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4A443D] mb-1.5 uppercase tracking-wider flex items-center justify-between">
                <span>Appairer un Bracelet RFID (Optionnel)</span>
                <span className="text-[10px] text-[#FF6A2B] font-bold">Puce MIFARE</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Approchez le bracelet (ex: RFID-DESFIRE-9941)"
                  value={rfidTagInput}
                  onChange={(e) => setRfidTagInput(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 rounded-xl bg-[#FBF6EE] border border-[#E5E0D8] text-[#14110F] font-mono text-xs focus:outline-none focus:border-[#FF6A2B] focus:bg-white"
                />
                <Radio className="w-4 h-4 text-[#FF6A2B] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-full bg-[#FF6A2B] hover:bg-[#E24E10] text-[#14110F] font-bold text-xs uppercase tracking-wider shadow-md transition flex items-center justify-center gap-2 active:scale-95"
            >
              <ShieldCheck className="w-4 h-4 text-[#14110F]" />
              <span>Valider l'Accès Portes</span>
            </button>
          </form>

          {/* Quick Test Buttons with Issued Tickets */}
          <div className="pt-4 border-t border-[#E5E0D8] space-y-2">
            <div className="text-[11px] font-bold text-[#9C9488] uppercase tracking-wider">
              Billets de test disponibles au scan :
            </div>
            <div className="space-y-1.5">
              {purchasedTickets.slice(0, 4).map((t) => (
                <div
                  key={t.ticketId}
                  className="p-2.5 rounded-xl bg-[#FBF6EE] border border-[#E5E0D8] flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-[#14110F]">{t.buyerName} ({t.ticketName})</div>
                    <div className="text-[10px] text-[#9C9488] font-mono">{t.ticketId}</div>
                  </div>

                  <button
                    onClick={() => handleScan(t.ticketId)}
                    className="px-3 py-1 rounded-full bg-white border border-[#E5E0D8] hover:bg-[#FFE3D3] hover:text-[#FF6A2B] hover:border-[#FF6A2B] text-[11px] font-bold text-[#14110F] transition"
                  >
                    Scanner ce billet
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Real-Time Scan Result Visualizer */}
        <div className="space-y-6">
          <div className="p-6 rounded-[28px] bg-white border border-[#E5E0D8] shadow-sm space-y-4">
            <h3 className="text-base font-black text-[#14110F] font-poppins">Résultat du Dernier Scan</h3>

            {lastScanResult ? (
              <div className={`p-6 rounded-3xl border text-center space-y-4 ${
                lastScanResult.status === 'VALID'
                  ? 'bg-[#167A42]/10 border-[#167A42]/20 text-[#167A42]'
                  : lastScanResult.status === 'ALREADY_USED'
                  ? 'bg-red-50 border-red-200 text-[#C62828]'
                  : 'bg-[#FFF3CC] border-[#FFC21A]/30 text-[#14110F]'
              }`}>
                <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center bg-white shadow-sm">
                  {lastScanResult.status === 'VALID' ? (
                    <CheckCircle2 className="w-10 h-10 text-[#167A42]" />
                  ) : lastScanResult.status === 'ALREADY_USED' ? (
                    <AlertTriangle className="w-10 h-10 text-[#C62828]" />
                  ) : (
                    <XCircle className="w-10 h-10 text-[#FFC21A]" />
                  )}
                </div>

                <div>
                  <h4 className="text-xl font-black font-poppins">
                    {lastScanResult.status === 'VALID' && 'ENTRÉE AUTORISÉE'}
                    {lastScanResult.status === 'ALREADY_USED' && 'ALERTE : BILLET DÉJÀ SCANNÉ !'}
                    {lastScanResult.status === 'INVALID' && 'BILLET INCONNU / REFUSÉ'}
                  </h4>
                  <p className="text-xs mt-1 font-medium">{lastScanResult.message}</p>
                </div>

                {lastScanResult.ticket && (
                  <div className="p-4 rounded-2xl bg-white text-left text-xs space-y-2 border border-[#E5E0D8]">
                    <div className="flex justify-between">
                      <span className="text-[#9C9488]">Pass :</span>
                      <span className="font-bold text-[#14110F]">{lastScanResult.ticket.ticketName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#9C9488]">Titulaire :</span>
                      <span className="font-bold text-[#14110F]">{lastScanResult.ticket.buyerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#9C9488]">Bracelet RFID lié :</span>
                      <span className="font-mono text-[#FF6A2B] font-bold">
                        {lastScanResult.ticket.rfidTagId || 'Non assigné'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-16 text-center text-[#9C9488] text-xs border border-dashed border-[#E5E0D8] rounded-2xl">
                En attente du premier scan de billet...
              </div>
            )}

            {/* Official RFID Wristband Palette (Page 7 Charte Graphique) */}
            <div className="p-4 rounded-2xl bg-[#FBF6EE] border border-[#E5E0D8] space-y-2.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#9C9488]">
                Nuancier Officiel des Bracelets RFID (Charte v1.0) :
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-bold">
                <div className="p-2 rounded-xl bg-[#FF6A2B] text-[#14110F] flex items-center justify-between">
                  <span>Festivalier</span>
                  <span className="text-[9px] font-mono opacity-80">Braise #FF6A2B</span>
                </div>
                <div className="p-2 rounded-xl bg-[#14110F] text-[#FFC21A] flex items-center justify-between">
                  <span>VIP</span>
                  <span className="text-[9px] font-mono opacity-80">Nuit & Soleil</span>
                </div>
                <div className="p-2 rounded-xl bg-[#0E5A8A] text-white flex items-center justify-between">
                  <span>Staff / Orga</span>
                  <span className="text-[9px] font-mono opacity-80">Fleuve #0E5A8A</span>
                </div>
                <div className="p-2 rounded-xl bg-[#FFC21A] text-[#14110F] flex items-center justify-between">
                  <span>Marchand</span>
                  <span className="text-[9px] font-mono opacity-80">Soleil #FFC21A</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
