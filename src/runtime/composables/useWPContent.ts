import { FetchError } from 'ofetch'
import { getRelativeImagePath } from '../util/images'
import { useTokens } from './useTokens'
import { useFetch, useNuxtApp, type AsyncData } from '#app'

const _useWPContent = async <T>(queryName: string, node1: string, node2: string | undefined, node3: string | undefined, fixImagePaths: boolean, params?: T): Promise<AsyncData<T, FetchError | null>> => {
  const nuxtApp = useNuxtApp()
  const tokens = useTokens()
  const cacheKey = `wp-${queryName}-${node1}-${node2}-${node3}-${JSON.stringify(params)}`

  return useFetch('/api/wpContent', {
    method: 'POST',
    body: {
      queryName: queryName,
      params: params
    },
    key: cacheKey,
    headers: {
      Authorization: tokens.authorizationHeader
    },
    transform(data) {
      let transformedData
      if (node2 && node3) {
        transformedData = data.data[node1][node2][node3]
      } else if (!node2 && node3) {
        transformedData = data.data[node1][node3]
      } else if (node2 && !node3) {
        transformedData = data.data[node1][node2]
      } else {
        transformedData = data.data[node1]
      }
      if (fixImagePaths && transformedData?.featuredImage?.node?.sourceUrl) {
        transformedData.featuredImage.node.relativePath
          = getRelativeImagePath(transformedData.featuredImage.node.sourceUrl)
      }
      if (transformedData) return transformedData
      throw new FetchError('No data found')
    },
    getCachedData(key: string) {
      return nuxtApp.payload.data[key] || nuxtApp.static.data[key]
    }
  })
}

export const useWPContent = _useWPContent
