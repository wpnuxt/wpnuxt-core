import { getContentNode } from './useWPContent'
import type { Page, Post } from '#graphql-operations'

const _useNodeByUri = async (uri: string): Promise<Page | Post> => {
  if (!uri || uri === 'undefined' || uri === '_nuxt' || uri === '__nuxt') return
  const node = await getContentNode('NodeByUri', 'nodeByUri', {
    uri: uri,
  })
  return node
}

export const useNodeByUri = _useNodeByUri
