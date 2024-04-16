import { defineEventHandler, readBody } from 'h3'
import { useRuntimeConfig } from '#imports';
import { cacheStorage } from '../storage'
import type { GraphqlResponse } from '../../types'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event)

  if (!body || !body.queryName) {
    throw new Error(
        'The request must contain a queryName',
    );
  }
  // TODO find better why to add the params to the cache key, as hash?
  const cacheKey = `wpContent-${body.queryName}-${body.params ? JSON.stringify(body.params) : ''}`

  // Read from cache if not disabled
  if (config.public.wpNuxt.enableCache) {
    const cachedContent = await cacheStorage.getItem(cacheKey)
    if (cachedContent) {
      return {
        data: cachedContent,
        errors: [],
      }
    }
  }
  return $fetch<GraphqlResponse<any>>("/api/graphql_middleware/query/" + body.queryName, {
    params: body.params,
  }).then((v: GraphqlResponse<any>) => {
    cacheStorage.setItem(cacheKey, v.data).catch(() => {})
    return {
      data: v.data,
      errors: v.errors || [],
    }
  })
})
