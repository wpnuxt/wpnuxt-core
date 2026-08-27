/**
 * Core Playground
 *
 * Minimal setup with only @wpnuxt/core - no UI framework or content rendering library.
 * Good for testing core WPNuxt functionality (GraphQL queries, composables, etc.)
 * without any additional dependencies.
 */
const IS_CI = process.env.CI === 'true'

export default defineNuxtConfig({
  modules: ['@wpnuxt/core'],

  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  compatibilityDate: '2026-08-27',

  wpNuxt: {
    wordpressUrl: 'https://wordpress.wpnuxt.com',
    downloadSchema: !IS_CI // Use committed schema in CI (WordPress not accessible)
  }
})
