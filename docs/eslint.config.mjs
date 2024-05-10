import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    rules: {
      // Global
      'semi': ['error', 'never'],
      'quotes': ['error', 'single'],
      // Vue
      'vue/multi-word-component-names': 0,
      'vue/max-attributes-per-line': 'off',
      'vue/no-v-html': 0
    },
    ignores: [
      'wordpress',
      'dist',
      'node_modules',
      '.output',
      '.nuxt'
    ]
  }
)
