import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, User, Mail, Phone, Lock, ShieldCheck, ArrowRight, Building2 } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    authModalMode, 
    setAuthModalMode,
    isOrganizerAuthMode,
    setIsOrganizerAuthMode,
    setAppViewMode,
    setActiveBackofficeModule,
    setCurrentRole,
    registerUser,
    loginUser
  } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+243 ');
  const [password, setPassword] = useState('');
  const [loginIdentifier, setLoginIdentifier] = useState(isOrganizerAuthMode ? 'organisateur@vuka.cd' : '');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleClose = () => {
    setIsAuthModalOpen(false);
    setIsOrganizerAuthMode(false);
    setError(null);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError('Veuillez renseigner votre nom complet.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Veuillez renseigner une adresse email valide.');
      return;
    }
    if (!phone.trim() || phone.trim() === '+243') {
      setError('Veuillez renseigner votre numéro de téléphone.');
      return;
    }

    setIsLoading(true);
    try {
      await registerUser(name, email, phone, password);
      setIsOrganizerAuthMode(false);
    } catch (err) {
      setError('Erreur lors de la création du compte.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!loginIdentifier.trim()) {
      setError('Veuillez saisir votre email ou numéro de téléphone.');
      return;
    }

    setIsLoading(true);
    try {
      if (isOrganizerAuthMode) {
        // Redirection vers le Dashboard Organisateur pour poster ses événements et suivre son déroulement
        setCurrentRole('SUPER_ADMIN');
        setActiveBackofficeModule('SUPER_ADMIN');
        setAppViewMode('BACKOFFICE_STAFF');
        setIsAuthModalOpen(false);
        setIsOrganizerAuthMode(false);
      } else {
        await loginUser(loginIdentifier, loginPassword);
      }
    } catch (err) {
      setError('Identifiants incorrects.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white rounded-[28px] border border-[#D9D0C6] shadow-2xl p-6 sm:p-8 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#F3ECE2] hover:bg-[#D9D0C6] text-[#7A7068] hover:text-[#14110F] flex items-center justify-center transition"
          aria-label="Fermer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFE3D3] border border-[#FF6A2B]/20 text-xs font-bold text-[#14110F] uppercase tracking-wider mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A2B]" />
            <span>{isOrganizerAuthMode ? 'Espace Organisateur & Billetterie' : 'Espace Festivalier VUKA Pay'}</span>
          </div>
          <h2 className="text-2xl font-bold text-[#14110F] tracking-tight font-heading">
            {isOrganizerAuthMode 
              ? 'Connexion Organisateur' 
              : (authModalMode === 'REGISTER' ? 'Créer mon Compte' : 'Bon retour parmi nous')}
          </h2>
          <p className="text-xs text-[#7A7068] mt-1">
            {isOrganizerAuthMode
              ? 'Connectez-vous à votre dashboard pour poster vos événements et piloter leur déroulement en temps réel.'
              : (authModalMode === 'REGISTER' 
                  ? 'Accédez à vos billets, votre bracelet RFID et votre portefeuille cashless.' 
                  : 'Connectez-vous pour gérer vos pass et recharger votre solde.')}
          </p>
        </div>

        {/* Mode Switcher Tabs (seulement pour les festivaliers) */}
        {!isOrganizerAuthMode && (
          <div className="grid grid-cols-2 p-1 bg-[#F3ECE2] rounded-full mb-6">
            <button
              type="button"
              onClick={() => { setAuthModalMode('REGISTER'); setError(null); }}
              className={`py-2 text-xs font-bold rounded-full transition-all ${
                authModalMode === 'REGISTER'
                  ? 'bg-white text-[#14110F] shadow-sm'
                  : 'text-[#4A433D] hover:text-[#14110F]'
              }`}
            >
              Créer un compte
            </button>
            <button
              type="button"
              onClick={() => { setAuthModalMode('LOGIN'); setError(null); }}
              className={`py-2 text-xs font-bold rounded-full transition-all ${
                authModalMode === 'LOGIN'
                  ? 'bg-white text-[#14110F] shadow-sm'
                  : 'text-[#4A433D] hover:text-[#14110F]'
              }`}
            >
              Se connecter
            </button>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-xs text-[#C62828] font-medium">
            {error}
          </div>
        )}

        {/* REGISTER FORM (Festivalier) */}
        {!isOrganizerAuthMode && authModalMode === 'REGISTER' ? (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#14110F] uppercase tracking-wider mb-1.5">
                Nom complet
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A7068]" />
                <input
                  type="text"
                  required
                  placeholder="Ex : Serge Mwamba"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#FBF6EE] border border-[#D9D0C6] focus:border-[#FF6A2B] focus:bg-white text-xs font-medium text-[#14110F] outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#14110F] uppercase tracking-wider mb-1.5">
                Numéro Mobile Money / WhatsApp (RDC)
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A7068]" />
                <input
                  type="tel"
                  required
                  placeholder="+243 81 234 5678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#FBF6EE] border border-[#D9D0C6] focus:border-[#FF6A2B] focus:bg-white text-xs font-mono font-medium text-[#14110F] outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#14110F] uppercase tracking-wider mb-1.5">
                Adresse Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A7068]" />
                <input
                  type="email"
                  required
                  placeholder="nom@exemple.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#FBF6EE] border border-[#D9D0C6] focus:border-[#FF6A2B] focus:bg-white text-xs font-medium text-[#14110F] outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#14110F] uppercase tracking-wider mb-1.5">
                Mot de passe (ou code PIN à 4 chiffres)
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A7068]" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#FBF6EE] border border-[#D9D0C6] focus:border-[#FF6A2B] focus:bg-white text-xs font-medium text-[#14110F] outline-none transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-6 rounded-full bg-[#FF6A2B] hover:bg-[#E24E10] text-[#14110F] font-bold text-xs uppercase tracking-wider shadow-sm flex items-center justify-center gap-2 transition active:scale-95 disabled:opacity-50"
            >
              {isLoading ? (
                <span>Création en cours...</span>
              ) : (
                <>
                  <span>Créer mon Compte Festivalier</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#14110F]" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* LOGIN FORM (Festivalier ou Organisateur) */
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#14110F] uppercase tracking-wider mb-1.5">
                {isOrganizerAuthMode ? 'Email ou Identifiant Organisateur' : 'Téléphone M-Pesa ou Adresse Email'}
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A7068]" />
                <input
                  type="text"
                  required
                  placeholder={isOrganizerAuthMode ? 'organisateur@vuka.cd' : '+243 81 234 5678 ou email'}
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#FBF6EE] border border-[#D9D0C6] focus:border-[#FF6A2B] focus:bg-white text-xs font-medium text-[#14110F] outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#14110F] uppercase tracking-wider mb-1.5">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A7068]" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#FBF6EE] border border-[#D9D0C6] focus:border-[#FF6A2B] focus:bg-white text-xs font-medium text-[#14110F] outline-none transition"
                />
              </div>
            </div>

            {isOrganizerAuthMode && (
              <div className="p-3 rounded-xl bg-[#FBF6EE] border border-[#D9D0C6] text-[11px] text-[#7A7068]">
                Espace réservé aux promoteurs de festivals, concerts et salons professionnels en RDC.
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-6 rounded-full bg-[#FF6A2B] hover:bg-[#E24E10] text-[#14110F] font-bold text-xs uppercase tracking-wider shadow-sm flex items-center justify-center gap-2 transition active:scale-95 disabled:opacity-50"
            >
              {isLoading ? (
                <span>Connexion...</span>
              ) : (
                <>
                  <span>{isOrganizerAuthMode ? 'Accéder à mon Dashboard Organisateur' : 'Accéder à mon Compte'}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#14110F]" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Security assurance */}
        <div className="mt-6 pt-4 border-t border-[#F3ECE2] flex items-center justify-center gap-2 text-[11px] text-[#7A7068] font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-[#167A42]" />
          <span>Sécurité bancaire & Souveraineté des données RDC</span>
        </div>
      </div>
    </div>
  );
};
