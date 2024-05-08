import type { FetchError } from 'ofetch'
import { getContentNode } from './useWPContent'
import type { Page, Post } from '#graphql-operations'
import type { AsyncData } from '#app'

const _useNodeByUri = async (uri: string): Promise<AsyncData<Page | Post | null, FetchError | null>> => {
  if (!uri || uri === 'undefined' || uri === '_nuxt' || uri === '__nuxt') return new Promise(() => null)
  return await getContentNode('NodeByUri', 'nodeByUri', {
    uri: uri,
  })
}

export const useNodeByUri = _useNodeByUri
