import { defineNuxtModule, addComponentsDir, addImportsDir, addPlugin, createResolver, installModule } from '@nuxt/kit'
import defu from 'defu'

// Module options TypeScript interface definition
export interface ModuleOptions {
  wordpressUrl: string
  showBlockInfo?: boolean
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'wpnuxt-module',
    configKey: 'wpNuxt'
  },
  // Default configuration options of the Nuxt module
  defaults: {
    wordpressUrl: 'http://localhost',
    showBlockInfo: false
  },
  async setup (options, nuxt) {
    console.log('Setting up wpnuxt-module, options: ', options)
    const resolver = createResolver(import.meta.url)

    // TODO: test if wordpressUrl is provided!
    // TODO: use showBlockInfo (once the core components are migrated)

    nuxt.options.runtimeConfig.public.wpNuxt = defu(nuxt.options.runtimeConfig.public.wpNuxt, {
      wordpressUrl: options.wordpressUrl!
    })
    addPlugin(resolver.resolve('./runtime/plugin'))
    addImportsDir(resolver.resolve('./runtime/composables'))

    addComponentsDir({
      path: resolver.resolve('./runtime/components'),
      pathPrefix: false,
      prefix: '',
      global: true
    })

    await installModule('nuxt-graphql-middleware', {
      debug: true,
      graphqlEndpoint: `${options.wordpressUrl}/graphql`,
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
  },
})

declare module '@nuxt/schema' {
  interface PublicRuntimeConfig {
    wpNuxt: {
      wordpressUrl: string
      showBlockInfo?: boolean
    }
  }

  interface ConfigSchema {
    runtimeConfig: {
      public?: {
        wordpressUrl: string
        showBlockInfo?: boolean
      }
    }
  }
}
