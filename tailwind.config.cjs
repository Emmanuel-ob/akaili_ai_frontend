// tailwind.config.cjs
module.exports = {
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './app.vue',
    './composables/**/*.{js,ts}',
    './plugins/**/*.{js,ts}',
    './content/**/*.{md,vue}'
  ],
  theme: {
    extend: {
      fontFamily: {
        // map font-sans to Geist for convenience
        sans: ['Geist', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto']
      }
    }
  },
  plugins: []
}
