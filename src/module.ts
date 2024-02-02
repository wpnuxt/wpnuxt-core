import { defineNuxtModule, addComponentsDir, addImportsDir, addPlugin, addRouteMiddleware, addServerHandler, createResolver, installModule, addTemplate, useLogger } from '@nuxt/kit'
import { existsSync } from 'node:fs'
import defu from 'defu'
import fs from 'fs'
require('dotenv').config({ path: __dirname+'/.env' });

// Module options TypeScript interface definition
export interface ModuleOptions {
  wordpressUrl: string
  frontendUrl: string
  faustSecretKey?: string
  defaultMenuName?: string
  showBlockInfo?: boolean
  debug?: boolean
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'wpnuxt-module',
    configKey: 'wpNuxt'
  },
  // Default configuration options of the Nuxt module
  defaults: {
    wordpressUrl: 'https://wordpress.wpnuxt.com',
    frontendUrl: 'https://demo.wpnuxt.com',
    faustSecretKey: '',
    defaultMenuName: 'main',
    showBlockInfo: false,
    debug: false
  },
  async setup (options, nuxt) {
    nuxt.options.runtimeConfig.public.wpNuxt = defu(nuxt.options.runtimeConfig.public.wpNuxt, {
      wordpressUrl: process.env.WPNUXT_WORDPRESS_URL ? process.env.WPNUXT_WORDPRESS_URL : options.wordpressUrl!,
      frontendUrl: process.env.WPNUXT_FRONTEND_URL ? process.env.WPNUXT_FRONTEND_URL : options.frontendUrl!,
      defaultMenuName: process.env.WPNUXT_DEFAULT_MENU_NAME ? process.env.WPNUXT_DEFAULT_MENU_NAME : options.defaultMenuName!,
      showBlockInfo: process.env.WPNUXT_SHOW_BLOCK_INFO ? process.env.WPNUXT_SHOW_BLOCK_INFO === 'true' : options.showBlockInfo!,
      debug: process.env.WPNUXT_DEBUG ? process.env.WPNUXT_DEBUG === 'true' : options.debug!
    })
    // we're not putting the secret in public config, so it goes into runtimeConfig
    nuxt.options.runtimeConfig.wpNuxt = defu(nuxt.options.runtimeConfig.wpNuxt, {
      faustSecretKey: process.env.WPNUXT_FAUST_SECRET_KEY ? process.env.WPNUXT_FAUST_SECRET_KEY : options.faustSecretKey!
    })
    const logger = useLogger('WPNuxt', {
      level: nuxt.options.runtimeConfig.public.wpNuxt.debug ? 4 : 3,
      formatOptions: {
           // columns: 80,
           colors: true,
           compact: true,
           date: true,
      },
    })
    logger.start('WPNuxt ::: Starting setup ::: ')
    logger.info('Connecting GraphQL to', nuxt.options.runtimeConfig.public.wpNuxt.wordpressUrl)
    logger.info('Configured frontendUrl:', nuxt.options.runtimeConfig.public.wpNuxt.frontendUrl)
    logger.debug('Debug mode enabled')

    const resolver = createResolver(import.meta.url)

    // TODO: test if wordpressUrl is provided!
    // TODO: use showBlockInfo (once the core components are migrated)

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
      debug: nuxt.options.runtimeConfig.public.wpNuxt.debug,
      route: {
        enabled: true
      },
      component: {
        enabled: true
      },
      api: {
        enabled: true,
        prefix: '/__nuxt_multi_cache',
        authorization: 'wpnuxt-cache',
        cacheTagInvalidationDelay: 60000
      }
    })

    const userQueryPath = '~/queries/'
      .replace(/^(~~|@@)/, nuxt.options.rootDir)
      .replace(/^(~|@)/, nuxt.options.srcDir)
    const userQueryPathExists = existsSync(userQueryPath)
    const queryPaths = userQueryPathExists
      ? [ resolver.resolve(userQueryPath + '**/*.gql'), resolver.resolve('./runtime/queries/**/*.gql')]
      : [ resolver.resolve('./runtime/queries/**/*.gql')]
    logger.debug('Loading query paths:', queryPaths)

    await installModule('nuxt-graphql-middleware', {
      debug: nuxt.options.runtimeConfig.public.wpNuxt.debug,
      graphqlEndpoint: `${nuxt.options.runtimeConfig.public.wpNuxt.wordpressUrl}/graphql`,
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
      autoImportPatterns: queryPaths
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

    logger.success("WPNuxt ::: Finished setup ::: ");
  },
})

declare module '@nuxt/schema' {

  interface RuntimeConfig {
    wpNuxt: {
      faustSecretKey: string
    }
  }

  interface PublicRuntimeConfig {
    wpNuxt: {
      wordpressUrl: string
      frontendUrl: string
      defaultMenuName?: string
      showBlockInfo?: boolean
      debug?: boolean
    }
  }

  interface ConfigSchema {
    wpNuxt: {
      faustSecretKey: string
    }
    runtimeConfig: {
      public?: {
        wpNuxt: {
          wordpressUrl: string
          frontendUrl: string
          defaultMenuName?: string
          showBlockInfo?: boolean
          debug?: boolean
        }
      }
    }
  }
}
