import { ref, computed, useNuxtData, useTokens, useFetch, createError, useWPNuxtLogger } from "#imports"

const _usePostByUri = async (uri: string) => {
    const logger = useWPNuxtLogger()
    const post = ref()
    const cacheKey = computed(() => `postByUri-${uri}`)
    const tokens = useTokens()
    const cachedPost = useNuxtData(cacheKey.value)

    logger.debug('usePostByUri, fetching post for uri: ', uri)

    if (cachedPost.data.value) {
      post.value = cachedPost.data.value
      logger.debug('usePostByUri, got post from cache: ', post.value.title)
    } else {
      const { data, pending, refresh, error } = await useFetch("/api/graphql_middleware/query/PostByUri/", {
          key: cacheKey.value,
          params: {
              uri: uri
          },
          headers: {
            Authorization: tokens.authorizationHeader
          },
          transform (data) {
              return data.data.nodeByUri;
          }
      })
      if (error.value) {
          logger.error('usePostByUri, error: ', error.value)
          throw createError({ statusCode: 500, message: 'Error fetching PostByUri', fatal: true })
      }
      if (data?.value) {
        logger.debug('usePostByUri, successfully fetched post: ', data.value.title)
      } else {
        logger.debug('usePostByUri, data is empty')
      }
      post.value = data.value
    }
    return {
        data: post.value
    }
}
const _usePostById = async (id: number, asPreview?: boolean) => {
  const logger = useWPNuxtLogger()
  const tokens = useTokens()
  const { data, pending, refresh, error } = await useFetch("/api/graphql_middleware/query/PostById/", {
    params: {
      id: id,
      asPreview: asPreview ? true : false
    },
    headers: {
      Authorization: tokens.authorizationHeader
    },
    transform (data) {
      return data.data.post;
    }
  })
  if (error.value) {
    logger.error('usePostByUId, error: ', error.value)
    throw createError({ statusCode: 500, message: 'Error fetching PostById', fatal: true })
  }
  if (data?.value) {
    logger.debug('usePostById, successfully fetched post: ', data.value.title)
  } else {
    logger.debug('usePostById, data is empty')
  }
  return {
    data: data.value
  }
}

export const usePostById = _usePostById
export const usePostByUri = _usePostByUri
