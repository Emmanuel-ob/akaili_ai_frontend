// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  devtools: { enabled: true },

  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
  },
  
  css: [
    '~/assets/css/main.css',
    'aos/dist/aos.css'
  ],

  vite: {
    optimizeDeps: {
      esbuildOptions: {
        // Node.js global to browser globalThis
        define: {
          global: 'globalThis',
        },
        plugins: [
          NodeGlobalsPolyfillPlugin({
            buffer: true,
            process: true,
            crypto: true,
          }),
        ],
      },
    },

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
   plugins: [
    '~/plugins/03.aos.client.js'
  ],
  // nuxt.config.ts
  runtimeConfig: {
    public: {
      apiBase: process.env.NODE_ENV === 'production'
        ? 'https://api.xeliai.com'
        : (process.env.API_BASE_URL || 'http://localhost:8000'),

      // CHANGE THESE:
      reverbAppKey: process.env.NODE_ENV === 'production'
        ? 'icwpzvsxp2ehqfk8z3wo'  // ← MUST match backend .env REVERB_APP_KEY
        : (process.env.NUXT_PUBLIC_REVERB_APP_KEY || 'icwpzvsxp2ehqfk8z3wo'),

      reverbHost: process.env.NODE_ENV === 'production'
        ? 'api.xeliai.com'
        : (process.env.NUXT_PUBLIC_REVERB_HOST || 'localhost'),

      reverbPort: process.env.NODE_ENV === 'production'
        ? '443'  // ← CHANGE FROM 8080 to 443 (uses Apache proxy)
        : (process.env.NUXT_PUBLIC_REVERB_PORT || '8080'),

      reverbScheme: process.env.NODE_ENV === 'production'
        ? 'https'  // ← Keep this as https
        : (process.env.NUXT_PUBLIC_REVERB_SCHEME || 'http'),

      stripePublishableKey: process.env.STRIPE_KEY,
      paystackPublicKey: process.env.PAYSTACK_PUBLIC_KEY
    },
  },

  // UPDATED APP CONFIGURATION
  app: {
    // 1. Enable Page Transitions
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
    
    head: {
      title: 'Xeli ai - Intelligent Chatbot Platform',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Build intelligent chatbots with Xeli ai' },
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