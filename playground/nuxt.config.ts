export default defineNuxtConfig({
  extends: [
    '@nuxt/ui-pro',
  ],
  modules: [
    '@nuxt/image',
    '@nuxt/ui',
    '../src/module',
  ],
  runtimeConfig: {
    faustSecretKey: '',
    public: {
      frontendSiteUrl: 'http://localhost:3000'
    }
  },
  wpNuxt: {
    wordpressUrl: 'https://wordpress.wpnuxt.com',
    showBlockInfo: false,
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
