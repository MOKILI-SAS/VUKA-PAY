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
        vuka: {
          primary: '#FF5722',       // Terracotta Sunset
          primaryHover: '#E64A19',
          gold: '#FFB300',          // Kinshasa Gold
          goldHover: '#FFA000',
          dark: '#0A0D17',          // Night Sky Base
          darkCard: '#121829',      // Dark Card Background
          darkBorder: '#1E293B',    // Border in Dark
          cyan: '#00D2FF',          // Electric Cyan / NFC
          cyanDark: '#0891B2',
          emerald: '#10B981',       // Congo Emerald / Succès
          canvas: '#FAFAF9',        // Warm Light Canvas
          cream: '#F4EFEA',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Cabinet Grotesk', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Space Mono', 'monospace'],
      },
      boxShadow: {
        'vuka': '0 10px 30px -10px rgba(255, 87, 34, 0.25)',
        'vuka-cyan': '0 10px 30px -10px rgba(0, 210, 255, 0.25)',
        'glow': '0 0 25px rgba(255, 87, 34, 0.35)',
      }
    },
  },
  plugins: [],
}
