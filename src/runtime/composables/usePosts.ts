import { useFetch, createError, ref, useNuxtData } from "#imports"
import type { GraphqlResponse } from "~/src/types";
import { useTokens } from "./useTokens";

const _usePosts = () => {
  return useFetch<GraphqlResponse<any>>("/api/graphql_middleware/query/Posts", {
    transform (data: any) {
        return data.data.posts.nodes;
    }
  }).then((v: GraphqlResponse<any>) => {
    return {
      data: v.data.value,
      errors: v.errors || [],
    }
  })
}
const _useAsyncPosts = async () => {
  const key = 'posts'
  return useAsyncData(key, () => _usePosts()())
}
const _useLatestPost = async () => {
  const posts = ref()
  const tokens = useTokens()
  const cacheKey =  'latestposts'
  const cachedPosts = useNuxtData(cacheKey)

  if (cachedPosts.data.value) {
    posts.value = cachedPosts.data.value
  } else {
    const { data, error } = await useFetch("/api/graphql_middleware/query/LatestPost", {
      key: cacheKey,
      headers: {
        Authorization: tokens.authorizationHeader
      },
      transform (data: any) {
          return data.data.posts.nodes[0];
      }
    });
    if (error.value) {
        throw createError({ statusCode: 500, message: 'Error fetching latest post', fatal: true })
    }
    posts.value = data.value
  }
  return {
      data: posts.value
  }
}

export const useLatestPost = _useLatestPost
export const usePosts = _usePosts
export const useAsyncPosts = _useAsyncPosts
