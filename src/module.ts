import fs, { existsSync } from 'node:fs'
import { defineNuxtModule, hasNuxtModule, addComponent, addServerHandler, createResolver, installModule, addTemplate, addImports, type Resolver, addPlugin } from '@nuxt/kit'
import defu from 'defu'
import { join } from 'pathe'
import consola from 'consola'
import { name, version } from '../package.json'
import type { WPNuxtConfig, WPNuxtConfigComposables } from './types'
import { initLogger, validateConfig } from './utils'
import { generateWPNuxtComposables } from './generate'
import type { WPNuxtContext } from './context'

const defaultComposablesConfig: WPNuxtConfigComposables = {
  enabled: true,
  prefix: 'useWP'
}
const defaultConfigs: WPNuxtConfig = {
  wordpressUrl: '',
  frontendUrl: '',
  faustSecretKey: '',
  defaultMenuName: 'main',
  blocks: true,
  replaceSchema: false,
  enableCache: true,
  staging: false,
  logLevel: 3,
  generateComposables: defaultComposablesConfig
}

export default defineNuxtModule<WPNuxtConfig>({
  meta: {
    name,
    version,
    configKey: 'wpNuxt',
    nuxt: '>=3.1.0'
  },
  // Default configuration options of the Nuxt module
  defaults: defaultConfigs,
  async setup(options, nuxt) {
    const startTime = new Date().getTime()
    consola.log('::: Starting WPNuxt setup ::: ')

    const publicWPNuxtConfig: WPNuxtConfig = {
      wordpressUrl: process.env.WPNUXT_WORDPRESS_URL || options.wordpressUrl!,
      frontendUrl: process.env.WPNUXT_FRONTEND_URL || options.frontendUrl!,
      defaultMenuName: process.env.WPNUXT_DEFAULT_MENU_NAME || options.defaultMenuName!,
      blocks: process.env.WPNUXT_BLOCKS ? process.env.WPNUXT_BLOCKS === 'true' : options.blocks!,
      replaceSchema: process.env.WPNUXT_REPLACE_SCHEMA === 'true' || options.replaceSchema!,
      enableCache: process.env.WPNUXT_ENABLE_CACHE ? process.env.WPNUXT_ENABLE_CACHE === 'true' : options.enableCache!,
      staging: process.env.WPNUXT_STAGING === 'true' || options.staging!,
      downloadSchema: process.env.WPNUXT_DOWNLOAD_SCHEMA === 'true' || options.downloadSchema,
      // TODO also allow below options as env vars?
      logLevel: process.env.WPNUXT_LOG_LEVEL ? Number.parseInt(process.env.WPNUXT_LOG_LEVEL) : options.logLevel,
      generateComposables: options.generateComposables
    }
    // we're not putting the secret in public config, so it goes into runtimeConfig
    nuxt.options.runtimeConfig.wpNuxt = defu(nuxt.options.runtimeConfig.wpNuxt, {
      faustSecretKey: process.env.WPNUXT_FAUST_SECRET_KEY ? process.env.WPNUXT_FAUST_SECRET_KEY : options.faustSecretKey!
    })
    nuxt.options.runtimeConfig.public.wpNuxt = publicWPNuxtConfig
    validateConfig(publicWPNuxtConfig)
    const logger = initLogger(publicWPNuxtConfig.logLevel)

    logger.info('Connecting GraphQL to', publicWPNuxtConfig.wordpressUrl)
    logger.info('frontendUrl:', publicWPNuxtConfig.frontendUrl)
    if (publicWPNuxtConfig.enableCache) logger.info('Cache enabled')
    logger.debug('Debug mode enabled, log level:', publicWPNuxtConfig.logLevel)
    if (publicWPNuxtConfig.staging) logger.info('Staging enabled')
    // TODO: should blocks option remain?
    if (publicWPNuxtConfig.blocks) logger.info('Blocks enabled')

    const { resolve } = createResolver(import.meta.url)
    const resolveRuntimeModule = (path: string) => resolve('./runtime', path)
    const srcResolver: Resolver = createResolver(nuxt.options.srcDir)

    nuxt.options.alias['#wpnuxt'] = resolve(nuxt.options.buildDir, 'wpnuxt')
    nuxt.options.alias['#wpnuxt/*'] = resolve(nuxt.options.buildDir, 'wpnuxt', '*')
    nuxt.options.alias['#wpnuxt/types'] = resolve('./types')
    nuxt.options.nitro.alias = nuxt.options.nitro.alias || {}
    nuxt.options.nitro.alias['#wpnuxt/types'] = resolve('./types')

    nuxt.options.nitro.externals = nuxt.options.nitro.externals || {}
    nuxt.options.nitro.externals.inline = nuxt.options.nitro.externals.inline || []

    addPlugin({
      src: resolveRuntimeModule('plugins/vue-sanitize-directive')
    })

    addImports([
      { name: 'isStaging', as: 'isStaging', from: resolveRuntimeModule('./composables/isStaging') },
      { name: 'useWPContent', as: 'useWPContent', from: resolveRuntimeModule('./composables/useWPContent') },
      { name: 'parseDoc', as: 'parseDoc', from: resolveRuntimeModule('./composables/useParser') },
      { name: 'usePrevNextPost', as: 'usePrevNextPost', from: resolveRuntimeModule('./composables/usePrevNextPost') },

      { name: 'loginUser', as: 'loginUser', from: resolveRuntimeModule('./composables/user') },
      { name: 'logoutUser', as: 'logoutUser', from: resolveRuntimeModule('./composables/user') },
      { name: 'getCurrentUserId', as: 'getCurrentUserId', from: resolveRuntimeModule('./composables/user') },
      { name: 'getCurrentUserName', as: 'getCurrentUserName', from: resolveRuntimeModule('./composables/user') },

      { name: 'useTokens', as: 'useTokens', from: resolveRuntimeModule('./composables/useTokens') },
      { name: 'useWPUri', as: 'useWPUri', from: resolveRuntimeModule('./composables/useWPUri') },
      { name: 'useFeaturedImage', as: 'useFeaturedImage', from: resolveRuntimeModule('./composables/useFeaturedImage') }
    ])

    addComponent({ name: 'StagingBanner', filePath: resolveRuntimeModule('./components/StagingBanner') })
    addComponent({ name: 'WPNuxtLogo', filePath: resolveRuntimeModule('./components/WPNuxtLogo') })
    addComponent({ name: 'WordPressLogo', filePath: resolveRuntimeModule('./components/WordPressLogo') })

    addServerHandler({
      route: '/api/wpContent',
      handler: resolveRuntimeModule('./server/api/wpContent.post')
    })
    addServerHandler({
      route: '/api/purgeCache',
      handler: resolveRuntimeModule('./server/api/purgeCache.get')
    })

    await installModule('@vueuse/nuxt', {})

    const queryOutputPath = resolve((nuxt.options.srcDir || nuxt.options.rootDir) + '/.queries/')

    const userQueryPath = '~/extend/queries/'
      .replace(/^(~~|@@)/, nuxt.options.rootDir)
      .replace(/^(~|@)/, nuxt.options.srcDir)
    const userQueryPathExists = existsSync(userQueryPath)

    fs.cpSync(resolveRuntimeModule('./queries/'), queryOutputPath, { recursive: true })
    if (hasNuxtModule('@wpnuxt/blocks')) {
      logger.debug('nuxt.options._installedModules', nuxt.options._installedModules)

      for (const m of nuxt.options._installedModules) {
        if (m.meta.name === '@wpnuxt/blocks' && m.entryPath) {
          // const blocksQueriesPath = join(m.entryPath, 'runtime/queries/')
          logger.debug('blocks queries path', m.entryPath + '/runtime/queries')
          // fs.cpSync(m.entryPath + '/runtime/queries', queryOutputPath, { recursive: true })
        }
      }
    } else {
      logger.debug('!!! If you want to render Gutenberg blocks with separate vue components, please install the @wpnuxt/blocks module')
    }
    if (userQueryPathExists) {
      logger.debug('Extending queries:', userQueryPath)
      fs.cpSync(resolve(userQueryPath), queryOutputPath, { recursive: true })
    }
    logger.debug('Copied merged queries in folder:', queryOutputPath)

    await installModule('nuxt-graphql-middleware', {
      debug: publicWPNuxtConfig.logLevel ? publicWPNuxtConfig.logLevel > 3 : false,
      graphqlEndpoint: `${publicWPNuxtConfig.wordpressUrl}/graphql`,
      downloadSchema: publicWPNuxtConfig.downloadSchema,
      codegenConfig: {
        silent: false,
        skipTypename: true,
        useTypeImports: true,
        // inlineFragmentTypes: 'combine',
        dedupeFragments: true,
        onlyOperationTypes: true,
        avoidOptionals: false,
        disableOnBuild: false,
        gqlImport: 'graphql-request#wpnuxt',
        namingConvention: {
          enumValues: 'change-case-all#upperCaseFirst'
        },

        documents: [
          resolve('!./graphql/**/*')
        ]
      },
      codegenSchemaConfig: {
        urlSchemaOptions: {
          headers: {
            Authorization: 'server-token'
          }
        }
      },
      outputDocuments: true,
      autoImportPatterns: queryOutputPath,
      includeComposables: true,
      devtools: true
    })

    const resolvedPath = resolveRuntimeModule('./app/graphqlMiddleware.serverOptions')
    const template = addTemplate({
      filename: 'graphqlMiddleware.serverOptions.ts',
      write: true,
      getContents: () => `
      import type { GraphqlMiddlewareServerOptions } from '#graphql-middleware/types'
      import serverOptions from '${resolvedPath}'
      import type { GraphqlServerResponse } from '#graphql-middleware/types'
      import type { GraphqlMiddlewareResponseUnion } from '#build/nuxt-graphql-middleware'

      type GraphqlResponseAdditions =
        typeof serverOptions extends GraphqlMiddlewareServerOptions<infer R> ? R : {}

      export type GraphqlResponse<T> = GraphqlServerResponse<T> & GraphqlResponseAdditions

      export type GraphqlResponseTyped = GraphqlResponse<GraphqlMiddlewareResponseUnion>

      export { serverOptions }
      `
    })
    nuxt.options.nitro.externals.inline.push(template.dst)
    nuxt.options.alias['#graphql-middleware-server-options-build'] = template.dst

    if (publicWPNuxtConfig.generateComposables && publicWPNuxtConfig.generateComposables.enabled) {
      logger.trace('Generating composables')

      const composablesConfig = typeof publicWPNuxtConfig.generateComposables === 'object'
        ? publicWPNuxtConfig.generateComposables
        : defaultComposablesConfig

      const ctx: WPNuxtContext = await {
        fns: [],
        fnImports: [],
        composables: composablesConfig
      }
      await generateWPNuxtComposables(ctx, queryOutputPath, srcResolver)

      addTemplate({
        write: true,
        filename: 'wpnuxt.mjs',
        getContents: () => ctx.generateImports?.() || ''
      })
      addTemplate({
        write: true,
        filename: 'wpnuxt/index.d.ts',
        getContents: () => ctx.generateDeclarations?.() || ''
      })
      nuxt.hook('imports:extend', (autoimports) => {
        autoimports.push(...(ctx.fnImports || []))
      })
    }

    nuxt.hook('nitro:init', async (nitro) => {
      // Remove content cache when nitro starts (after a pull or a change)
      const keys = await nitro.storage.getKeys('cache:content')
      keys.forEach(async (key) => {
        if (key.startsWith('cache:content')) await nitro.storage.removeItem(key)
      })
    })

    const endTime = new Date().getTime()
    logger.success('::: Finished WPNuxt setup in ' + (endTime - startTime) + 'ms ::: ')
  }
})

declare module '@nuxt/schema' {

  interface RuntimeConfig {
    wpNuxt: {
      faustSecretKey: string
    }
  }

  interface PublicRuntimeConfig {
    wpNuxt: WPNuxtConfig
  }

  interface ConfigSchema {
    wpNuxt: {
      faustSecretKey: string
    }
    runtimeConfig: {
      public?: {
        wpNuxt: WPNuxtConfig
      }
    }
  }
}
