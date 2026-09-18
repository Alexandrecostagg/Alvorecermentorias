/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        alvorecer: {
          gold: '#F4C048', // primária (texto apenas sobre fundos escuros)
          cream: '#FFF1DB', // fundo
          brown: '#8C6A2F', // accent / texto acessível sobre claro
          ink: '#0B172A', // navy profundo — fundos escuros
          deep: '#091321', // navy mais profundo — gradientes
          navy: '#1E3856', // navy de apoio — gradientes
          'gold-light': '#F6CF72', // texto dourado sobre navy
          'gold-hover': '#FFD36B', // hover do CTA dourado
          'brown-deep': '#7A5410', // texto dourado acessível sobre claro
          surface: '#FDFBF7', // fundo de card
          canvas: '#F8F5EE', // fundo de seção clara
          line: '#E8E1D4', // bordas suaves
          'image-bg': '#F1EDE4', // fundo de imagem
        },
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1', // primária
          600: '#4f46e5', // hover/ação
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        accent: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
        },
        path: {
          green: { bg: '#E8F0EC', fg: '#2F6650' },
          amber: { bg: '#F8ECD0', fg: '#8A5E08' },
          blue: { bg: '#E8EFF8', fg: '#315E91' },
          clay: { bg: '#F5E8E2', fg: '#9B513B' },
        },
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
      },
      boxShadow: {
        soft: '0 4px 12px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
};
