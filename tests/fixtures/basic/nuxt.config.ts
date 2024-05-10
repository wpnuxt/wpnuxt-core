import WPNuxtModule from '../../../src/module'

export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      myValue: 'original value'
    }
  },
  modules: [
    WPNuxtModule
  ]
})
