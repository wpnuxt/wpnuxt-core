import { ref, computed, useNuxtData, useFetch, createError, useWPNuxtLogger } from "#imports"

const _usePostByUri = async (uri: string) => {
    const logger = useWPNuxtLogger()
    const { data, pending, refresh, error } = await useFetch("/api/graphql_middleware/query/PostByUri/", {
        params: {
            uri: uri
        },
        transform (data) {
            return data.data.nodeByUri;
        }
    })
    if (error.value) {
        logger.error('usePostByUri, error: ', error.value)
        throw createError({ statusCode: 500, message: 'Error fetching PostByUri', fatal: true })
    }
    logger.debug('usePostByUri: fetched post from WordPress: ', data.value.title)
    return {
        data: data.value
    }
}
const _usePostById = async (id: number, asPreview?: boolean) => {
  const logger = useWPNuxtLogger()
  const { data, pending, refresh, error } = await useFetch("/api/graphql_middleware/query/PostById/", {
    params: {
      id: id,
      asPreview: asPreview ? true : false
    },
    transform (data) {
      return data.data.post;
    }
  })
  if (error.value) {
    logger.error('usePostByUId, error: ', error.value)
    throw createError({ statusCode: 500, message: 'Error fetching PostById', fatal: true })
  }
  logger.debug('usePostById: fetched post from WordPress: ', data.value.title)
  return {
    data: data.value
  }
}

export const usePostById = _usePostById
export const usePostByUri = _usePostByUri
