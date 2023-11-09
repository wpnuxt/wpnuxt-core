import { ref, computed, useNuxtData, useTokens, useFetch, createError } from "#imports"

const _usePageById = async (id: number, asPreview?: boolean) => {
  const page = ref()
  const cacheKey = computed(() => `page-${id}`)

  const tokens = await useTokens()
  const cachedPage = useNuxtData(cacheKey.value)

  if (cachedPage.data.value) {
    page.value = cachedPage.data.value
  } else {
    const { data, pending, refresh, error } = await useFetch("/api/graphql_middleware/query/PageById/", {
      key: cacheKey.value,
      params: {
        id: id,
        asPreview: asPreview
      },
      headers: {
        Authorization: tokens.authorizationHeader
      },
      transform (data) {
        return data.data.page;
      }
    })
    if (error.value) {
      console.error('usePageById, error: ', error.value)
      throw createError({ statusCode: 500, message: 'Error fetching PageById', fatal: true })
    }
    page.value = data.value
  }
  return {
    data: page.value
  }
}

export const usePageById = _usePageById
