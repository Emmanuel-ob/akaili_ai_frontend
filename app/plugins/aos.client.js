import AOS from 'aos'
import 'aos/dist/aos.css'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:mounted', () => {
    AOS.init({
      duration: 1000, // animation duration (ms)
      once: true,     // whether animation should happen only once
    })
  })
})
