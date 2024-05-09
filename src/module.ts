import fs, { existsSync } from 'node:fs'
import { defineNuxtModule, addComponentsDir, addRouteMiddleware, addServerHandler, createResolver, installModule, addTemplate, useLogger, addImports } from '@nuxt/kit'
import defu from 'defu'
import type { ModuleOptions } from './runtime/types'

export type { ModuleOptions } from './runtime/types'

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'wpnuxt-module',
    configKey: 'wpNuxt',
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
    trace: false,
    replaceSchema: false,
    enableCache: true,
    staging: false,
  },
  async setup(options, nuxt) {
    nuxt.options.runtimeConfig.public.wpNuxt = defu(nuxt.options.runtimeConfig.public.wpNuxt, {
      wordpressUrl: process.env.WPNUXT_WORDPRESS_URL ? process.env.WPNUXT_WORDPRESS_URL : options.wordpressUrl!,
      stagingUrl: process.env.WPNUXT_STAGING_URL ? process.env.WPNUXT_STAGING_URL : options.stagingUrl!,
      frontendUrl: process.env.WPNUXT_FRONTEND_URL ? process.env.WPNUXT_FRONTEND_URL : options.frontendUrl!,
      defaultMenuName: process.env.WPNUXT_DEFAULT_MENU_NAME ? process.env.WPNUXT_DEFAULT_MENU_NAME : options.defaultMenuName!,
      showBlockInfo: process.env.WPNUXT_SHOW_BLOCK_INFO ? process.env.WPNUXT_SHOW_BLOCK_INFO === 'true' : options.showBlockInfo!,
      debug: process.env.WPNUXT_DEBUG ? process.env.WPNUXT_DEBUG === 'true' : options.debug!,
      trace: process.env.WPNUXT_TRACE ? process.env.WPNUXT_TRACE === 'true' : options.trace!,
      replaceSchema: process.env.WPNUXT_REPLACE_SCHEMA ? process.env.WPNUXT_REPLACE_SCHEMA === 'true' : options.replaceSchema!,
      enableCache: process.env.WPNUXT_ENABLE_CACHE ? process.env.WPNUXT_ENABLE_CACHE === 'true' : options.enableCache!,
      staging: process.env.WPNUXT_STAGING ? process.env.WPNUXT_STAGING === 'true' : options.staging!,
    })
    // we're not putting the secret in public config, so it goes into runtimeConfig
    nuxt.options.runtimeConfig.wpNuxt = defu(nuxt.options.runtimeConfig.wpNuxt, {
      faustSecretKey: process.env.WPNUXT_FAUST_SECRET_KEY ? process.env.WPNUXT_FAUST_SECRET_KEY : options.faustSecretKey!,
    })
    const publicWPNuxtConfig = nuxt.options.runtimeConfig.public.wpNuxt
    const logger = useLogger('WPNuxt', {
      level: publicWPNuxtConfig.trace ? 5 : publicWPNuxtConfig.debug ? 4 : 3,
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
    if (publicWPNuxtConfig.enableCache) logger.info('Cache enabled')
    logger.debug('Debug mode enabled')
    if (publicWPNuxtConfig.staging) logger.info('Staging enabled')

    const { resolve } = createResolver(import.meta.url)
    const resolveRuntimeModule = (path: string) => resolve('./runtime', path)

    // TODO: test if wordpressUrl is provided!

    nuxt.options.alias['#wpnuxt/types'] = resolveRuntimeModule('./types')
    nuxt.options.nitro.alias = nuxt.options.nitro.alias || {}
    nuxt.options.nitro.alias['#wpnuxt/types'] = resolveRuntimeModule('./types')
    nuxt.options.alias['#wpnuxt/composables'] = resolveRuntimeModule('./composables/index')
    nuxt.hook('nitro:config', (nitroConfig) => {
      nitroConfig.alias = nitroConfig.alias || {}
      nitroConfig.alias['#wpnuxt/server'] = resolveRuntimeModule('./server')
    })

    addImports([
      { name: 'isStaging', as: 'isStaging', from: resolveRuntimeModule('./composables/isStaging') },
      { name: 'useGeneralSettings', as: 'useGeneralSettings', from: resolveRuntimeModule('./composables/useGeneralSettings') },
      { name: 'useMenu', as: 'useMenu', from: resolveRuntimeModule('./composables/useMenu') },
      { name: 'useNodeByUri', as: 'useNodeByUri', from: resolveRuntimeModule('./composables/useNode') },

      { name: 'usePages', as: 'usePages', from: resolveRuntimeModule('./composables/usePages') },
      { name: 'usePageByUri', as: 'usePageByUri', from: resolveRuntimeModule('./composables/usePages') },
      { name: 'usePageById', as: 'usePageById', from: resolveRuntimeModule('./composables/usePages') },

      { name: 'useLatestPost', as: 'useLatestPost', from: resolveRuntimeModule('./composables/usePosts') },
      { name: 'usePosts', as: 'usePosts', from: resolveRuntimeModule('./composables/usePosts') },
      { name: 'usePostById', as: 'usePostById', from: resolveRuntimeModule('./composables/usePosts') },
      { name: 'usePostByUri', as: 'usePostByUri', from: resolveRuntimeModule('./composables/usePosts') },

      { name: 'getContentNodes', as: 'getContentNodes', from: resolveRuntimeModule('./composables/useWPContent') },
      { name: 'getContentNode', as: 'getContentNode', from: resolveRuntimeModule('./composables/useWPContent') },

      { name: 'loginUser', as: 'loginUser', from: resolveRuntimeModule('./composables/user') },
      { name: 'logoutUser', as: 'logoutUser', from: resolveRuntimeModule('./composables/user') },
      { name: 'getCurrentUserId', as: 'getCurrentUserId', from: resolveRuntimeModule('./composables/user') },
      { name: 'getCurrentUserName', as: 'getCurrentUserName', from: resolveRuntimeModule('./composables/user') },

      { name: 'useTokens', as: 'useTokens', from: resolveRuntimeModule('./composables/useTokens') },
      { name: 'useViewer', as: 'useViewer', from: resolveRuntimeModule('./composables/useViewer') },
      { name: 'useWPUri', as: 'useWPUri', from: resolveRuntimeModule('./composables/useWPUri') },
    ])

    addRouteMiddleware({
      name: 'auth',
      path: resolveRuntimeModule('./middleware/auth'),
      global: true,
    })
    addComponentsDir({
      path: resolveRuntimeModule('./components'),
      pathPrefix: false,
      prefix: '',
      global: true,
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
        file: resolve(previewPagePath),
      })
      pages.push({
        name: 'auth',
        path: '/auth',
        file: resolveRuntimeModule('./pages/auth.vue'),
      })
    })

    addServerHandler({
      route: '/api/tokensFromCode',
      handler: resolveRuntimeModule('./server/api/tokensFromCode.post'),
    })
    addServerHandler({
      route: '/api/tokensFromRefreshToken',
      handler: resolveRuntimeModule('./server/api/tokensFromRefreshToken.post'),
    })
    addServerHandler({
      route: '/api/wpContent',
      handler: resolveRuntimeModule('./server/api/wpContent.post'),
    })
    addServerHandler({
      route: '/api/purgeCache',
      handler: resolveRuntimeModule('./server/api/purgeCache.get'),
    })

    // Register user block components
    const _layers = [...nuxt.options._layers].reverse()
    for (const layer of _layers) {
      const srcDir = layer.config.srcDir
      const blockComponents = resolve(srcDir, 'components/blocks')
      const dirStat = await fs.promises.stat(blockComponents).catch(() => null)
      if (dirStat && dirStat.isDirectory()) {
        nuxt.hook('components:dirs', (dirs) => {
          dirs.unshift({
            path: blockComponents,
            global: true,
            pathPrefix: false,
            prefix: '',
          })
        })
      }
    }

    await installModule('@vueuse/nuxt', {})

    const queryOutputPath = resolve((nuxt.options.srcDir || nuxt.options.rootDir) + '/queries/')

    const userQueryPath = '~/extend/queries/'
      .replace(/^(~~|@@)/, nuxt.options.rootDir)
      .replace(/^(~|@)/, nuxt.options.srcDir)
    const userQueryPathExists = existsSync(userQueryPath)

    fs.cpSync(resolveRuntimeModule('./queries/'), queryOutputPath, { recursive: true })
    if (userQueryPathExists) {
      logger.debug('Extending queries:', userQueryPath)
      fs.cpSync(resolve(userQueryPath), queryOutputPath, { recursive: true })
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
        },
        documents: [
          resolve('!./graphql/**/*'),
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
      autoImportPatterns: queryOutputPath,
      devtools: true,
    })
    nuxt.options.nitro.externals = nuxt.options.nitro.externals || {}
    nuxt.options.nitro.externals.inline = nuxt.options.nitro.externals.inline || []

    const resolvedPath = resolveRuntimeModule('./app/graphqlMiddleware.serverOptions')
    const template = addTemplate({
      filename: 'graphqlMiddleware.serverOptions',
      write: true,
      getContents: () => `export { default } from '${resolvedPath}'`,
    })
    nuxt.options.nitro.externals.inline.push(template.dst)
    nuxt.options.alias['#graphql-middleware-server-options-build'] = template.dst

    logger.success('WPNuxt ::: Finished setup ::: ')
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
      trace?: boolean
      replaceSchema?: boolean
      enableCache?: boolean
      staging?: boolean
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
          trace?: boolean
          replaceSchema?: boolean
          enableCache?: boolean
          staging?: boolean
        }
      }
    }
  }
}
