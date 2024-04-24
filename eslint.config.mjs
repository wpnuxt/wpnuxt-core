import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

export default createConfigForNuxt({
  features: {
    tooling: true,
    stylistic: true,
  },
},
{
  files: ['**/pages/*.vue', '**/layouts/*.vue', '**/docs/error.vue'],
  rules: {
    'vue/multi-word-component-names': 'off',
  },
})
