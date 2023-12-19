import { defineGraphqlServerOptions } from 'nuxt-graphql-middleware/dist/runtime/serverOptions'
import { useRouteCache } from '#nuxt-multi-cache/composables'
import { getHeader } from 'h3'

const cachePaths = [
  'PostById',
  'PostByUri',
]
export default defineGraphqlServerOptions({

  serverFetchOptions: function (event) {    
    if (cachePaths.some(path => event?.path.startsWith(`/api/graphql_middleware/query/${path}`))) {
      useRouteCache((helper) => {
        helper.setMaxAge(3600).setCacheable()
      }, event)
    }
    return {
      headers: {
        Authorization: getHeader(event, 'Authorization'),
      },
    }
  },
})
