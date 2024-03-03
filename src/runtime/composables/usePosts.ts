import { useFetch, createError, ref, useNuxtData } from "#imports"
import { useTokens } from "./useTokens";

const _usePosts = async () => {
  const posts = ref()
  const tokens = useTokens()
  const cacheKey =  'allposts'
  const cachedPosts = useNuxtData(cacheKey)

  if (cachedPosts.data.value) {
    posts.value = cachedPosts.data.value
  } else {
    const { data, error } = await useFetch("/api/graphql_middleware/query/Posts", {
      key: cacheKey,
      headers: {
        Authorization: tokens.authorizationHeader
      },
      transform (data: any) {
          return data.data.posts.nodes;
      }
    });
    if (error.value) {
        throw createError({ statusCode: 500, message: 'Error fetching posts', fatal: true })
    }
    posts.value = data.value
  }
  return {
      data: posts.value
  }
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
