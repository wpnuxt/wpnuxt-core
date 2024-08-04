import { defineNuxtPlugin } from 'nuxt/app'
import VueSanitize from 'vue-sanitize-directive'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueSanitize)
})
