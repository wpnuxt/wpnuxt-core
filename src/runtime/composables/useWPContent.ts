import { useFetch, useNuxtApp, useRuntimeConfig } from "#imports"
import type { GraphqlResponse } from "~/src/runtime/types";
import { getRelativeImagePath } from "../util/images";
import { useTokens } from "./useTokens";

const _getContentNodes = async (queryName: string, node1Name?: string, node2Name?: string, node3Name?: string, params?: any) => {
  const node1 = node1Name ? node1Name : queryName.toLowerCase()
  const node2 = node2Name ? node2Name : undefined
  const node3 = node3Name || node3Name == null ? node3Name : undefined
  return await _fetchContentNode(queryName, node1, node2, node3, params, false)
}
const _getContentNode = async (queryName: string, nodeName?: string, params?: any) => {
  const node = nodeName ? nodeName : queryName.toLowerCase()
  return await _fetchContentNode(queryName, node, undefined, undefined, params, true)
}

const _fetchContentNode = async (queryName: string, node1: string, node2: string | undefined, node3: string | undefined, params: any, fixImagePaths: boolean) => {

  const nuxtApp = useNuxtApp()
  const config = useRuntimeConfig()
  const tokens = useTokens()
  const cacheKey =  `wp-${queryName}-${node1}-${node2}-${node3}-${JSON.stringify(params)}`

  return await useFetch<GraphqlResponse<any>>("/api/wpContent", {
    method: 'POST',
    body: {
      queryName: queryName,
      params: params
    },
    key: cacheKey,
    headers: {
      Authorization: tokens.authorizationHeader
    },
    transform (data: any) {
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
      if(fixImagePaths && transformedData.featuredImage?.node?.sourceUrl) {
        transformedData.featuredImage.node.relativePath =
          getRelativeImagePath(transformedData.featuredImage.node.sourceUrl)
      }
      return transformedData
    },
    getCachedData(key: string) {
      return nuxtApp.payload.data[key] || nuxtApp.static.data[key]
    }
  }).then((v: GraphqlResponse<any>) => {
    return {
      data: v.data.value,
      errors: v.errors || [],
    }
  })
}

export const getContentNodes = _getContentNodes
export const getContentNode = _getContentNode
