export default defineNuxtConfig({
  modules: [
    '../src/module',
    '@nuxt/image'
  ],
  wpNuxt: {
    wordpressUrl: 'https://wordpress.wpnuxt.com',
    showBlockInfo: false,
  },
  devtools: { enabled: true }
})
