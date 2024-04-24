import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

export default createConfigForNuxt({
  features: {
    tooling: true,
    stylistic: true,
  },
},
{
  rules: {
    'vue/multi-word-component-names': 0,
    'vue/no-v-html': 0,
  },
})
