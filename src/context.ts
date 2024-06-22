import { promises as fsp } from 'node:fs'
import { upperFirst } from 'scule'
import type { Import } from 'unimport'
import type { WPNuxtConfigComposables, WPNuxtQuery } from './types'
import { getLogger } from './utils'
import { parseDoc } from './useParser'

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
      const node1 = q.nodes && q.nodes.length > 0 ? '\'' + q.nodes[0] + '\'' : null
      const node2 = q.nodes && q.nodes.length > 1 ? '\'' + q.nodes[1] + '\'' : null
      const node3 = q.nodes && q.nodes.length > 2 ? '\'' + q.nodes[2] + '\'' : null
      return `export const ${functionName} = (params) => getContentNodes('${q.name}', ${node1}, ${node2}, ${node3}, params)`
    }
    let fragmentSuffix = ''
    if (q.fragments && q.fragments.length > 0 && q.nodes && q.nodes.length > 0 && q.nodes.includes('nodes')) {
      fragmentSuffix = '[]'
    }
    const fragments = q.fragments && q.fragments.length > 0
      ? q.fragments.map(f => `${f}Fragment${fragmentSuffix}`).join(' | ')
      : 'any'
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
