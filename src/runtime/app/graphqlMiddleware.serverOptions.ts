import { defineGraphqlServerOptions } from 'nuxt-graphql-middleware/dist/runtime/serverOptions'
import { useRouteCache } from '#nuxt-multi-cache/composables'
import { getHeader } from 'h3'

const cachePaths = [
  'PostById',
  'PostByUri',
]
export default defineGraphqlServerOptions({

  serverFetchOptions: function (event) {
    /*if (cachePaths.some(path => event?.path.startsWith(`/api/graphql_middleware/query/${path}`))) {
      console.log('cacheable', event?.path)
      useRouteCache((helper) => {
        helper.setMaxAge(3600).setCacheable()
      }, event)
    } else {
      console.log('not cacheable', event?.path)
    }*/

    // Cache all routes for 7 days.
    useRouteCache((helper) => {
      helper.setCacheable().setMaxAge(604800)
    }, event)
    return {
      headers: {
        Authorization: getHeader(event, 'Authorization'),
      },
    }
  },
})
