import React from 'react';
import { X, Calendar, MapPin, Globe, Phone, Mail, CheckCircle2, Ticket, ArrowRight, Share2 } from 'lucide-react';
import { VukaPublishedEvent } from '../../types';

interface OrganizerInfoModalProps {
  organizerName: string;
  events: VukaPublishedEvent[];
  onClose: () => void;
  onSelectEvent?: (event: VukaPublishedEvent) => void;
}

export const OrganizerInfoModal: React.FC<OrganizerInfoModalProps> = ({
  organizerName,
  events,
  onClose,
  onSelectEvent
}) => {
  // Trouver un événement représentatif pour déduire l'organisation et ses métadonnées
  const sampleEvent = events.find(e => (e.organizerName || 'Fondation Congolicious') === organizerName) || events[0];
  const organizerEvents = events.filter(e => (e.organizerName || 'Fondation Congolicious') === organizerName);

  // Valeurs par défaut et enrichies
  const isCongolicious = organizerName.toLowerCase().includes('congolicious') || organizerName.toLowerCase().includes('lab3');
  const orgTitle = organizerName;
  const orgBio = isCongolicious
    ? "Collectif culinaire & culturel congolais dédié à la valorisation du patrimoine gastronomique de la République Démocratique du Congo, organisateur officiel de la Congo Food Week (CFW) depuis 2018."
    : `Organisation officielle certifiée sur la plateforme VUKA Pay, créateur d'expériences événementielles, culturelles et professionnelles à Kinshasa et en RDC.`;
  
  const coverUrl = sampleEvent?.imageUrl || "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80";
  const avatarLetter = orgTitle.charAt(0).toUpperCase();
  const phone = "+243 821 821 865";
  const email = isCongolicious ? "contact@congolicious.cd" : "contact@vukapay.cd";
  const website = isCongolicious ? "https://congolicious.cd" : "https://vukapay.cd";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-xl bg-white border border-[#D9D0C6] rounded-[24px] sm:rounded-[28px] overflow-hidden shadow-2xl my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Bannière de couverture */}
        <div className="relative h-36 sm:h-44 w-full bg-[#14110F] shrink-0">
          <img 
            src={coverUrl} 
            alt={orgTitle}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#14110F] via-transparent to-black/30" />
          
          {/* Bouton Fermer */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white text-[#14110F] backdrop-blur-md transition shadow-xs z-10"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Profil header chevauchant la bannière */}
        <div className="px-5 sm:px-6 pt-0 pb-4 relative -mt-12 sm:-mt-14 shrink-0 border-b border-[#F3ECE2]">
          <div className="flex items-end justify-between gap-3 mb-3">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#FF6A2B] text-[#14110F] border-4 border-white shadow-md flex items-center justify-center font-heading font-black text-2xl sm:text-3xl shrink-0">
              {avatarLetter}
            </div>
            
            <div className="flex items-center gap-2 pb-1">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#E2F3E9] text-[#167A42] border border-[#167A42]/20 text-xs font-bold font-heading">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Organisateur Vérifié</span>
              </span>
            </div>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-[#14110F] font-heading leading-tight">
            {orgTitle}
          </h3>
          <p className="text-xs text-[#7A7068] mt-1.5 leading-relaxed">
            {orgBio}
          </p>

          {/* Coordonnées & Liens */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#4A433D] mt-3 pt-3 border-t border-[#F3ECE2]">
            <a 
              href={`https://api.whatsapp.com/send?phone=${phone.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E2F3E9] text-[#167A42] font-semibold hover:bg-[#cceeda] transition"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{phone}</span>
            </a>
            <a 
              href={`mailto:${email}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#D9D0C6] text-[#14110F] font-semibold hover:bg-[#F3ECE2] transition"
            >
              <Mail className="w-3.5 h-3.5 text-[#FF6A2B]" />
              <span className="truncate max-w-[150px]">{email}</span>
            </a>
            <a 
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#D9D0C6] text-[#14110F] font-semibold hover:bg-[#F3ECE2] transition"
            >
              <Globe className="w-3.5 h-3.5 text-[#0E5A8A]" />
              <span className="truncate max-w-[130px]">{website.replace(/^https?:\/\//, '')}</span>
            </a>
          </div>
        </div>

        {/* Liste des Événements organisés */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#7A7068] font-heading">
              Événements de cet organisateur ({organizerEvents.length})
            </h4>
          </div>

          <div className="space-y-2.5">
            {organizerEvents.map((ev) => (
              <div 
                key={ev.id}
                onClick={() => {
                  if (onSelectEvent) {
                    onSelectEvent(ev);
                    onClose();
                  }
                }}
                className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] hover:border-[#14110F]/30 transition flex items-center justify-between gap-3 cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-[#14110F] overflow-hidden shrink-0">
                    <img 
                      src={ev.imageUrl || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=200&q=80'} 
                      alt={ev.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-bold uppercase text-[#FF6A2B] truncate">
                      {ev.activityType} • {ev.city}
                    </div>
                    <h5 className="text-xs sm:text-sm font-bold text-[#14110F] truncate group-hover:text-[#FF6A2B] transition-colors font-heading">
                      {ev.title}
                    </h5>
                    <div className="flex items-center gap-2 text-[11px] text-[#7A7068]">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#7A7068]" />
                        <span>{ev.dateStr}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] uppercase font-bold text-[#7A7068] block">Dès</span>
                  <span className="text-xs sm:text-sm font-bold font-mono text-[#14110F]">{ev.priceFrom}</span>
                  <div className="mt-1 flex items-center gap-1 text-[11px] font-bold text-[#FF6A2B]">
                    <span>Réserver</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Modal */}
        <div className="p-4 bg-[#FAF8F5] border-t border-[#F3ECE2] text-center shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-full bg-[#14110F] hover:bg-[#251F1B] text-white font-heading font-bold text-xs uppercase tracking-wider transition"
          >
            Fermer la fiche
          </button>
        </div>
      </div>
    </div>
  );
};
