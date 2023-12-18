export default defineNuxtConfig({
  extends: '@nuxt/ui-pro',
  modules: [
    '@nuxt/content',
    '@nuxt/ui',
    '@nuxthq/studio',
    '@vueuse/nuxt',
    '@nuxtjs/fontaine',
    '@nuxtjs/google-fonts',
    'nuxt-og-image',
    '@nuxtjs/plausible'
  ],
  devtools: { enabled: true },

  nitro: {
    prerender: {
      routes: [
        '/api/search.json'
      ]
    }
  },
  colorMode: {
    preference: 'dark'
  },
  ui: {
    icons: ['heroicons', 'simple-icons', 'ph', 'ant-design']
  },

  fontMetrics: {
    fonts: [
      'DM Sans',
      'EB Garamond'
    ]
  },

  googleFonts: {
    display: 'swap',
    download: true,
    families: {
      'DM+Sans': [400, 500, 600, 700]
    }
  },

  hooks: {
    // Related to https://github.com/nuxt/nuxt/pull/22558
    // Adding all global components to the main entry
    // To avoid lagging during page navigation on client-side
    'components:extend': function (components) {
      for (const comp of components) {
        if (comp.global) { comp.global = 'sync' }
      }
    }
  }
})
