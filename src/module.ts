import { defineNuxtModule, addImports, addImportsDir, addPlugin, createResolver, installModule } from '@nuxt/kit'

// Module options TypeScript interface definition
export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'wpnuxt-module',
    configKey: 'wpNuxt'
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  async setup (options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // todo: addto module configuration
    const wordpressUrl = 'https://wpnuxt.vernaillen.com';

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin(resolver.resolve('./runtime/plugin'))

    addImportsDir(resolver.resolve('./runtime/composables'))

    await installModule('nuxt-graphql-middleware', {
      debug: true,
      graphqlEndpoint: `${wordpressUrl}/graphql`,
      codegenConfig: {
        silent: false,
        skipTypename: true,
        useTypeImports: true,
        dedupeFragments: true,
        onlyOperationTypes: false,
        avoidOptionals: false,
        disableOnBuild: false,
        schema: {
        } as any,
        documents: [resolver.resolve('!./graphql/**/*')],
        generates: {
          './graphql/': {
            preset: 'client',
            plugins: [],
          },
        },
      },
      outputDocuments: true,
      autoImportPatterns: [
        resolver.resolve('./runtime/queries/**/*.gql'),
      ],
    })
  }
})
