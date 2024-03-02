export default defineNuxtConfig({
  extends: [
    '@nuxt/ui-pro',
  ],
  modules: [
    '@nuxt/image',
    '@nuxt/ui',
    '../src/module',
  ],
  experimental: {
    payloadExtraction: true
  },
  wpNuxt: {
    wordpressUrl: 'https://wordpress.wpnuxt.com',
    stagingUrl: 'https://staging.wpnuxt.com',
    frontendUrl: 'https://demo.wpnuxt.com',
    faustSecretKey: '',
    showBlockInfo: false,
    debug: false,
    replaceSchema: false
  },
  graphqlMiddleware: {
    downloadSchema: true,
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
  devtools: { enabled: true }
})
