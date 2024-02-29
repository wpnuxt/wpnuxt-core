import { useFetch, createError, useTokens } from "#imports"

const _usePosts = async () => {
  const tokens = useTokens()
  const { data, error } = await useFetch("/api/graphql_middleware/query/Posts", {
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
  return {
      data: data.value
  }
}
const _useLatestPost = async () => {
  const tokens = useTokens()
  const { data, error } = await useFetch("/api/graphql_middleware/query/LatestPost", {
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
  return {
      data: data.value
  }
}

export const useLatestPost = _useLatestPost
export const usePosts = _usePosts
