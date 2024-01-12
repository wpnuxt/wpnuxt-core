import { defineNuxtModule, addComponentsDir, addImportsDir, addPlugin, addRouteMiddleware, addServerHandler, createResolver, installModule, addServerImports, addServerImportsDir, addTemplate } from '@nuxt/kit'
import { existsSync } from 'node:fs'
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

    addRouteMiddleware({
      name: 'auth',
      path: resolver.resolve('./runtime/middleware/auth'),
      global: true
    })
    addComponentsDir({
      path: resolver.resolve('./runtime/components'),
      pathPrefix: false,
      prefix: '',
      global: true
    })

    const userPreviewPath = '~/pages/preview.vue'
      .replace(/^(~~|@@)/, nuxt.options.rootDir)
      .replace(/^(~|@)/, nuxt.options.srcDir)
    const userPreviewPageExists = existsSync(userPreviewPath)
    const previewPagePath = userPreviewPageExists ? userPreviewPath : './runtime/pages/preview.vue'

    nuxt.hook('pages:extend', (pages) => {
      pages.push({
        name: 'preview',
        path: '/preview',
        file: resolver.resolve(previewPagePath),
      });
      pages.push({
        name: 'auth',
        path: '/auth',
        file: resolver.resolve('./runtime/pages/auth.vue'),
      });
    });

    addServerHandler({
      route: '/api/tokensFromCode',
      handler: resolver.resolve('./runtime/server/api/tokensFromCode.post')
    })
    addServerHandler({
      route: '/api/tokensFromRefreshToken',
      handler: resolver.resolve('./runtime/server/api/tokensFromRefreshToken.post')
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

    await installModule('@vueuse/nuxt', {})
    await installModule('nuxt-multi-cache', {
      route: {
        enabled: true
      },
      component: {
        enabled: true
      },
      api: {
        enabled: true,
        prefix: '/__nuxt_multi_cache',
        authorization: 'hunter2',
        cacheTagInvalidationDelay: 60000
      }
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
      codegenSchemaConfig: {
        urlSchemaOptions: {
          headers: {
            Authorization: 'server-token',
          },
        },
      },
      outputDocuments: true,
      autoImportPatterns: [
        resolver.resolve('./runtime/queries/**/*.gql'),
      ],
    })
    const resolvedMCPath = resolver.resolve('./runtime/app/multiCache.serverOptions')
    const templateMC = addTemplate({
        filename: 'multiCache.serverOptions',
        write: true,
        getContents: () => `export { default } from '${resolvedMCPath}'`
    })
    nuxt.options.nitro.externals = nuxt.options.nitro.externals || {}
    nuxt.options.nitro.externals.inline = nuxt.options.nitro.externals.inline || []
    nuxt.options.nitro.externals.inline.push(templateMC.dst)
    nuxt.options.alias['#multi-cache-server-options'] = templateMC.dst

    const resolvedPath = resolver.resolve('./runtime/app/graphqlMiddleware.serverOptions')
    const template = addTemplate({
        filename: 'graphqlMiddleware.serverOptions',
        write: true,
        getContents: () => `export { default } from '${resolvedPath}'`
    })
    nuxt.options.nitro.externals.inline.push(template.dst)
    nuxt.options.alias['#graphql-middleware-server-options-build'] = template.dst
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
