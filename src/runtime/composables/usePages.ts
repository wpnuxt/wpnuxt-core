import { getContentNode, getContentNodes } from './useWPContent'

const _usePages = async () => {
  return getContentNodes('Pages', 'pages', 'nodes')
}

const _usePageById = async (id: number, asPreview?: boolean) => {
  return getContentNode('PageById', 'page', {
    id: id,
    asPreview: asPreview,
  })
}

export const usePages = _usePages
export const usePageById = _usePageById
