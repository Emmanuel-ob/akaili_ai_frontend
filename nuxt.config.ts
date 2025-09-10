// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import { webcrypto } from 'node:crypto';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  vite: {
    define: {
      // Shim global crypto for Vite build
      globalThis: `({ crypto: {
        subtle: ${webcrypto.subtle},
        getRandomValues: (arr) => crypto.randomFillSync(arr),
        hash: async (alg, data) => {
          const buffer = await webcrypto.subtle.digest(alg, data);
          return new Uint8Array(buffer);
        }
      }})`
    },
    plugins: [
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
      apiBase: process.env.API_BASE_URL || 'http://localhost:8000',
    },
  },

  app: {
    head: {
      title: 'Akili AI - Intelligent Chatbot Platform',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Build intelligent chatbots with Akili AI' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap',
        },
      ],
    },
  },
});
