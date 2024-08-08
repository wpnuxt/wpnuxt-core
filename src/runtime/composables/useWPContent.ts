import { FetchError } from 'ofetch'
import { getRelativeImagePath } from '../util/images'
import { useFetch, useNuxtApp, type AsyncData } from '#app'

const _useWPContent = async <T>(queryName: string, nodes: string[], fixImagePaths: boolean, params?: T): Promise<AsyncData<T, FetchError | null>> => {
  const nuxtApp = useNuxtApp()
  const cacheKey = `wp-${queryName}-${nodes}-${JSON.stringify(params)}`

  return useFetch('/api/wpContent', {
    method: 'POST',
    body: {
      queryName: queryName,
      params: params
    },
    key: cacheKey,
    transform(data) {
      const transformedData = findData(data.data, nodes)
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

const findData = (data: unknown, nodes: string[]) => {
  if (nodes.length === 0) return data
  if (nodes.length > 0) {
    return nodes.reduce((acc, node) => {
      return acc[node]
    }, data)
  }
}

export const useWPContent = _useWPContent
