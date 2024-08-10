import WPNuxtModule from '../../../src/module'

export default defineNuxtConfig({
  wpNuxt: {
    wordpressUrl: 'https://wordpress.wpnuxt.com',
    frontendUrl: 'https://demo.wpnuxt.com'
  },
  modules: [
    WPNuxtModule
  ]
})
