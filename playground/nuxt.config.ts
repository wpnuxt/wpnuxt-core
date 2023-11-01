export default defineNuxtConfig({
  modules: ['../src/module'],
  wpNuxt: {
    wordpressUrl: 'https://wpnuxt.vernaillen.com',
    showBlockInfo: false,
  },
  devtools: { enabled: true }
})
