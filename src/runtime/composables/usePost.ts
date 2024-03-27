import { useFetch, createError, ref, useNuxtData, computed, useNuxtApp } from "#imports"
import { getRelativeImagePath } from "../util/images";
import { useTokens } from "./useTokens";
import { useWPNuxtLogger } from "./useWPNuxtlogger";

const _usePostByUri = async (uri: string) => {
    if (!uri || uri === 'undefined' || uri === '_nuxt'  || uri === '__nuxt' ) return
    const post = ref()
    const logger = useWPNuxtLogger()
    const nuxtApp = useNuxtApp()
    const tokens = useTokens()
    const cacheKey =  'post-'  + uri
    const { data: cachedPost } = useNuxtData(cacheKey);

    if (cachedPost.value) {
      post.value = cachedPost.value
    } else {
      const { data, error } = await useFetch<any>("/api/graphql_middleware/query/PostByUri/", {
          params: {
              uri: uri
          },
          key: cacheKey,
          headers: {
            Authorization: tokens.authorizationHeader
          },
          transform (data: any) {
              if(data?.data?.nodeByUri?.featuredImage?.node?.sourceUrl) {
                data.data.nodeByUri.featuredImage.node.relativePath =
                  getRelativeImagePath(data.data.nodeByUri.featuredImage.node.sourceUrl)
              }
              return data.data.nodeByUri;
          },
          getCachedData(key: string) {
            return nuxtApp.payload.data[key] || nuxtApp.static.data[key]
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
        if (data?.data?.post?.featuredImage?.node?.sourceUrl) {
            data.data.post.featuredImage.node.relativePath =
              getRelativeImagePath(data.data.post.featuredImage.node.sourceUrl)
        }
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
