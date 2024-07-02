export default defineNuxtConfig({
  extends: [
    '@nuxt/ui-pro'
  ],

  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    '../src/module'
  ],

  future: {
    compatibilityVersion: 4
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    },
    checker: {
      lintOnStart: true,
      fix: true
    }
  },

  experimental: {
    payloadExtraction: true
  },

  wpNuxt: {
    wordpressUrl: 'https://wordpress.wpnuxt.com',
    frontendUrl: 'https://demo.wpnuxt.com',
    faustSecretKey: '',
    blocks: true,
    showBlockInfo: false,
    replaceSchema: false,
    enableCache: true,
    staging: false,
    logLevel: 4,
    downloadSchema: true,
    generateComposables: {
      enabled: true,
      prefix: 'use'
    }
  },

  ui: {
    icons: ['heroicons', 'uil', 'mdi']
  },

  image: {
    provider: 'twicpics',
    domains: ['wordpress.wpnuxt.com'],
    twicpics: {
      baseURL: 'https://vernaillen.twic.pics/wpnuxt-demo'
    }
  },

  routeRules: {
    '/wp-content/**': { proxy: { to: 'http://localhost:10004/wp-content/**' } }
  },

  devtools: { enabled: true },
  compatibilityDate: '2024-07-02'
})
