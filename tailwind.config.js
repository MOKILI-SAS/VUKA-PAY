/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // VUKA Charte Graphique v1.0 — Tokens officiels
        braise: {
          DEFAULT: '#FF6A2B',       // Couleur d'action : boutons primaires, éléments clés (Texte Nuit dessus)
          pressed: '#E24E10',       // État pressé des boutons primaires
          tint: '#FFE3D3',          // Fonds teintés, onglet actif
        },
        nuit: {
          DEFAULT: '#14110F',       // Texte principal, carte solde, fonds sombres
          surface: '#1E1A17',       // Surface mode sombre
          elevated: '#2A2420',      // Surface élevée mode sombre
        },
        soleil: {
          DEFAULT: '#FFC21A',       // Accent, alertes douces, solde faible (Texte Nuit dessus)
          tint: '#FFF3CC',
        },
        fleuve: {
          DEFAULT: '#0E5A8A',       // Liens, informations, focus (Contraste 7,4:1 sur blanc)
          tint: '#E3EEF6',
        },
        sable: {
          DEFAULT: '#FBF6EE',       // Fond d'écran par défaut (60% avec blanc)
        },
        vukaGray: {
          100: '#F3ECE2',           // Séparateurs, fonds désactivés
          300: '#D9D0C6',           // Bordures de champs
          500: '#7A7068',           // Texte secondaire (~4,8:1 sur blanc)
          700: '#4A433D',           // Texte secondaire renforcé
        },
        // Sémantiques
        vukaSuccess: {
          DEFAULT: '#167A42',       // Succès (~5,4:1 sur blanc)
          tint: '#E2F3E9',
        },
        vukaError: {
          DEFAULT: '#C62828',       // Erreur (~5,6:1 sur blanc)
          tint: '#FBE5E5',
        },
        vukaWarning: {
          DEFAULT: '#FFC21A',
          tint: '#FFF3CC',
        },
        vukaInfo: {
          DEFAULT: '#0E5A8A',
          tint: '#E3EEF6',
        },
        // Compatibilité / raccourcis VUKA
        vuka: {
          braise: '#FF6A2B',
          braiseDark: '#E24E10',
          braiseLight: '#FFE3D3',
          nuit: '#14110F',
          soleil: '#FFC21A',
          fleuve: '#0E5A8A',
          sable: '#FBF6EE',
          gray100: '#F3ECE2',
          gray300: '#D9D0C6',
          gray500: '#7A7068',
          gray700: '#4A433D',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
      borderRadius: {
        'sm': '8px',                // Badges, petits éléments
        'md': '12px',               // Boutons, champs
        'lg': '16px',               // Cartes
        'xl': '24px',               // Feuilles du bas, modales
        'pill': '999px',            // Pastilles
      },
      boxShadow: {
        'level0': 'none',
        'level1': '0 1px 3px rgba(20, 17, 15, 0.08)',       // Niveau 1 : cartes
        'level2': '0 8px 24px rgba(20, 17, 15, 0.16)',      // Niveau 2 : feuilles, modales
        'braise': '0 4px 14px 0 rgba(255, 106, 43, 0.25)',
      }
    },
  },
  plugins: [],
}
