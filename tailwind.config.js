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
        cream: '#F5F1DE',
        'cream-card': '#FDFCF5',
        ink: '#223318',
        'ink-soft': '#5E6B4E',
        line: '#E2E2BE',
        orange: '#4C7A22',
        'orange-dark': '#38591A',
        relish: '#E0902F',
        'relish-dark': '#C97A1E',
        lime: '#96C33E',
        'lime-soft': '#EAF1CE',
        'lime-text': '#3F6019',
        sold: '#F7E8D2',
        'sold-text': '#C97A1E',
        gray: '#847E63',
        'danger-bg': '#F7E8D2',
        'danger-text': '#B4661E',
        seed: '#2E4A1A',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        app: '28px',
        card: '16px',
        btn: '14px',
      },
    },
  },
  plugins: [],
}
