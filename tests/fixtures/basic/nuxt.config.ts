import WPNuxtModule from '../../../src/module'

export default defineNuxtConfig({
  modules: [
    WPNuxtModule
  ],
  wpNuxt: {
    wordpressUrl: 'https://wordpress.wpnuxt.com',
    frontendUrl: 'https://demo.wpnuxt.com'
  }
})
