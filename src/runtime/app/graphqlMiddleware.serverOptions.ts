import { defineGraphqlServerOptions } from 'nuxt-graphql-middleware/dist/runtime/serverOptions'
import { useRouteCache } from '#nuxt-multi-cache/composables'
import { getHeader } from 'h3'

const doNotCachePaths = [
  'Viewer'
]
export default defineGraphqlServerOptions({

  serverFetchOptions: function (event) {
    if (!doNotCachePaths.some(path => event?.path.startsWith(`/api/graphql_middleware/query/${path}`))) {
      useRouteCache((helper) => {
        helper.setMaxAge(604800).setCacheable() // Cache for 7 days.
      }, event)
    }
    return {
      headers: {
        Authorization: getHeader(event, 'Authorization'),
      },
    }
  },
})
