import type { FetchError } from 'ofetch'
import { getContentNode, getContentNodes } from './useWPContent'
import type { Page } from '#graphql-operations'
import type { AsyncData } from '#app'

const _usePages = async (): Promise<AsyncData<Page[] | null, FetchError | null>> => {
  return await getContentNodes<Page[]>('Pages', 'pages', 'nodes')
}

const _usePageByUri = async (uri: string): Promise<AsyncData<Page | null, FetchError | null>> => {
  if (!uri || uri === 'undefined' || uri === '_nuxt' || uri === '__nuxt') return new Promise(() => null)
  return await getContentNode<Page>('PageByUri', 'nodeByUri', {
    uri: uri
  })
}

const _usePageById = async (id: number, asPreview?: boolean): Promise<AsyncData<Page | null, FetchError | null>> => {
  return await getContentNode<Page>('PageById', 'page', {
    id: id,
    asPreview: asPreview ? true : false
  })
}

export const usePages = _usePages
export const usePageByUri = _usePageByUri
export const usePageById = _usePageById
