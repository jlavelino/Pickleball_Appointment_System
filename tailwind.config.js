/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{vue,js,ts}',
    './pages/**/*.vue',
    './composables/**/*.{js,ts}',
    './stores/**/*.{js,ts}',
    './app.vue',
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#0B6623',
          dark: '#14231C',
          light: '#2D7D32',
          soft: '#E8F4D8',
        },
        lime: {
          DEFAULT: '#9ACD32',
          soft: '#F4F9EB',
        },
        cream: {
          DEFAULT: '#FAF9F1',
          card: '#FFFFFF',
          muted: '#F5F3E8',
        },
        ink: {
          DEFAULT: '#14231C',
          soft: '#66756D',
          muted: '#8A938D',
        },
        border: {
          light: '#DCE6D8',
          subtle: '#EAEFE7',
        },
        status: {
          available: '#0B6623',
          availableBg: '#E8F4D8',
          pending: '#D98216',
          pendingBg: '#FEF3D6',
          full: '#D94A4A',
          fullBg: '#FDE8E8',
          outOfStock: '#D94A4A',
          outOfStockBg: '#FDE8E8',
        },
      },
      fontFamily: {
        display: ['"DM Serif Display"', 'Fraunces', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      borderRadius: {
        app: '28px',
        card: '22px',
        btn: '18px',
      },
      boxShadow: {
        subtle: '0 2px 10px -2px rgba(20, 35, 28, 0.05)',
        card: '0 4px 20px -4px rgba(20, 35, 28, 0.06)',
        cta: '0 6px 20px -4px rgba(11, 102, 35, 0.35)',
        sheet: '0 -16px 40px -6px rgba(20, 35, 28, 0.25)',
      },
    },
  },
  plugins: [],
}
