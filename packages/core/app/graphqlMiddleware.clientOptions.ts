import { defineGraphqlClientOptions } from 'nuxt-graphql-middleware/client-options'
// IMPORTANT: import useRoute from 'vue-router', NOT '#imports'.
// nuxt-graphql-middleware loads this file via its client-options loader, which
// pulls it into the server (Nitro) typecheck context where '#imports' resolves
// to nitro-imports and does NOT export useRoute -> TS2305 at typecheck.
// This has regressed twice already (see #269/#271). Do not "simplify" back to '#imports'.
import { useRoute } from 'vue-router'

/**
 * WPNuxt default client options for nuxt-graphql-middleware.
 *
 * This enables passing client context to the server for:
 * - Preview mode (passes preview flag and token from URL query params)
 *
 * The context is available in serverFetchOptions via context.client
 * All values must be strings (nuxt-graphql-middleware requirement)
 *
 * Users can customize by creating their own app/graphqlMiddleware.clientOptions.ts
 */
export default defineGraphqlClientOptions<{
  preview?: string
  previewToken?: string
}>({
  buildClientContext() {
    const route = useRoute()
    const query = route?.query ?? {}
    const token = query.token

    return {
      // Context values must be strings - use 'true'/'false' instead of boolean
      preview: query.preview === 'true' ? 'true' : undefined,
      previewToken: typeof token === 'string' ? token : undefined
    }
  }
})
