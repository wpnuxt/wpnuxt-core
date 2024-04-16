import { defineEventHandler, readBody } from 'h3'
import { useRuntimeConfig } from '#imports';
import { cacheStorage } from '../storage'
import type { GraphqlResponse } from '../../types'
import { isStaging } from '../../composables/isStaging';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event)
  const staging = await isStaging()

  if (!body || !body.queryName) {
    throw new Error(
        'The request must contain a queryName',
    );
  }
  // TODO find better why to add the params to the cache key, as hash?
  const cacheKey = `wpContent-${body.queryName}-${body.params ? JSON.stringify(body.params) : ''}`
  console.log('wpContent.post.ts: staging', staging)

  // Read from cache if not disabled and we're not in staging mode
  if (config.public.wpNuxt.enableCache && !staging) {
    const cachedContent = await cacheStorage.getItem(cacheKey)
    if (cachedContent) {
      console.log('wpContent.post.ts: Returning cached content for', cacheKey)
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
    console.log('wpContent.post.ts: fetched new content for', cacheKey)
    return {
      data: v.data,
      errors: v.errors || [],
    }
  })
})
