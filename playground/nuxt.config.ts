export default defineNuxtConfig({
  extends: [
    '@nuxt/ui-pro',
  ],
  modules: [
    '@nuxt/image',
    '@nuxt/ui',
    '../src/module',
  ],
  wpNuxt: {
    wordpressUrl: 'https://wordpress.wpnuxt.com',
    frontendUrl: 'https://demo.wpnuxt.com',
    faustSecretKey: '',
    showBlockInfo: false,
    debug: false
  },
  image: {
    provider: 'twicpics',
    domains: ['wordpress.wpnuxt.com'],
    twicpics: {
      baseURL: 'https://vernaillen.twic.pics/wpnuxt-demo'
    }
  },
  devtools: { enabled: true }
})
