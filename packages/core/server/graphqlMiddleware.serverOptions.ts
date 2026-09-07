import { defineGraphqlServerOptions } from 'nuxt-graphql-middleware/server-options'
import { getHeader, getCookie } from 'h3'
import { buildPreviewHeader } from './previewHeader'
import { useRuntimeConfig } from '#imports'

/**
 * WPNuxt default server options for nuxt-graphql-middleware.
 *
 * This enables:
 * - Cookie forwarding for WordPress preview mode
 * - Authorization header forwarding for authenticated requests
 * - Auth token from cookie for @wpnuxt/auth, or from the ?token= URL param
 * - The X-GraphQL-Preview header for WordPress preview mode (WPGraphQL 2.21+)
 * - Consistent error logging
 *
 * Users can customize by creating their own server/graphqlMiddleware.serverOptions.ts
 */
export default defineGraphqlServerOptions({
  async serverFetchOptions(event, _operation, _operationName, context) {
    // Get auth token from Authorization header or from cookie
    let authorization = getHeader(event, 'authorization') || ''

    // If no Authorization header, check for auth token in cookie (@wpnuxt/auth)
    if (!authorization) {
      const config = (useRuntimeConfig().public as Record<string, unknown>).wpNuxtAuth as { cookieName?: string } | undefined
      const cookieName = config?.cookieName || 'wpnuxt-auth-token'
      const authToken = getCookie(event, cookieName)
      if (authToken) {
        authorization = `Bearer ${authToken}`
      }
    }

    // Last resort: the JWT from the ?token= URL param, collected by the client options
    if (!authorization && context?.client?.previewToken) {
      authorization = `Bearer ${context.client.previewToken}`
    }

    const previewHeader = buildPreviewHeader(context?.client)

    return {
      headers: {
        // Forward WordPress auth cookies for previews
        Cookie: getHeader(event, 'cookie') || '',
        // Forward authorization header or token from cookie
        Authorization: authorization,
        // Preview overlay for WPGraphQL 2.21+ (replaces the deprecated asPreview argument)
        ...(previewHeader ? { 'X-GraphQL-Preview': previewHeader } : {})
      }
    }
  },

  async onServerError(event, error, _operation, operationName) {
    const url = event.node.req.url || 'unknown'
    console.error(`[WPNuxt] GraphQL error in ${operationName} (${url}):`, error.message)
  }
})
