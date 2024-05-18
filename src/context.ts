import { promises as fsp } from 'node:fs'
import { upperFirst } from 'scule'
import type { Import } from 'unimport'
import type { WPNuxtConfigComposables, WPNuxtQuery } from './types'
import { getLogger } from './utils'
import { parseDoc } from './runtime/composables/useParser'

export interface WPNuxtContext {
  composables: WPNuxtConfigComposables
  template?: string
  fns: WPNuxtQuery[]
  fnImports?: Import[]
  generateImports?: () => string
  generateDeclarations?: () => string
  docs?: string[]
}

export async function prepareContext(ctx: WPNuxtContext) {
  const logger = getLogger()
  if (ctx.docs) {
    await prepareFunctions(ctx)
  }

  const fnName = (fn: string) => ctx.composables.prefix + upperFirst(fn)

  const fnExp = (q: WPNuxtQuery, typed = false) => {
    const functionName = fnName(q.name)
    if (!typed) {
      return `export const ${functionName} = (params) => fetchContent('${q.name}', params)`
    }
    return `  export const ${functionName}: (params?: ${q.name}QueryVariables) => AsyncData<${q.name}Query | undefined, FetchError | null | undefined>`
  }

  ctx.generateImports = () => [
    'import { useGraphqlQuery } from \'#graphql-composable\'',
    ...ctx.fns.map(f => fnExp(f))
  ].join('\n')

  ctx.generateDeclarations = () => [
    `import type { ${ctx.fns.map(o => getQueryTypeTemplate(o)).join(', ')} } from '#graphql-operations'`,
    'import { AsyncData } from \'nuxt/app\'',
    'import { FetchError } from \'ofetch\'',
    'declare module \'#wpnuxt\' {',
    ...([
      ...ctx.fns!.map(f => fnExp(f, true))
    ]),
    '}'
  ].join('\n')

  ctx.fnImports = ctx.fns.map((fn): Import => ({ from: '#wpnuxt', name: fnName(fn.name) }))

  logger.debug('generated WPNuxt composables: ')
  ctx.fns.forEach(f => logger.debug(` ${fnName(f.name)}()`))
}

function getQueryTypeTemplate(q: WPNuxtQuery) {
  return `${q.name}Query, ${q.name}QueryVariables`
}

async function prepareFunctions(ctx: WPNuxtContext) {
  if (!ctx.docs) {
    getLogger().error('no GraphQL query documents were found!')
    return
  }
  for await (const doc of ctx.docs) {
    const operations = await parseDoc(await fsp.readFile(doc, 'utf8'))
    operations.forEach((query) => {
      ctx.fns.push(query)
    })
  }
}
