import { defineNuxtModule, addComponentsDir, addImportsDir, addPlugin, addRouteMiddleware, addServerHandler, createResolver, installModule, addTemplate, useLogger } from '@nuxt/kit'
import { existsSync } from 'node:fs'
import defu from 'defu'
import fs from 'fs'
import type { ModuleOptions } from './types';
require('dotenv').config({ path: __dirname+'/.env' });

export type { ModuleOptions } from './types'

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'wpnuxt-module',
    configKey: 'wpNuxt'
  },
  // Default configuration options of the Nuxt module
  defaults: {
    wordpressUrl: 'https://wordpress.wpnuxt.com',
    stagingUrl: 'https://staging.wpnuxt.com',
    frontendUrl: 'https://demo.wpnuxt.com',
    faustSecretKey: '',
    defaultMenuName: 'main',
    showBlockInfo: false,
    debug: false,
    replaceSchema: false,
    enableMultiCache: true
  },
  async setup (options, nuxt) {
    nuxt.options.runtimeConfig.public.wpNuxt = defu(nuxt.options.runtimeConfig.public.wpNuxt, {
      wordpressUrl: process.env.WPNUXT_WORDPRESS_URL ? process.env.WPNUXT_WORDPRESS_URL : options.wordpressUrl!,
      stagingUrl: process.env.WPNUXT_STAGING_URL ? process.env.WPNUXT_STAGING_URL : options.stagingUrl!,
      frontendUrl: process.env.WPNUXT_FRONTEND_URL ? process.env.WPNUXT_FRONTEND_URL : options.frontendUrl!,
      defaultMenuName: process.env.WPNUXT_DEFAULT_MENU_NAME ? process.env.WPNUXT_DEFAULT_MENU_NAME : options.defaultMenuName!,
      showBlockInfo: process.env.WPNUXT_SHOW_BLOCK_INFO ? process.env.WPNUXT_SHOW_BLOCK_INFO === 'true' : options.showBlockInfo!,
      debug: process.env.WPNUXT_DEBUG ? process.env.WPNUXT_DEBUG === 'true' : options.debug!,
      replaceSchema: process.env.WPNUXT_REPLACE_SCHEMA ? process.env.WPNUXT_REPLACE_SCHEMA === 'true' : options.replaceSchema!,
      enableMultiCache: process.env.WPNUXT_ENABLE_MULTI_CACHE ? process.env.WPNUXT_ENABLE_MULTI_CACHE === 'true' : options.enableMultiCache!
    })
    // we're not putting the secret in public config, so it goes into runtimeConfig
    nuxt.options.runtimeConfig.wpNuxt = defu(nuxt.options.runtimeConfig.wpNuxt, {
      faustSecretKey: process.env.WPNUXT_FAUST_SECRET_KEY ? process.env.WPNUXT_FAUST_SECRET_KEY : options.faustSecretKey!
    })
    const publicWPNuxtConfig = nuxt.options.runtimeConfig.public.wpNuxt
    const logger = useLogger('WPNuxt', {
      level: publicWPNuxtConfig.debug ? 4 : 3,
      formatOptions: {
           // columns: 80,
           colors: true,
           compact: true,
           date: true,
      },
    })
    logger.start('WPNuxt ::: Starting setup ::: ')
    logger.info('Connecting GraphQL to', publicWPNuxtConfig.wordpressUrl)
    logger.info('stagingUrl:', publicWPNuxtConfig.stagingUrl)
    logger.info('frontendUrl:', publicWPNuxtConfig.frontendUrl)
    if (publicWPNuxtConfig.enableMultiCache) logger.info('MultiCache enabled')
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
    if (publicWPNuxtConfig.enableMultiCache) {
      await installModule('nuxt-multi-cache', {
        debug: publicWPNuxtConfig.debug,
        route: {
          enabled: false
        },
        component: {
          enabled: false
        },
        api: {
          enabled: true,
          prefix: '/__nuxt_multi_cache',
          authorization: 'wpnuxt-cache',
          cacheTagInvalidationDelay: 60000
        }
      })
    }

    const queryOutputPath = resolver.resolve((nuxt.options.srcDir || nuxt.options.rootDir) + '/queries/')

    const userQueryPath = '~/extend/queries/'
      .replace(/^(~~|@@)/, nuxt.options.rootDir)
      .replace(/^(~|@)/, nuxt.options.srcDir)
    const userQueryPathExists = existsSync(userQueryPath)

    fs.cpSync(resolver.resolve('./runtime/queries/'), queryOutputPath, {recursive: true})
    if (userQueryPathExists) {
      logger.debug('Extending queries:', userQueryPath)
      fs.cpSync(resolver.resolve(userQueryPath), queryOutputPath, {recursive: true})
    }
    logger.debug('Copied merged queries in folder:', queryOutputPath)

    await installModule('nuxt-graphql-middleware', {
      debug: publicWPNuxtConfig.debug,
      graphqlEndpoint: `${publicWPNuxtConfig.wordpressUrl}/graphql`,
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
        documents: [
          resolver.resolve('!./graphql/**/*')
        ],
        generates: {
          './graphql/': {
            preset: 'client',
            plugins: ['typescript-operations'],
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
      autoImportPatterns: queryOutputPath
    })
    nuxt.options.nitro.externals = nuxt.options.nitro.externals || {}
    nuxt.options.nitro.externals.inline = nuxt.options.nitro.externals.inline || []
    if (publicWPNuxtConfig.enableMultiCache) {
      const resolvedMCPath = resolver.resolve('./runtime/app/multiCache.serverOptions')
      const templateMC = addTemplate({
          filename: 'multiCache.serverOptions',
          write: true,
          getContents: () => `export { default } from '${resolvedMCPath}'`
      })
      nuxt.options.nitro.externals.inline.push(templateMC.dst)
      nuxt.options.alias['#multi-cache-server-options'] = templateMC.dst
    }

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
      stagingUrl: string
      frontendUrl: string
      defaultMenuName?: string
      showBlockInfo?: boolean
      debug?: boolean
      replaceSchema?: boolean
      enableMultiCache?: boolean
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
          stagingUrl: string
          frontendUrl: string
          defaultMenuName?: string
          showBlockInfo?: boolean
          debug?: boolean
          replaceSchema?: boolean
          enableMultiCache?: boolean
        }
      }
    }
  }
}
