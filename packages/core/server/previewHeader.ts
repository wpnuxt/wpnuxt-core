export type PreviewClientContext = {
  preview?: string | null
  previewId?: string | null
  previewThumbnailId?: string | null
  previewNonce?: string | null
}

/**
 * Build the `X-GraphQL-Preview` request header WPGraphQL 2.21+ uses to overlay
 * the newest autosave on a node, replacing the deprecated `asPreview` argument.
 *
 * The value is an RFC 8941 structured-field dictionary, e.g.
 * `database_id=123, featured_image_database_id=456, nonce="45d5b05f1b"`.
 *
 * Malformed input is dropped silently, matching WPGraphQL, which treats
 * unauthorised or invalid preview input as if it were never provided.
 *
 * Note: this file must stay dependency-free and directly under `server/` —
 * `server/utils/` would make it a global Nitro auto-import in user projects,
 * and only `dist`, `server` and `app` are published, so it cannot import `src`.
 *
 * @param client - The client context collected by the WPNuxt client options
 * @returns The header value, or undefined when there is nothing to preview
 */
export function buildPreviewHeader(client?: PreviewClientContext): string | undefined {
  if (!client || client.preview !== 'true') return undefined

  const databaseId = toPositiveInteger(client.previewId)
  if (!databaseId) return undefined

  const parts = [`database_id=${databaseId}`]

  const thumbnailId = toPositiveInteger(client.previewThumbnailId)
  if (thumbnailId) {
    parts.push(`featured_image_database_id=${thumbnailId}`)
  }

  // An alphanumeric nonce is a valid sf-string and needs no escaping.
  if (client.previewNonce && /^[a-z0-9]+$/i.test(client.previewNonce)) {
    parts.push(`nonce="${client.previewNonce}"`)
  }

  return parts.join(', ')
}

function toPositiveInteger(value?: string | null): number | undefined {
  if (!value || !/^\d+$/.test(value)) return undefined
  const parsed = Number(value)
  return parsed > 0 ? parsed : undefined
}
