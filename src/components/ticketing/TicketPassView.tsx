import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { PurchasedTicket } from '../../types';
import { formatUSD } from '../../utils/formatters';
import { QrCode, Download, Printer, Copy, Check, Radio, Send } from 'lucide-react';

export const TicketPassView: React.FC<{ ticket: PurchasedTicket }> = ({ ticket }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    QRCode.toDataURL(ticket.ticketId, {
      width: 180,
      margin: 1,
      color: {
        dark: '#14110F',
        light: '#FFFFFF'
      }
    }).then(setQrDataUrl).catch(console.error);
  }, [ticket]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const ticketContent = `
==================================================
        VUKA PAY — BILLET NUMÉRIQUE SÉCURISÉ
==================================================
RÉFÉRENCE BILLET : ${ticket.ticketId}
ACTIVITÉ / PASS  : ${ticket.ticketName}
DATE D'ACHAT     : ${new Date(ticket.purchaseDate).toLocaleString('fr-FR')}

TITULAIRE        : ${ticket.buyerName}
TÉLÉPHONE        : ${ticket.buyerPhone}
EMAIL            : ${ticket.buyerEmail}
MONTANT RÉGLÉ    : ${formatUSD(ticket.pricePaidUSD)}
STATUT           : ${ticket.status === 'VALID' ? 'VALIDE / NON SCANNÉ' : 'DÉJÀ VALIDÉ'}

Jeton Cryptographique (QR) : ${ticket.qrCodeToken}
Code Contrôle Portes       : ${ticket.ticketId}

INSTRUCTIONS D'ACCÈS :
- Présentez ce reçu ou votre QR Code officiel à la porte.
- Contrôle instantané NFC / Scanner Starlink en moins de 500ms.
- Retrait du bracelet RFID sans contact pour tout pass multi-jours.

Propulsé par MOKILI — Plateforme VUKA Pay RDC
==================================================
`;
    const blob = new Blob([ticketContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Billet-VUKA-${ticket.ticketId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getShareText = () => {
    return `Billet Officiel VUKA Pay (${ticket.ticketId})\nActivité : ${ticket.ticketName}\nTitulaire : ${ticket.buyerName}\nStatut : Valide\nConsultez et vérifiez sur : ${window.location.origin}`;
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(getShareText());
    const whatsappUrl = `https://api.whatsapp.com/send?text=${text}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopy = async () => {
    const text = `${getShareText()}\n${window.location.href}`;
    let success = false;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        success = true;
      } catch {
        success = false;
      }
    }

    if (!success) {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
        success = true;
      } catch {
        success = false;
      }
    }

    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="bg-[#1E1A17] border border-[#2A2420] rounded-[24px] overflow-hidden shadow-2xl max-w-md mx-auto text-left">
      {/* Top Banner */}
      <div className="bg-[#14110F] px-4 py-3 text-white border-b border-[#2A2420]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF6A2B] animate-pulse"></span>
            <span className="text-[11px] font-black uppercase tracking-widest text-[#FF6A2B] font-heading">
              BILLET OFFICIEL • VUKA SECURE
            </span>
          </div>
          <span className="text-[10px] font-mono bg-[#2A2420] px-2 py-0.5 rounded-md font-bold text-[#FFC21A]">
            {ticket.ticketId}
          </span>
        </div>
        <h4 className="text-base sm:text-lg font-bold mt-1 text-white font-heading truncate">
          {ticket.ticketName}
        </h4>
      </div>

      {/* Main Ticket Body */}
      <div className="p-4 sm:p-5 space-y-4">
        
        {/* QR Code Centerpiece */}
        <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-[#E5E0D8]">
          {qrDataUrl ? (
            <img 
              src={qrDataUrl} 
              alt={`QR Code Billet ${ticket.ticketId}`} 
              className="w-32 h-32 sm:w-36 sm:h-36 object-contain" 
            />
          ) : (
            <div className="w-32 h-32 sm:w-36 sm:h-36 bg-[#F5F3EF] flex items-center justify-center">
              <QrCode className="w-8 h-8 text-[#9C9488] animate-spin" />
            </div>
          )}
          <span className="text-[10px] font-mono text-[#14110F] mt-1.5 font-bold tracking-wider">
            {ticket.ticketId}
          </span>
        </div>

        {/* Info Grid - 4 cases compactes */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 sm:p-2.5 rounded-xl bg-[#14110F] border border-[#2A2420]">
            <div className="text-[#9C9488] uppercase text-[9px] font-bold">Titulaire</div>
            <div className="text-white font-semibold truncate mt-0.5 text-xs">{ticket.buyerName}</div>
          </div>
          <div className="p-2 sm:p-2.5 rounded-xl bg-[#14110F] border border-[#2A2420]">
            <div className="text-[#9C9488] uppercase text-[9px] font-bold">Téléphone</div>
            <div className="text-white font-mono mt-0.5 text-xs truncate">{ticket.buyerPhone}</div>
          </div>
          <div className="p-2 sm:p-2.5 rounded-xl bg-[#14110F] border border-[#2A2420]">
            <div className="text-[#9C9488] uppercase text-[9px] font-bold">Statut Entrée</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              {ticket.status === 'VALID' ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#167A42]"></span>
                  <span className="text-[#167A42] font-bold text-[11px]">Valide / Non Scanné</span>
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0E5A8A]"></span>
                  <span className="text-[#0E5A8A] font-bold text-[11px]">Scanné (Entré)</span>
                </>
              )}
            </div>
          </div>
          <div className="p-2 sm:p-2.5 rounded-xl bg-[#14110F] border border-[#2A2420]">
            <div className="text-[#9C9488] uppercase text-[9px] font-bold">Prix Réglé</div>
            <div className="text-[#FFC21A] font-mono font-bold mt-0.5 text-xs">{formatUSD(ticket.pricePaidUSD)}</div>
          </div>
        </div>

        {/* RFID / Entrée Note */}
        <div className="p-2.5 rounded-xl bg-[#14110F] border border-[#2A2420] flex items-start gap-2.5 text-xs">
          <Radio className="w-3.5 h-3.5 text-[#FF6A2B] shrink-0 mt-0.5 animate-pulse" />
          <div className="text-[#F5F3EF] text-[11px] leading-tight">
            <span className="font-bold text-white">Retrait RFID / Accès Portes :</span> Présentez ce QR Code aux postes de contrôle d'accès pour valider votre entrée ou lier votre bracelet sans contact.
          </div>
        </div>

        {/* Feedback Visuel lors de la copie */}
        {copied && (
          <div className="p-2 rounded-xl bg-[#167A42]/20 border border-[#167A42]/40 text-[#4ADE80] text-xs font-semibold flex items-center justify-center gap-1.5 animate-in fade-in duration-150">
            <Check className="w-4 h-4 text-[#4ADE80]" />
            <span>Lien et résumé du billet copiés dans le presse-papier !</span>
          </div>
        )}

        {/* Action Toolbar : Télécharger, WhatsApp, Copier, Imprimer (Tester retiré) */}
        <div className="pt-2 border-t border-[#2A2420] grid grid-cols-2 sm:grid-cols-4 gap-2">
          {/* 1. Télécharger */}
          <button
            type="button"
            onClick={handleDownload}
            className="py-2.5 px-2 rounded-xl bg-[#14110F] hover:bg-[#2A2420] border border-[#2A2420] text-[11px] font-semibold text-[#F5F3EF] flex items-center justify-center gap-1.5 transition active:scale-95"
            title="Télécharger le billet texte officiel"
          >
            <Download className="w-3.5 h-3.5 text-[#FF6A2B]" />
            <span>Télécharger</span>
          </button>

          {/* 2. Partager sur WhatsApp */}
          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="py-2.5 px-2 rounded-xl bg-[#14110F] hover:bg-[#2A2420] border border-[#2A2420] text-[11px] font-semibold text-[#F5F3EF] flex items-center justify-center gap-1.5 transition active:scale-95"
            title="Envoyer le billet directement par WhatsApp"
          >
            <Send className="w-3.5 h-3.5 text-[#25D366]" />
            <span>WhatsApp</span>
          </button>

          {/* 3. Copier Lien / Reçu */}
          <button
            type="button"
            onClick={handleCopy}
            className="py-2.5 px-2 rounded-xl bg-[#14110F] hover:bg-[#2A2420] border border-[#2A2420] text-[11px] font-semibold text-[#F5F3EF] flex items-center justify-center gap-1.5 transition active:scale-95"
            title="Copier les références du billet"
          >
            <Copy className="w-3.5 h-3.5 text-[#FFC21A]" />
            <span>Copier</span>
          </button>

          {/* 4. Imprimer */}
          <button
            type="button"
            onClick={handlePrint}
            className="py-2.5 px-2 rounded-xl bg-[#14110F] hover:bg-[#2A2420] border border-[#2A2420] text-[11px] font-semibold text-[#F5F3EF] flex items-center justify-center gap-1.5 transition active:scale-95"
            title="Imprimer le pass"
          >
            <Printer className="w-3.5 h-3.5 text-[#F5F3EF]" />
            <span>Imprimer</span>
          </button>
        </div>

      </div>
    </div>
  );
};
