// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [
      // Polyfill Web Crypto API for AWS Amplify build environment
      {
        name: 'polyfill-webcrypto',
        enforce: 'pre',
        async config() {
          if (typeof globalThis.crypto === 'undefined' || !globalThis.crypto.subtle) {
            try {
              await import('@edge-runtime/polyfills');
              console.log('Applied @edge-runtime/polyfills polyfill');
            } catch (e) {
              console.warn('@edge-runtime/polyfills is not installed');
            }
          }
        }
      },
      tailwindcss(),
    ]
  },
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@nuxt/ui',
    '@pinia/nuxt',
  ],
  
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || 'http://localhost:8000'
    }
  },

  app: {
    head: {
      title: 'Akili AI - Intelligent Chatbot Platform',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Build intelligent chatbots with Akili AI' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap' }
      ]
    }
  }
});
