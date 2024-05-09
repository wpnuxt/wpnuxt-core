import type { FetchError } from 'ofetch'
import { getRelativeImagePath } from '../util/images'
import { useTokens } from './useTokens'
import { useFetch, useNuxtApp, type AsyncData } from '#app'

const _getContentNodes = async <T>(queryName: string, node1Name?: string, node2Name?: string, node3Name?: string, params?: T): Promise<AsyncData<T | null, FetchError | null>> => {
  const node1 = node1Name ? node1Name : queryName.toLowerCase()
  const node2 = node2Name ? node2Name : undefined
  const node3 = node3Name || node3Name == null ? node3Name : undefined
  return await _fetchContentNode<T>(queryName, node1, node2, node3, false, params)
}
const _getContentNode = async <T>(queryName: string, nodeName?: string, params?: T): Promise<AsyncData<T | null, FetchError | null>> => {
  const node = nodeName ? nodeName : queryName.toLowerCase()
  return await _fetchContentNode<T>(queryName, node, undefined, undefined, true, params)
}

const _fetchContentNode = async <T>(queryName: string, node1: string, node2: string | undefined, node3: string | undefined, fixImagePaths: boolean, params?: T) => {
  const nuxtApp = useNuxtApp()
  const tokens = useTokens()
  const cacheKey = `wp-${queryName}-${node1}-${node2}-${node3}-${JSON.stringify(params)}`

  return useFetch('/api/wpContent', {
    method: 'POST',
    body: {
      queryName: queryName,
      params: params,
    },
    key: cacheKey,
    headers: {
      Authorization: tokens.authorizationHeader,
    },
    transform(data) {
      let transformedData
      if (node2 && node3) {
        transformedData = data.data[node1][node2][node3]
      }
      else if (!node2 && node3) {
        transformedData = data.data[node1][node3]
      }
      else if (node2 && !node3) {
        transformedData = data.data[node1][node2]
      }
      else {
        transformedData = data.data[node1]
      }
      if (fixImagePaths && transformedData?.featuredImage?.node?.sourceUrl) {
        transformedData.featuredImage.node.relativePath
          = getRelativeImagePath(transformedData.featuredImage.node.sourceUrl)
      }
      return transformedData
    },
    getCachedData(key: string) {
      return nuxtApp.payload.data[key] || nuxtApp.static.data[key]
    },
  })
}

export const getContentNodes = _getContentNodes
export const getContentNode = _getContentNode
