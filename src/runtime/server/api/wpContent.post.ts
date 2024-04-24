import { defineEventHandler, readBody } from 'h3'
import { cacheStorage } from '../storage'
import type { GraphqlResponse, WPContent } from '../../types'
import { isStaging } from '../../composables/isStaging'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)
  const staging = await isStaging()

  if (!body || !body.queryName) {
    throw new Error(
      'The request must contain a queryName',
    )
  }
  // TODO find better why to add the params to the cache key, as hash?
  const cacheKey = `wpContent-${body.queryName}-${body.params ? JSON.stringify(body.params) : ''}`

  // Read from cache if not disabled and we're not in staging mode
  if (config.public.wpNuxt.enableCache && !staging) {
    const cachedContent = await cacheStorage.getItem(cacheKey)
    if (cachedContent) {
      return {
        data: cachedContent,
        errors: [],
      }
    }
  }
  return $fetch<GraphqlResponse<WPContent>>('/api/graphql_middleware/query/' + body.queryName, {
    params: body.params,
    headers: {
      Authorization: `Bearer ${event.context.accessToken}`,
    },
  }).then((v: GraphqlResponse<WPContent>) => {
    cacheStorage.setItem(cacheKey, v.data).catch(() => {})
    return {
      data: v.data,
      errors: v.errors || [],
    }
  })
})
