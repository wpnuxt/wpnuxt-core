import { promises as fsp } from 'node:fs'
import { upperFirst } from 'scule'
import type { Import } from 'unimport'
import type { WPNuxtQuery } from './types'
import { getLogger } from './utils'
import { parseDoc } from './useParser'

export interface WPNuxtContext {
  composablesPrefix: string
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

  const fnName = (fn: string) => ctx.composablesPrefix + upperFirst(fn)
  const fnExp = (q: WPNuxtQuery, typed = false) => {
    const functionName = fnName(q.name)
    if (!typed) {
      return `export const ${functionName} = (params) => useWPContent('${q.name}', [${q.nodes?.map(n => `'${n}'`).join(',')}], false, params)`
    }
    const fragmentSuffix = q.fragments?.length && q.nodes?.includes('nodes') ? '[]' : ''
    const fragments = q.fragments?.length ? q.fragments.map(f => `${f}Fragment${fragmentSuffix}`).join(' | ') : 'any'
    return `  export const ${functionName}: (params?: ${q.name}QueryVariables) => AsyncData<${fragments}, FetchError | null | undefined>`
  }

  ctx.generateImports = () => [
    ...ctx.fns.map(f => fnExp(f))
  ].join('\n')

  const types: string[] = []
  ctx.fns.forEach(o => types.push(...getQueryTypeTemplate(o)))
  ctx.generateDeclarations = () => [
    `import type { ${[...new Set(types)].join(', ')} } from '#build/graphql-operations'`,
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

function getQueryTypeTemplate(q: WPNuxtQuery): string[] {
  const types: string[] = []
  types.push(`${q.name}QueryVariables`)
  if (q.fragments && q.fragments.length > 0) {
    q.fragments.forEach(f => types.push(`${f}Fragment`))
  }
  return types
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
