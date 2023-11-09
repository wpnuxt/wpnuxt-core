import { defineGraphqlServerOptions } from 'nuxt-graphql-middleware/dist/runtime/serverOptions'

export default defineGraphqlServerOptions({

  serverFetchOptions: function (event) {
    return {
      headers: {
        Authorization: getHeader(event, 'Authorization'),
      },
    }
  },
})
