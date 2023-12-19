import { ref, computed, useNuxtData, useFetch, createError } from "#imports"

const _usePostByUri = async (uri: string) => {
    const { data, pending, refresh, error } = await useFetch("/api/graphql_middleware/query/PostByUri/", {
        params: {
            uri: uri
        },
        transform (data) {
            return data.data.nodeByUri;
        }
    })
    if (error.value) {
        throw createError({ statusCode: 500, message: 'Error fetching PostByUri', fatal: true })
    }
    return {
        data: data.value
    }
}
const _usePostById = async (id: number, asPreview?: boolean) => {
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
    throw createError({ statusCode: 500, message: 'Error fetching PostById', fatal: true })
  }
  return {
    data: data.value
  }
}

export const usePostById = _usePostById
export const usePostByUri = _usePostByUri
