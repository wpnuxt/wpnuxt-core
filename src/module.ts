import { defineNuxtModule, addComponentsDir, addImportsDir, addPlugin, createResolver, installModule } from '@nuxt/kit'
import defu from 'defu'
import fs from 'fs'

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
    wordpressUrl: 'https://wordpress.wpnuxt.com',
    showBlockInfo: false
  },
  async setup (options, nuxt) {
    console.log('ℹ WPNuxt: Connecting GraphQL to', options.wordpressUrl)
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

    // Register user block components
    const _layers = [...nuxt.options._layers].reverse()
    for (const layer of _layers) {
      const srcDir = layer.config.srcDir
      const blockComponents = resolver.resolve(srcDir, 'components/blocks')
      const dirStat = await fs.promises.stat(blockComponents).catch(() => null)
      if (dirStat && dirStat.isDirectory()) {
        nuxt.hook('components:dirs', (dirs) => {
          dirs.unshift({
            path: blockComponents,
            global: true,
            pathPrefix: false,
            prefix: ''
          })
        })
      }
    }

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
