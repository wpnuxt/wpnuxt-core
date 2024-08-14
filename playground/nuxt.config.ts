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

  wpNuxt: {
    wordpressUrl: 'https://wordpress.wpnuxt.com',
    frontendUrl: 'https://demo.wpnuxt.com',
    enableCache: true,
    staging: false,
    logLevel: 4,
    downloadSchema: true,
    composablesPrefix: 'use'
  },

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
  compatibilityDate: '2024-07-09'
})
