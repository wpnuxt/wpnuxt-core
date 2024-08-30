/* eslint-disable @typescript-eslint/no-explicit-any */
import { existsSync, cpSync, promises as fsp } from 'node:fs'
import { type LogLevel, createConsola } from 'consola'
import { ref } from 'vue'
import { hasNuxtModule, addTemplate, createResolver } from '@nuxt/kit'
import { join } from 'pathe'
import type { WPNuxtConfig } from './types'

const loggerRef = ref()

export const initLogger = (logLevel: LogLevel | undefined) => {
  loggerRef.value = createConsola({
    level: logLevel ? logLevel : 3,
    formatOptions: {
      colors: true,
      compact: true,
      date: true,
      fancy: true
    }
  }).withTag('wpnuxt')
  return loggerRef.value
}

export const getLogger = () => {
  if (loggerRef.value) {
    return loggerRef.value
  }
}

/**
 * Validate the module options.
 */
export function validateConfig(options: Partial<WPNuxtConfig>) {
  if (!options.wordpressUrl || options.wordpressUrl.length === 0) {
    throw new Error('WPNuxt error: WordPress url is missing')
  } else if (options.wordpressUrl.substring(options.wordpressUrl.length - 1) === '/') {
    throw new Error('WPNuxt error: WordPress url should not have a trailing slash: ' + options.wordpressUrl)
  }
  if (options.frontendUrl && options.frontendUrl.substring(options.frontendUrl.length - 1) === '/') {
    throw new Error('WPNuxt error: frontend url should not have a trailing slash: ' + options.frontendUrl)
  }
}

export async function mergeQueries(nuxt: any) {
  const { resolve } = createResolver(import.meta.url)
  const resolveRuntimeModule = (path: string) => resolve('./runtime', path)
  const logger = getLogger()

  const queryOutputPath = resolve((nuxt.options.srcDir || nuxt.options.rootDir) + '/.queries/')
  await fsp.rm(queryOutputPath, { recursive: true, force: true })

  const userQueryPath = '~/extend/queries/'
    .replace(/^(~~|@@)/, nuxt.options.rootDir)
    .replace(/^(~|@)/, nuxt.options.srcDir)
  const userQueryPathExists = existsSync(userQueryPath)
  cpSync(resolveRuntimeModule('./queries/'), queryOutputPath, { recursive: true })

  addQueriesFromAddOnModule('@wpnuxt/blocks', queryOutputPath, nuxt, resolve)
  addQueriesFromAddOnModule('@wpnuxt/auth', queryOutputPath, nuxt, resolve)

  if (userQueryPathExists) {
    logger.debug('Extending queries:', userQueryPath)
    cpSync(resolve(userQueryPath), queryOutputPath, { recursive: true })
  }
  logger.debug('Copied merged queries in folder:', queryOutputPath)
  return queryOutputPath
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
function addQueriesFromAddOnModule(addOnModuleName: string, queryOutputPath: string, nuxt: any, resolve: Function) {
  const logger = getLogger()
  if (hasNuxtModule(addOnModuleName)) {
    for (const m of nuxt.options._installedModules) {
      if (m.meta.name === addOnModuleName && m.entryPath) {
        logger.debug('Loading queries from ' + addOnModuleName)
        let blocksQueriesPath
        if (m.entryPath == '../src/module') {
          blocksQueriesPath = join(nuxt.options.rootDir, '../src/runtime/queries/')
        } else if (m.entryPath.startsWith('../')) {
          blocksQueriesPath = join(nuxt.options.rootDir, '../', m.entryPath, './runtime/queries/')
        } else {
          blocksQueriesPath = join('./node_modules', m.entryPath, 'dist/runtime/queries/')
        }
        cpSync(blocksQueriesPath, queryOutputPath, { recursive: true })
      }
    }
  } else {
    const moduleName = addOnModuleName.replace('@', '')
    // TODO: (should we?) find a way to avoid this hack. (it makes sure the dynamic import in WPContent doesn't throw an error)
    addTemplate({
      write: true,
      filename: moduleName + '.mjs',
      getContents: () => `export { }`
    })
    nuxt.options.alias['#' + moduleName] = resolve(nuxt.options.buildDir, moduleName)
  }
}
