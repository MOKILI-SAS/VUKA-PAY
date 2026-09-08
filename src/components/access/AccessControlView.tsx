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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-[#10B981] flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white">VUKA Access — Contrôle Portes</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-[#10B981] border border-emerald-500/20">
                Poste #{gateNumber} Actif
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Filtrage entrées & appairage bracelets RFID MIFARE DESFire
            </p>
          </div>
        </div>

        {/* Gate Selector */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">Poste d'entrée :</span>
          <select
            value={gateNumber}
            onChange={(e) => setGateNumber(parseInt(e.target.value))}
            className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white font-bold focus:outline-none focus:border-[#10B981]"
          >
            {[1, 2, 3, 4, 5, 6].map(num => (
              <option key={num} value={num}>Porte #{num} (Scanner Laser)</option>
            ))}
          </select>
        </div>
      </div>

      {/* Live Attendance Metric & Capacity */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-semibold uppercase">Participants Entrés</div>
            <div className="text-3xl font-black text-[#10B981] font-mono mt-1">
              {totalAttendeesEntered}
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-[#10B981]">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-semibold uppercase">Billets Émis</div>
            <div className="text-3xl font-black text-white font-mono mt-1">
              {purchasedTickets.length}
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400">
            <QrCode className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-semibold uppercase">Jauge Max Site</div>
            <div className="text-3xl font-black text-[#FFB300] font-mono mt-1">
              25 000
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-amber-500/10 text-[#FFB300]">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Scan Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* Left: Input / Scanner Simulator */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Scan className="w-5 h-5 text-emerald-400" />
              <span>Poste de Scan Laser / Caméra</span>
            </h3>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
              &lt; 500ms
            </span>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleScan(ticketInput); }} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Code Billet ou QR Code scanné *
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ex: TCK-CFW6-7789 ou flashez un billet"
                  value={ticketInput}
                  onChange={(e) => setTicketInput(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-[#10B981]"
                />
                <QrCode className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider flex items-center justify-between">
                <span>Appairer un Bracelet RFID (Optionnel)</span>
                <span className="text-[10px] text-cyan-400 font-normal">Puce MIFARE</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Approchez le bracelet (ex: RFID-DESFIRE-9941)"
                  value={rfidTagInput}
                  onChange={(e) => setRfidTagInput(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-[#00D2FF]"
                />
                <Radio className="w-4 h-4 text-[#00D2FF] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg transition flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Valider l'Accès Portes</span>
            </button>
          </form>

          {/* Quick Test Buttons with Issued Tickets */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase">
              Billets de test disponibles au scan :
            </div>
            <div className="space-y-1.5">
              {purchasedTickets.slice(0, 4).map((t) => (
                <div
                  key={t.ticketId}
                  className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-white">{t.buyerName} ({t.ticketName})</div>
                    <div className="text-[10px] text-slate-500 font-mono">{t.ticketId}</div>
                  </div>

                  <button
                    onClick={() => handleScan(t.ticketId)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-bold text-slate-300 transition"
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
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white">Résultat du Dernier Scan</h3>

            {lastScanResult ? (
              <div className={`p-6 rounded-3xl border text-center space-y-4 ${
                lastScanResult.status === 'VALID'
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                  : lastScanResult.status === 'ALREADY_USED'
                  ? 'bg-red-500/15 border-red-500/50 text-red-300 animate-pulse'
                  : 'bg-amber-500/10 border-amber-500/40 text-amber-300'
              }`}>
                <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center bg-black/30">
                  {lastScanResult.status === 'VALID' ? (
                    <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                  ) : lastScanResult.status === 'ALREADY_USED' ? (
                    <AlertTriangle className="w-10 h-10 text-red-500" />
                  ) : (
                    <XCircle className="w-10 h-10 text-amber-400" />
                  )}
                </div>

                <div>
                  <h4 className="text-xl font-black">
                    {lastScanResult.status === 'VALID' && 'ENTRÉE AUTORISÉE'}
                    {lastScanResult.status === 'ALREADY_USED' && 'ALERTE : BILLET DÉJÀ SCANNÉ !'}
                    {lastScanResult.status === 'INVALID' && 'BILLET INCONNU / REFUSÉ'}
                  </h4>
                  <p className="text-xs mt-1 font-medium">{lastScanResult.message}</p>
                </div>

                {lastScanResult.ticket && (
                  <div className="p-4 rounded-2xl bg-black/40 text-left text-xs space-y-2 border border-white/10">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Pass :</span>
                      <span className="font-bold text-white">{lastScanResult.ticket.ticketName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Titulaire :</span>
                      <span className="font-bold text-white">{lastScanResult.ticket.buyerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Bracelet RFID lié :</span>
                      <span className="font-mono text-[#00D2FF] font-bold">
                        {lastScanResult.ticket.rfidTagId || 'Non assigné'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-16 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-2xl">
                En attente du premier scan de billet...
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
