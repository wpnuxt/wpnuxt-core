// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '../../src/module',
  ],
  wpNuxt: {
    wordpressUrl: 'https://wordpress.wpnuxt.com',
    stagingUrl: 'https://staging.wpnuxt.com',
    frontendUrl: 'https://demo.wpnuxt.com',
    faustSecretKey: ''
  },
  srcDir: 'test-src/',
  devtools: {
    enabled: true
  }
})
