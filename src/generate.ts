import { statSync } from 'node:fs'
import { type Resolver, resolveFiles } from '@nuxt/kit'
import { prepareContext, type WPNuxtContext } from './context'

const allowDocument = (f: string, resolver: Resolver) => {
  const isSchema = f.match(/([^/]+)\.(gql|graphql)$/)?.[0]?.toLowerCase().includes('schema')
  return !isSchema && !!statSync(resolver.resolve(f)).size
}
export async function generateWPNuxtComposables(ctx: WPNuxtContext, queryOutputPath: string, resolver: Resolver) {
  const gqlMatch = '**/*.{gql,graphql}'
  const documents: string[] = []
  const files = (await resolveFiles(queryOutputPath, [gqlMatch, '!**/schemas'], { followSymbolicLinks: false })).filter(doc => allowDocument(doc, resolver))
  documents.push(...files)
  ctx.docs = documents

  await prepareContext(ctx)
}
