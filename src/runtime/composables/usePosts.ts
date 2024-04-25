import { getContentNode, getContentNodes } from './useWPContent'
import type { Post } from '#graphql-operations'

const _usePosts = async (): Promise<Post[]> => {
  return await getContentNodes<Post[]>('Posts', 'posts', 'nodes')
}

const _useLatestPost = async (): Promise<Post> => {
  const posts = await <Post>getContentNodes('LatestPost', 'posts', 'nodes')
  if (!posts || !posts.length) {
    return undefined
  }
  return posts[0]
}

const _usePostByUri = async (uri: string): Promise<Post> => {
  if (!uri || uri === 'undefined' || uri === '_nuxt' || uri === '__nuxt') return
  const { data } = await getContentNode<Post>('PostByUri', 'nodeByUri', {
    uri: uri,
  })
  return data.data
}

const _usePostById = async (id: number, asPreview?: boolean): Promise<Post> => {
  return await getContentNode<Post>('PostById', 'post', {
    id: id,
    asPreview: asPreview ? true : false,
  })
}

export const useLatestPost = _useLatestPost
export const usePosts = _usePosts
export const usePostById = _usePostById
export const usePostByUri = _usePostByUri
