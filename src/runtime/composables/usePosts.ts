import { getContentNode, getContentNodes } from './useWPContent'
import type { PostsQuery, LatestPostQuery, PostByUriQuery, PostByIdQuery } from '#graphql-operations'

const _usePosts = async () => {
  return getContentNodes<PostsQuery>('Posts', 'posts', 'nodes')
}

const _useLatestPost = async () => {
  const { data: posts, errors } = await <LatestPostQuery>getContentNodes('LatestPost', 'posts', 'nodes')
  if (!posts || !posts.length) {
    return {
      data: null,
      errors: ['Post not found'],
    }
  }
  return {
    data: posts[0],
    errors,
  }
}

const _usePostByUri = async (uri: string) => {
  if (!uri || uri === 'undefined' || uri === '_nuxt' || uri === '__nuxt') return
  return getContentNode<PostByUriQuery>('PostByUri', 'nodeByUri', {
    uri: uri,
  })
}

const _usePostById = async (id: number, asPreview?: boolean) => {
  return getContentNode<PostByIdQuery>('PostById', 'post', {
    id: id,
    asPreview: asPreview ? true : false,
  })
}

export const useLatestPost = _useLatestPost
export const usePosts = _usePosts
export const usePostById = _usePostById
export const usePostByUri = _usePostByUri
