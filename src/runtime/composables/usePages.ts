import { getContentNode, getContentNodes } from './useWPContent'
import type { Page } from '#graphql-operations'

const _usePages = async (): Promise<Page[] | []> => {
  return await getContentNodes<Page[]>('Pages', 'pages', 'nodes')
}

const _usePageByUri = async (uri: string): Promise<Page> => {
  if (!uri || uri === 'undefined' || uri === '_nuxt' || uri === '__nuxt') return
  return await getContentNode<Page>('PageByUri', 'nodeByUri', {
    uri: uri,
  })
}

const _usePageById = async (id: number, asPreview?: boolean): Promise<Page> => {
  return await getContentNode<Page>('PageById', 'page', {
    id: id,
    asPreview: asPreview ? true : false,
  })
}

export const usePages = _usePages
export const usePageByUri = _usePageByUri
export const usePageById = _usePageById
