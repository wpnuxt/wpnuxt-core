import { defineEventHandler, readBody } from 'h3'
import { cacheStorage } from '../storage'
import { isStaging } from '../../composables/isStaging'
import { useRuntimeConfig } from '#imports'
import type { GraphqlResponse } from '#graphql-documents'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)
  const staging = await isStaging()

  if (!body || !body.queryName) {
    throw new Error(
      'The request must contain a queryName'
    )
  }
  // TODO find better why to add the params to the cache key, as hash?
  const cacheKey = `wpContent-${body.queryName}-${body.params ? JSON.stringify(body.params).replaceAll('"', '').replaceAll(':', '-') : ''}`

  // Read from cache if not disabled and we're not in staging mode
  if (config.public.wpNuxt.enableCache && !staging) {
    const cachedContent = await cacheStorage.getItem(cacheKey)
    if (cachedContent) {
      return {
        data: cachedContent,
        errors: []
      }
    }
  }
  return $fetch('/api/graphql_middleware/query/' + body.queryName, {
    params: buildRequestParams(body.params),
    headers: {
      Authorization: `Bearer ${event.context.accessToken}`
    }
  }).then((v: GraphqlResponse) => {
    cacheStorage.setItem(cacheKey, v.data).catch(() => {})
    return {
      data: v.data,
      errors: v.errors || []
    }
  })
})

/**
 * Get the parameters for the GraphQL middleware query.
 */
export function buildRequestParams(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  variables?: Record<string, any> | undefined | null
// eslint-disable-next-line @typescript-eslint/no-explicit-any
): Record<string, any> {
  if (!variables) {
    return {}
  }
  // Determine if each variable can safely be passed as query parameter.
  // This is only the case for strings.
  for (const key in variables) {
    if (typeof variables[key] !== 'string') {
      return {
        __variables: JSON.stringify(variables)
      }
    }
  }

  return variables
}
