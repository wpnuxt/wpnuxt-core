import { existsSync, cpSync, promises as fsp } from 'node:fs'
import { defineNuxtModule, hasNuxtModule, addComponentsDir, addServerHandler, createResolver, installModule, addTemplate, addTypeTemplate, addImports, type Resolver, addPlugin } from '@nuxt/kit'
import { join } from 'pathe'
import consola from 'consola'
import { name, version } from '../package.json'
import type { WPNuxtConfig } from './types'
import { initLogger, validateConfig } from './utils'
import { generateWPNuxtComposables } from './generate'
import type { WPNuxtContext } from './context'

const defaultConfigs: WPNuxtConfig = {
  wordpressUrl: '',
  frontendUrl: '',
  defaultMenuName: 'main',
  enableCache: true,
  staging: false,
  logLevel: 3,
  composablesPrefix: 'useWP'
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
      enableCache: process.env.WPNUXT_ENABLE_CACHE ? process.env.WPNUXT_ENABLE_CACHE === 'true' : options.enableCache!,
      staging: process.env.WPNUXT_STAGING === 'true' || options.staging!,
      downloadSchema: process.env.WPNUXT_DOWNLOAD_SCHEMA === 'true' || options.downloadSchema,
      logLevel: process.env.WPNUXT_LOG_LEVEL ? Number.parseInt(process.env.WPNUXT_LOG_LEVEL) : options.logLevel,
      composablesPrefix: process.env.WPNUXT_COMPOSABLES_PREFIX || options.composablesPrefix
    }
    nuxt.options.runtimeConfig.public.wpNuxt = publicWPNuxtConfig
    validateConfig(publicWPNuxtConfig)
    const logger = initLogger(publicWPNuxtConfig.logLevel)

    logger.info('Connecting GraphQL to', publicWPNuxtConfig.wordpressUrl)
    logger.info('frontendUrl:', publicWPNuxtConfig.frontendUrl)
    if (publicWPNuxtConfig.enableCache) logger.info('Cache enabled')
    logger.debug('Debug mode enabled, log level:', publicWPNuxtConfig.logLevel)
    if (publicWPNuxtConfig.staging) logger.info('Staging enabled')

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

    addComponentsDir({
      path: resolveRuntimeModule('./components'),
      pathPrefix: false,
      prefix: '',
      global: true
    })
    addServerHandler({
      route: '/api/wpContent',
      handler: resolveRuntimeModule('./server/api/wpContent.post')
    })

    await installModule('@vueuse/nuxt', {})

    const queryOutputPath = resolve((nuxt.options.srcDir || nuxt.options.rootDir) + '/.queries/')
    await fsp.rm(queryOutputPath, { recursive: true, force: true })

    const userQueryPath = '~/extend/queries/'
      .replace(/^(~~|@@)/, nuxt.options.rootDir)
      .replace(/^(~|@)/, nuxt.options.srcDir)
    const userQueryPathExists = existsSync(userQueryPath)
    cpSync(resolveRuntimeModule('./queries/'), queryOutputPath, { recursive: true })

    if (hasNuxtModule('@wpnuxt/blocks')) {
      for (const m of nuxt.options._installedModules) {
        if (m.meta.name === '@wpnuxt/blocks' && m.entryPath) {
          logger.debug('Loading queries from @wpnuxt/blocks')
          let blocksQueriesPath
          if (m.entryPath.startsWith('../')) {
            // local development
            blocksQueriesPath = join(nuxt.options.rootDir, '../', m.entryPath, './runtime/queries/')
          } else {
            blocksQueriesPath = join('./node_modules', m.entryPath, 'dist/runtime/queries/')
          }
          cpSync(blocksQueriesPath, queryOutputPath, { recursive: true })
        }
      }
    } else {
      logger.debug('Tip: Install the @wpnuxt/blocks module if you want to render Gutenberg blocks with separate vue components')
      // TODO: find a way to avoid this hack. (it makes sure the dynamic import in WPContent doesn't throw an error)
      addTemplate({
        write: true,
        filename: 'wpnuxt/blocks.mjs',
        getContents: () => `export { }`
      })
      nuxt.options.alias['#wpnuxt/blocks'] = resolve(nuxt.options.buildDir, 'wpnuxt/blocks')
    }
    if (userQueryPathExists) {
      logger.debug('Extending queries:', userQueryPath)
      cpSync(resolve(userQueryPath), queryOutputPath, { recursive: true })
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
        maybeValue: 'T | undefined',
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

    logger.trace('Start generating composables')

    const ctx: WPNuxtContext = await {
      fns: [],
      fnImports: [],
      composablesPrefix: publicWPNuxtConfig.composablesPrefix
    }
    await generateWPNuxtComposables(ctx, queryOutputPath, srcResolver)

    addTemplate({
      write: true,
      filename: 'wpnuxt/index.mjs',
      getContents: () => ctx.generateImports?.() || ''
    })
    addTypeTemplate({
      write: true,
      filename: 'wpnuxt/index.d.ts',
      getContents: () => ctx.generateDeclarations?.() || ''
    })
    nuxt.hook('imports:extend', (autoimports) => {
      autoimports.push(...(ctx.fnImports || []))
    })

    nuxt.hook('nitro:init', async (nitro) => {
      // Remove content cache when nitro starts
      const keys = await nitro.storage.getKeys('cache:api:wpContent')
      keys.forEach(async (key) => {
        if (key.startsWith('cache:api:wpContent')) await nitro.storage.removeItem(key)
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
