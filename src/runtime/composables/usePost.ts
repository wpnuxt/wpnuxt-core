import { useFetch, createError, ref, useNuxtData, computed } from "#imports"
import { useTokens } from "./useTokens";
import { useWPNuxtLogger } from "./useWPNuxtlogger";

const _usePostByUri = async (uri: string) => {
    const post = ref()
    const logger = useWPNuxtLogger()
    const tokens = useTokens()
    const cacheKey =  computed(() => `post-${uri}`)
    const cachedPost = useNuxtData(cacheKey.value)

    if (cachedPost.data.value) {
      post.value = cachedPost.data.value
    } else {
      const { data, error } = await useFetch("/api/graphql_middleware/query/PostByUri/", {
          key: cacheKey.value,
          params: {
              uri: uri
          },
          headers: {
            Authorization: tokens.authorizationHeader
          },
          transform (data: any) {
              return data.data.nodeByUri;
          }
      })
      if (error.value) {
          logger.error('usePostByUri, error: ', error.value)
          throw createError({ statusCode: error.value.status, message: error.value.message, fatal: true })
      }
      post.value = data.value
    }
    return {
      data: post.value
    }
}
const _usePostById = async (id: number, asPreview?: boolean) => {
  const post = ref()
  const logger = useWPNuxtLogger()
  const tokens = useTokens()
  const cacheKey =  computed(() => `post-${id}`)
  const cachedPost = useNuxtData(cacheKey.value)

  if (cachedPost.data.value) {
    post.value = cachedPost.data.value
  } else {
    const { data, error } = await useFetch("/api/graphql_middleware/query/PostById/", {
      key: cacheKey.value,
      params: {
        id: id,
        asPreview: asPreview ? true : false
      },
      headers: {
        Authorization: tokens.authorizationHeader
      },
      transform (data: any) {
        return data.data.post;
      }
    })
    if (error.value) {
      logger.error('usePostByUId, error: ', error.value)
      throw createError({ statusCode: 500, message: 'Error fetching PostById', fatal: true })
    }
    post.value = data.value
  }
  if (post.value) {
    logger.debug('usePostById, successfully fetched post: ', post.value.title)
  } else {
    logger.debug('usePostById, data is empty')
  }
  return {
    data: post.value
  }
}

export const usePostById = _usePostById
export const usePostByUri = _usePostByUri
