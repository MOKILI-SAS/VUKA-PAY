import React from 'react';

interface VukaLogoProps {
  variant?: 'default' | 'inverse' | 'on-braise' | 'mono-nuit' | 'mono-white' | 'symbol-only';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
}

export const VukaLogo: React.FC<VukaLogoProps> = ({
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  // Détermination des couleurs selon la variante de la charte v1.0
  let ringColor = '#FF6A2B'; // Braise
  let chipColor = '#FFC21A'; // Soleil
  let textColor = '#14110F'; // Nuit

  if (variant === 'inverse') {
    ringColor = '#FF6A2B';
    chipColor = '#FFC21A';
    textColor = '#FBF6EE'; // Sable
  } else if (variant === 'on-braise') {
    ringColor = '#14110F';
    chipColor = '#FFC21A';
    textColor = '#14110F';
  } else if (variant === 'mono-nuit') {
    ringColor = '#14110F';
    chipColor = '#14110F';
    textColor = '#14110F';
  } else if (variant === 'mono-white') {
    ringColor = '#FFFFFF';
    chipColor = '#FFFFFF';
    textColor = '#FFFFFF';
  }

  // Dimensions
  const heights = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-10',
    xl: 'h-14',
  };

  const symbolOnly = variant === 'symbol-only';

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Symbole VUKA : Anneau ouvert (Bracelet) + Puce RFID centrale */}
      <svg
        viewBox="0 0 90 100"
        className={`${heights[size]} w-auto shrink-0`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="VUKA Symbole"
      >
        {/* Anneau Braise ouvert (Bracelet) : centre (45, 50), rayon 30, trait 11, extrémités arrondies */}
        <circle
          cx="45"
          cy="50"
          r="30"
          stroke={ringColor}
          strokeWidth="11"
          strokeLinecap="round"
          strokeDasharray="155 34"
          strokeDashoffset="12"
        />
        {/* Puce RFID centrale : disque plein Soleil (rayon 8 au centre 45, 50) */}
        <circle
          cx="45"
          cy="50"
          r="8"
          fill={chipColor}
        />
      </svg>

      {!symbolOnly && (
        <div className="flex items-baseline">
          <span
            className="font-bold tracking-tight lowercase leading-none"
            style={{
              fontFamily: 'Poppins, system-ui, sans-serif',
              fontSize: size === 'xl' ? '2.4rem' : size === 'lg' ? '1.8rem' : size === 'sm' ? '1.1rem' : '1.45rem',
              color: textColor,
              letterSpacing: '-0.03em',
            }}
          >
            vuka
          </span>
          <span
            className="font-bold lowercase leading-none ml-0.5"
            style={{
              fontFamily: 'Poppins, system-ui, sans-serif',
              fontSize: size === 'xl' ? '2.4rem' : size === 'lg' ? '1.8rem' : size === 'sm' ? '1.1rem' : '1.45rem',
              color: ringColor,
              letterSpacing: '-0.03em',
            }}
          >
            pay
          </span>
        </div>
      )}
    </div>
  );
};
