import type { FetchError } from 'ofetch'
import { getRelativeImagePath } from '../util/images'
import type { AsyncData } from '#app'

const _useWPContent = async <T>(queryName: string, nodes: string[], fixImagePaths: boolean, params?: T) => {
  const { data, error } = await $fetch<AsyncData<T, FetchError | null>>('/api/wpContent', {
    method: 'POST',
    body: {
      queryName,
      params
    },
  })
  return {
    data: transformData(data, nodes, fixImagePaths),
    error
  }
}

const transformData = (data: unknown, nodes: string[], fixImagePaths: boolean): T => {
  const transformedData = findData(data, nodes)
  if (fixImagePaths && transformedData?.featuredImage?.node?.sourceUrl) {
    transformedData.featuredImage.node.relativePath
      = getRelativeImagePath(transformedData.featuredImage.node.sourceUrl)
  }
  return transformedData as T
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
