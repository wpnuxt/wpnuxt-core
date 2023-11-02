export default defineNuxtConfig({
  modules: [
    '../src/module',
    '@nuxt/image'
  ],
  wpNuxt: {
    wordpressUrl: 'https://wpnuxt.vernaillen.com',
    showBlockInfo: false,
  },
  devtools: { enabled: true }
})
