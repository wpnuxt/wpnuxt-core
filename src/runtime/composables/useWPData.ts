import { useFetch, createError, ref, useNuxtData } from "#imports"

const _useWPData = async (queryName: string) => {

  const posts = ref()
  const cacheKey =  'wpdataext-' + queryName
  const cachedPosts = useNuxtData(cacheKey)

  if (cachedPosts.data.value) {
    posts.value = cachedPosts.data.value
  } else {
    const { data, error } = await useFetch("/api/graphql_middleware/query/" + queryName, {
      key: cacheKey,
      transform (data: any) {
          return data.data[queryName.toLowerCase()].nodes;
      }
    });
    if (error.value) {
        console.error(error.value)
        throw createError({ statusCode: 500, message: 'Error fetching ' + queryName, fatal: true })
    }
    posts.value = data.value
  }
  return {
      data: posts.value
  }
}


export const useWPData = _useWPData
