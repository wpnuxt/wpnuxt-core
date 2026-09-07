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
 * - Preview mode (passes the preview flag, token and WordPress preview params
 *   from the URL query params)
 *
 * WordPress puts `preview_id` + `preview_nonce` on the preview link of a
 * published post and `p` / `page_id` on the preview link of a draft, plus
 * `_thumbnail_id` when the featured image was changed. The server options turn
 * these into the `X-GraphQL-Preview` header WPGraphQL 2.21+ expects.
 *
 * The context is available in serverFetchOptions via context.client
 * All values must be strings (nuxt-graphql-middleware requirement)
 *
 * Users can customize by creating their own app/graphqlMiddleware.clientOptions.ts
 */
export default defineGraphqlClientOptions<{
  preview?: string
  previewToken?: string
  previewId?: string
  previewThumbnailId?: string
  previewNonce?: string
}>({
  buildClientContext() {
    const route = useRoute()
    const query = route?.query ?? {}
    const isPreview = query.preview === 'true'
    const asString = (value: unknown) => typeof value === 'string' ? value : undefined
    const previewId = asString(query.preview_id) || asString(query.p) || asString(query.page_id)

    return {
      // Context values must be strings - use 'true'/'false' instead of boolean
      preview: isPreview ? 'true' : undefined,
      previewToken: asString(query.token),
      // Only forward the preview params when preview mode was requested, so a
      // plain ?p=123 permalink never turns into a preview request.
      previewId: isPreview ? previewId : undefined,
      previewThumbnailId: isPreview ? asString(query._thumbnail_id) : undefined,
      previewNonce: isPreview ? asString(query.preview_nonce) : undefined
    }
  }
})
