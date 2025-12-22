// tailwind.config.cjs
module.exports = {

   darkMode: 'class', 
   
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
      
        sans: ['Geist', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto']
      }
    }
  },
  plugins: []
}
