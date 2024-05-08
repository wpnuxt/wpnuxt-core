import type { FetchError } from 'ofetch'
import { getContentNode, getContentNodes } from './useWPContent'
import type { Post } from '#graphql-operations'
import type { AsyncData } from '#app'
import { ref } from '#imports'

const _usePosts = async (): Promise<AsyncData<Post[] | null, FetchError | null>> => {
  return await getContentNodes<Array<Post>>('Posts', 'posts', 'nodes')
}

const _useLatestPost = async (): Promise<AsyncData<Post | null, FetchError | null>> => {
  const response = await getContentNodes<Array<Post>>('LatestPost', 'posts', 'nodes')
  if (response.data && response.data.value && response.data.value[0]) {
    response.data = ref(response.data.value[0])
    return response
  }
  return new Promise(() => null)
}

const _usePostByUri = async (uri: string): Promise<AsyncData<Post | null, FetchError | null>> => {
  if (!uri || uri === 'undefined' || uri === '_nuxt' || uri === '__nuxt') return new Promise(() => null)
  return await getContentNode<Post>('PostByUri', 'nodeByUri', {
    uri: uri,
  })
}

const _usePostById = async (id: number, asPreview?: boolean): Promise<AsyncData<Post | null, FetchError | null>> => {
  return await getContentNode<Post>('PostById', 'post', {
    id: id,
    asPreview: asPreview ? true : false,
  })
}

export const useLatestPost = _useLatestPost
export const usePosts = _usePosts
export const usePostById = _usePostById
export const usePostByUri = _usePostByUri
