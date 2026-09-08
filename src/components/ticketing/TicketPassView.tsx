import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { PurchasedTicket } from '../../types';
import { formatUSD, formatDateTime } from '../../utils/formatters';
import { QrCode, ShieldCheck, Download, Printer, Radio, CheckCircle2, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TicketPassView: React.FC<{ ticket: PurchasedTicket }> = ({ ticket }) => {
  const { setCurrentRole } = useApp();
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    QRCode.toDataURL(ticket.ticketId, {
      width: 220,
      margin: 1,
      color: {
        dark: '#0A0D17',
        light: '#FFFFFF'
      }
    }).then(setQrDataUrl).catch(console.error);
  }, [ticket]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl max-w-md mx-auto">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#FF5722] via-[#FF7A00] to-[#FFB300] p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse"></span>
            <span className="text-xs font-black uppercase tracking-widest">PASS OFFICIEL CFW6</span>
          </div>
          <span className="text-[10px] font-mono bg-black/30 px-2 py-0.5 rounded-md font-bold">
            {ticket.ticketId}
          </span>
        </div>
        <h4 className="text-xl font-black mt-1">{ticket.ticketName}</h4>
      </div>

      {/* Main Ticket Body */}
      <div className="p-6 space-y-6">
        
        {/* QR Code Centerpiece */}
        <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-slate-200">
          {qrDataUrl ? (
            <img src={qrDataUrl} alt="QR Code Billet" className="w-44 h-44 object-contain" />
          ) : (
            <div className="w-44 h-44 bg-slate-100 flex items-center justify-center">
              <QrCode className="w-10 h-10 text-slate-400 animate-spin" />
            </div>
          )}
          <span className="text-[10px] font-mono text-slate-700 mt-2 font-bold tracking-wider">
            {ticket.ticketId}
          </span>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <div className="text-slate-500 uppercase text-[10px] font-bold">Titulaire</div>
            <div className="text-white font-semibold truncate mt-0.5">{ticket.buyerName}</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <div className="text-slate-500 uppercase text-[10px] font-bold">Téléphone</div>
            <div className="text-white font-mono mt-0.5">{ticket.buyerPhone}</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <div className="text-slate-500 uppercase text-[10px] font-bold">Statut Entrée</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              {ticket.status === 'VALID' ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
                  <span className="text-[#10B981] font-bold">Valide / Non Scanné</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  <span className="text-blue-400 font-bold">Scanné (Entré)</span>
                </>
              )}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <div className="text-slate-500 uppercase text-[10px] font-bold">Prix Réglé</div>
            <div className="text-white font-mono font-bold mt-0.5">{formatUSD(ticket.pricePaidUSD)}</div>
          </div>
        </div>

        {/* RFID Wristband note */}
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-3 text-xs">
          <Radio className="w-4 h-4 text-[#00D2FF] shrink-0 mt-0.5 animate-pulse" />
          <div className="text-slate-300">
            <span className="font-bold text-white">Retrait du Bracelet RFID :</span> Présentez ce QR Code aux postes de contrôle d'accès pour lier instantanément votre bracelet sans contact.
          </div>
        </div>

        {/* Quick Testing Link to Access Control */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={handlePrint}
            className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 flex items-center justify-center gap-1.5 transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimer</span>
          </button>

          <button
            onClick={() => setCurrentRole('STAFF_ACCESS')}
            className="flex-1 py-2 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-xs font-bold text-emerald-400 flex items-center justify-center gap-1.5 transition"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Tester l'Accès</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

      </div>
    </div>
  );
};
