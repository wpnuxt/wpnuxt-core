import { getContentNode, getContentNodes } from './useWPContent'
import type { Post } from '#graphql-operations'

const _usePosts = async (): Promise<Post[]> => {
  const response = await getContentNodes<Post[]>('Posts', 'posts', 'nodes')
  return response.data
}

const _useLatestPost = async (): Promise<Post> => {
  const { data: posts, errors } = await <Post>getContentNodes('LatestPost', 'posts', 'nodes')
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

const _usePostByUri = async (uri: string): Promise<Post> => {
  if (!uri || uri === 'undefined' || uri === '_nuxt' || uri === '__nuxt') return
  return getContentNode<Post>('PostByUri', 'nodeByUri', {
    uri: uri,
  })
}

const _usePostById = async (id: number, asPreview?: boolean): Promise<Post> => {
  return getContentNode<Post>('PostById', 'post', {
    id: id,
    asPreview: asPreview ? true : false,
  })
}

export const useLatestPost = _useLatestPost
export const usePosts = _usePosts
export const usePostById = _usePostById
export const usePostByUri = _usePostByUri
