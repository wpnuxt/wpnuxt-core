import { useNuxtData, ref, useFetch, createError, useTokens } from "#imports"

const _useViewer = async () => {
  const cacheKey = 'viewer'
  const cachedViewer = useNuxtData(cacheKey)
  const viewer = ref()
  const tokens = useTokens()

  if (cachedViewer.data.value) {
    viewer.value = cachedViewer.data.value
  } else {
    const { data, refresh, pending, error } = await useFetch("/api/graphql_middleware/query/Viewer", {
      key: cacheKey,
      headers: {
        Authorization: tokens.authorizationHeader
      },
      transform (data: any) {
        return data.data.viewer;
      }
    });
    if (error.value) {
      throw createError({ statusCode: 500, message: 'Error fetching viewer', fatal: true })
    }
    viewer.value = data.value
  }
  return {
    username: viewer.value?.username,
    userId: viewer.value?.userId,
    id: viewer.value?.id,
    email: viewer.value?.email,
    description: viewer.value?.description,
    firstName: viewer.value?.firstName,
    lastName: viewer.value?.lastName,
    locale: viewer.value?.locale,
    url: viewer.value?.url,
    uri: viewer.value?.uri
  }
}

export const useViewer = _useViewer
