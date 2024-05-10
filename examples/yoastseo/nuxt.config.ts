// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '../../src/module',
    '@nuxt/eslint'
  ],
  future: {
    compatibilityVersion: 4
  },
  wpNuxt: {
    wordpressUrl: 'https://wordpress.wpnuxt.com',
    stagingUrl: 'https://staging.wpnuxt.com',
    frontendUrl: 'https://demo.wpnuxt.com',
    faustSecretKey: ''
  },
  srcDir: 'test-src/',
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
  devtools: {
    enabled: true
  }
})
