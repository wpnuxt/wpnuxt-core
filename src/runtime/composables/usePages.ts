import { getContentNode, getContentNodes } from './useWPContent'
import type { PagesQuery, PageByIdQuery } from '#graphql-operations'

const _usePages = async () => {
  return getContentNodes<PagesQuery>('Pages', 'pages', 'nodes')
}

const _usePageById = async (id: number, asPreview?: boolean) => {
  return getContentNode<PageByIdQuery>('PageById', 'page', {
    id: id,
    asPreview: asPreview,
  })
}

export const usePages = _usePages
export const usePageById = _usePageById
