import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

export default createConfigForNuxt({
  features: {
    tooling: true,
    stylistic: {
      commaDangle: 'never',
      braceStyle: '1tbs'
    }
  }
},
{
  rules: {
    'vue/multi-word-component-names': 0,
    'vue/no-v-html': 0
  },
  ignores: [
    'wordpress',
    'dist',
    'node_modules',
    '.output',
    '.nuxt'
  ]
})
