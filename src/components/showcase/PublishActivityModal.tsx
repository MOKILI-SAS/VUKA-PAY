import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ActivityType } from '../../types';
import { 
  X, 
  Sparkles, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Users, 
  Mail, 
  Phone, 
  Image as ImageIcon, 
  Check, 
  CheckCircle2, 
  Music, 
  Heart, 
  Utensils, 
  Award,
  Radio
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatCDF } from '../../utils/formatters';

interface TypeConfig {
  type: ActivityType;
  label: string;
  tagline: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  defaultPrice: string;
  defaultCategory: string;
  defaultImages: string[];
}

const ACTIVITY_TYPE_CONFIGS: TypeConfig[] = [
  {
    type: 'Événement',
    label: 'Événement',
    tagline: 'Gala, soirée privée, spectacle, exposition artistique',
    badge: 'ÉVÉNEMENT GRAND PUBLIC',
    icon: Award,
    defaultPrice: '20 $',
    defaultCategory: 'CULTURE & SOIRÉE',
    defaultImages: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    type: 'Donation',
    label: 'Donation',
    tagline: 'Levée de fonds caritative, cantines scolaires, aide sociale',
    badge: 'CAMPAGNE SOLIDAIRE',
    icon: Heart,
    defaultPrice: '5 $',
    defaultCategory: 'IMPACT SOCIAL & SOLIDARITÉ',
    defaultImages: [
      'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    type: 'Concert',
    label: 'Concert',
    tagline: 'Live acoustique, show rumba, festival musical, DJ set',
    badge: 'CONCERT LIVE SOUVERAIN',
    icon: Music,
    defaultPrice: '15 $',
    defaultCategory: 'MUSIQUE & RUMBA LIVE',
    defaultImages: [
      'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    type: 'Festival',
    label: 'Festival',
    tagline: 'Gastronomie, braises de Kin, célébration multi-jours',
    badge: 'FESTIVAL MAJEUR',
    icon: Utensils,
    defaultPrice: '10 $',
    defaultCategory: 'GASTRONOMIE & FESTIVITÉS',
    defaultImages: [
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    type: 'Conférence',
    label: 'Conférence',
    tagline: 'Sommet tech, forum business, colloque, symposium',
    badge: 'FORUM PROFESSIONNEL',
    icon: Radio,
    defaultPrice: '30 $',
    defaultCategory: 'INNOVATION & DÉVELOPPEMENT',
    defaultImages: [
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80'
    ]
  }
];

export const PublishActivityModal: React.FC = () => {
  const { 
    isPublishModalOpen, 
    setIsPublishModalOpen, 
    publishPreselectedType,
    addOrganizerEvent 
  } = useApp();

  const [selectedType, setSelectedType] = useState<ActivityType>('Événement');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [location, setLocation] = useState('');
  const [city, setCity] = useState('Kinshasa, Gombe');
  const [priceUSD, setPriceUSD] = useState<number>(10);
  const [organizerName, setOrganizerName] = useState('');
  const [contactWhatsApp, setContactWhatsApp] = useState('+243 ');
  const [contactEmail, setContactEmail] = useState('');
  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const [customImage, setCustomImage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (publishPreselectedType) {
      setSelectedType(publishPreselectedType);
      const conf = ACTIVITY_TYPE_CONFIGS.find(c => c.type === publishPreselectedType);
      if (conf) {
        setSelectedImage(conf.defaultImages[0]);
      }
    } else {
      setSelectedImage(ACTIVITY_TYPE_CONFIGS[0].defaultImages[0]);
    }
  }, [publishPreselectedType, isPublishModalOpen]);

  const activeConfig = ACTIVITY_TYPE_CONFIGS.find(c => c.type === selectedType) || ACTIVITY_TYPE_CONFIGS[0];

  const handleSelectType = (t: ActivityType) => {
    setSelectedType(t);
    const conf = ACTIVITY_TYPE_CONFIGS.find(c => c.type === t);
    if (conf) {
      setSelectedImage(conf.defaultImages[0]);
      if (!title) {
        if (t === 'Concert') setSubtitle('Soirée Rumba & Musique Live');
        if (t === 'Donation') setSubtitle('Soutien aux Écoles & Cantines');
        if (t === 'Festival') setSubtitle('Saveurs & Grillades Kinoises');
        if (t === 'Conférence') setSubtitle('Sommet Panafricain de l’Innovation');
        if (t === 'Événement') setSubtitle('Grand Rassemblement & Soirée d’Honneur');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Veuillez renseigner un titre pour votre activité.');
      return;
    }
    if (!dateStr.trim()) {
      setError('Veuillez indiquer la date et l’horaire.');
      return;
    }
    if (!location.trim()) {
      setError('Veuillez indiquer le lieu de déroulement.');
      return;
    }

    const finalImage = customImage.trim() || selectedImage || activeConfig.defaultImages[0];
    const isDonation = selectedType === 'Donation';

    addOrganizerEvent({
      title: title.trim(),
      subtitle: subtitle.trim() || activeConfig.tagline,
      category: activeConfig.defaultCategory,
      activityType: selectedType,
      badge: activeConfig.badge,
      dateStr: dateStr.trim(),
      location: location.trim(),
      city: city.trim(),
      priceFrom: isDonation ? `Don dès ${priceUSD} $` : `Dès ${priceUSD} $ (${formatCDF(priceUSD)})`,
      status: 'OPEN',
      totalCapacity: isDonation ? 5000 : 1500,
      organizerName: organizerName.trim() || 'Organisateur Certifié VUKA',
      isFeatured: true, // Immédiatement mis en avant dans le mini-hero !
      imageUrl: finalImage,
      description: description.trim() || activeConfig.tagline,
      metrics: [
        { label: 'Type', value: selectedType },
        { label: isDonation ? 'Objectif' : 'Tarif', value: `${priceUSD} $` },
        { label: 'Sécurité', value: 'VUKA Pay' }
      ],
      ctaText: isDonation ? 'Faire un Don' : (selectedType === 'Conférence' ? 'Obtenir mon Badge' : 'Réserver')
    });

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setIsPublishModalOpen(false);
      // Reset form
      setTitle('');
      setSubtitle('');
      setDateStr('');
      setLocation('');
      setDescription('');
    }, 2500);
  };

  if (!isPublishModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-[#D9D0C6] rounded-[28px] p-6 sm:p-8 shadow-2xl my-8">
        
        {/* Close Button */}
        <button
          onClick={() => setIsPublishModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#F3ECE2] text-[#7A7068] hover:text-[#14110F] transition"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#E2F3E9] text-[#167A42] mx-auto flex items-center justify-center shadow-sm">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-2xl font-bold text-[#14110F] font-heading">
              Activité Publiée avec Succès !
            </h3>
            <p className="text-sm text-[#7A7068] max-w-md mx-auto">
              Votre <strong>{selectedType}</strong> est désormais en ligne sur VUKA Pay et passe en direct dans la rotation du mini-hero.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFE3D3] text-[#14110F] text-xs font-bold font-mono">
              En direct sur la vitrine VUKA
            </div>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFE3D3] text-[#14110F] text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#FF6A2B]" />
                <span>Publication VUKA Pay</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#14110F] tracking-tight font-heading">
                Publier une Activité
              </h2>
              <p className="text-xs sm:text-sm text-[#7A7068] mt-1">
                Choisissez le type d’activité, renseignez les détails et mettez vos pass ou dons en ligne en quelques clics.
              </p>
            </div>

            {/* Step 1 : Sélection du Type d'Activité (5 options demandées) */}
            <div className="mb-6">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#7A7068] block mb-2.5">
                1. Sélectionner le type d’activité
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {ACTIVITY_TYPE_CONFIGS.map((cfg) => {
                  const Icon = cfg.icon;
                  const isSelected = selectedType === cfg.type;
                  return (
                    <button
                      key={cfg.type}
                      type="button"
                      onClick={() => handleSelectType(cfg.type)}
                      className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                        isSelected
                          ? 'bg-[#14110F] border-[#14110F] text-[#FBF6EE] shadow-md scale-102'
                          : 'bg-[#FBF6EE] border-[#D9D0C6] text-[#4A433D] hover:border-[#FF6A2B] hover:bg-white'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isSelected ? 'bg-[#FF6A2B] text-[#14110F]' : 'bg-white text-[#FF6A2B] shadow-xs'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold leading-tight">{cfg.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-2.5 p-2.5 rounded-xl bg-[#FBF6EE] border border-[#D9D0C6] text-xs text-[#7A7068] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF6A2B] shrink-0" />
                <span>Format sélectionné : <strong>{selectedType}</strong> — {activeConfig.tagline}</span>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-[#C62828] text-xs font-semibold">
                {error}
              </div>
            )}

            {/* Step 2 : Formulaire de Détails */}
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              
              {/* Titre & Sous-titre */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#7A7068] block mb-1">
                    Titre de l'activité *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={`Ex : ${selectedType === 'Concert' ? 'Concert Rumba Starlink' : (selectedType === 'Donation' ? 'Cantines Scolaires 2026' : 'Festival Culinaire Kin')}`}
                    className="w-full bg-white border border-[#D9D0C6] rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold text-[#14110F] focus:outline-none focus:border-[#FF6A2B]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#7A7068] block mb-1">
                    Accroche / Sous-titre
                  </label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="Ex : La Nuit Étoilée de Kinshasa"
                    className="w-full bg-white border border-[#D9D0C6] rounded-xl px-3 py-2.5 text-xs sm:text-sm font-medium text-[#14110F] focus:outline-none focus:border-[#FF6A2B]"
                  />
                </div>
              </div>

              {/* Date & Lieu */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#7A7068] block mb-1">
                    Date & Horaires *
                  </label>
                  <div className="relative">
                    <Calendar className="w-3.5 h-3.5 text-[#7A7068] absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={dateStr}
                      onChange={(e) => setDateStr(e.target.value)}
                      placeholder="Ex : Samedi 24 Octobre 2026 • 18h00"
                      className="w-full bg-white border border-[#D9D0C6] rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm font-medium text-[#14110F] focus:outline-none focus:border-[#FF6A2B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#7A7068] block mb-1">
                    Lieu & Emplacement *
                  </label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-[#7A7068] absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Ex : Théâtre de Verdure, Beaux-Arts, Pullman..."
                      className="w-full bg-white border border-[#D9D0C6] rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm font-medium text-[#14110F] focus:outline-none focus:border-[#FF6A2B]"
                    />
                  </div>
                </div>
              </div>

              {/* Tarif / Montant du Don & Organisateur */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#7A7068] block mb-1">
                    {selectedType === 'Donation' ? 'Montant Suggéré du Don (USD) *' : 'Tarif du Pass d’Entrée (USD) *'}
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-2.5 text-xs font-bold text-[#FF6A2B]">$</span>
                      <input
                        type="number"
                        min="1"
                        max="500"
                        value={priceUSD}
                        onChange={(e) => setPriceUSD(Number(e.target.value) || 1)}
                        className="w-full bg-white border border-[#D9D0C6] rounded-xl pl-7 pr-3 py-2 text-xs sm:text-sm font-bold font-mono text-[#14110F] focus:outline-none focus:border-[#FF6A2B]"
                      />
                    </div>
                    <span className="text-xs font-mono font-bold text-[#7A7068] shrink-0">
                      ≈ {formatCDF(priceUSD)}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#7A7068] block mb-1">
                    Nom de l’Organisateur / Collectif
                  </label>
                  <input
                    type="text"
                    value={organizerName}
                    onChange={(e) => setOrganizerName(e.target.value)}
                    placeholder="Ex : Association Culturelle Kin, LAB3..."
                    className="w-full bg-white border border-[#D9D0C6] rounded-xl px-3 py-2.5 text-xs sm:text-sm font-medium text-[#14110F] focus:outline-none focus:border-[#FF6A2B]"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#7A7068] block mb-1">
                  Description succincte
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Présentez les temps forts de l’activité en 2 ou 3 phrases percutantes..."
                  className="w-full bg-white border border-[#D9D0C6] rounded-xl px-3 py-2 text-xs font-medium text-[#14110F] focus:outline-none focus:border-[#FF6A2B] resize-none"
                />
              </div>

              {/* Image d'illustration */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#7A7068] block mb-1.5">
                  Image de couverture (choisir parmi les suggestions)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {activeConfig.defaultImages.concat([
                    'https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=400&q=80',
                    'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=400&q=80'
                  ]).slice(0, 4).map((imgUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => { setSelectedImage(imgUrl); setCustomImage(''); }}
                      className={`relative h-16 rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImage === imgUrl && !customImage
                          ? 'border-[#FF6A2B] ring-2 ring-[#FF6A2B]/20 scale-102'
                          : 'border-transparent opacity-75 hover:opacity-100'
                      }`}
                    >
                      <img src={imgUrl} alt="Illustration" className="w-full h-full object-cover" />
                      {selectedImage === imgUrl && !customImage && (
                        <div className="absolute top-1 right-1 w-4 h-4 bg-[#FF6A2B] text-[#14110F] rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full min-h-[48px] rounded-full bg-[#FF6A2B] hover:bg-[#E24E10] text-[#14110F] font-bold text-xs uppercase tracking-wider shadow-sm transition active:scale-95 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#14110F]" />
                  <span>Publier mon {selectedType} sur VUKA Pay</span>
                </button>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
};
