import { getRelativeImagePath } from '../util/images'
import type { NodeWithFeaturedImage } from '#graphql-operations'

const _useFeaturedImage = (contentNode: NodeWithFeaturedImage): string | undefined => {
  const sourceUrl = contentNode?.featuredImage?.node?.sourceUrl
  if (sourceUrl) return getRelativeImagePath(sourceUrl)
  else return undefined
}

export const useFeaturedImage = _useFeaturedImage
