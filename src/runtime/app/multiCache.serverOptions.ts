import { defineMultiCacheOptions } from 'nuxt-multi-cache/dist/runtime/serverOptions'
import { getQuery } from 'h3'

export default defineMultiCacheOptions({
  route: {
    buildCacheKey(event) {
      const path = event.path

      // Handle specific routes that need query strings.
      if (path.startsWith('/api/graphql_middleware/query/PostByUri')) {
        const queryParams = getQuery(event)
        if (queryParams && queryParams.uri) {
                    return `api_query_postByUri_${queryParams.uri}`
        }
      }
      if (path.startsWith('/api/graphql_middleware/query/PostById')) {
        const queryParams = getQuery(event)
        if (queryParams && queryParams.id) {
                    return `api_query_postById_${queryParams.id}`
        }
      }

      // Remove query string from path.
      return path.split('?')[0]
    },
  },
})
