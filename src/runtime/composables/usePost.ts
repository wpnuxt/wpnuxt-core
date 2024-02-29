import { useTokens, useFetch, createError, useWPNuxtLogger } from "#imports"

const _usePostByUri = async (uri: string) => {
    const logger = useWPNuxtLogger()
    const tokens = useTokens()

    logger.debug('usePostByUri, fetching post for uri: ', uri)
    const { data, error } = await useFetch("/api/graphql_middleware/query/PostByUri/", {
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
        throw createError({ statusCode: error.value.status, message: error.value.message, fatal: true })
    }
    if (data?.value) {
      logger.debug('usePostByUri, successfully fetched post: ', data.value.title)
    } else {
      logger.debug('usePostByUri, data is empty')
    }
    return {
      data: data.value
    }
}
const _usePostById = async (id: number, asPreview?: boolean) => {
  const logger = useWPNuxtLogger()
  const tokens = useTokens()
  const { data, error } = await useFetch("/api/graphql_middleware/query/PostById/", {
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
