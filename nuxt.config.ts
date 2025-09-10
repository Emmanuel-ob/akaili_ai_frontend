// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [
      {
        name: 'polyfill-crypto-hash',
        enforce: 'pre',
        async config() {
          if (typeof globalThis.crypto === 'undefined' || !globalThis.crypto.hash) {
            const { webcrypto } = await import('node:crypto');
            if (!globalThis.crypto) {
              globalThis.crypto = webcrypto;
            }
            if (!globalThis.crypto.hash) {
              globalThis.crypto.hash = async (algorithm: string, data: BufferSource) => {
                const digest = await webcrypto.subtle.digest(algorithm, data);
                return new Uint8Array(digest);
              };
            }
          }
        }
      },
      tailwindcss(),
    ],
    define: {
      'process.env': {},  // prevent some process errors
    },
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
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap' },
         { rel: 'stylesheet', href: 'https://unpkg.com/aos@2.3.1/dist/aos.css' }
      ],
       script: [
        { src: 'https://unpkg.com/aos@2.3.1/dist/aos.js', defer: true }
      ]
    }
  }
});
