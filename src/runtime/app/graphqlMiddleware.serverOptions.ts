import { defineGraphqlServerOptions } from 'nuxt-graphql-middleware/dist/runtime/serverOptions'
import { getHeader } from 'h3'

export default defineGraphqlServerOptions({

  serverFetchOptions: function (event) {
    return {
      headers: {
        Authorization: getHeader(event, 'Authorization'),
      },
    }
  },
})
