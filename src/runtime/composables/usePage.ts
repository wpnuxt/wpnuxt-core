import { ref, computed, useNuxtData, useTokens, useFetch, createError, useWPNuxtLogger } from "#imports"

const _usePageById = async (id: number, asPreview?: boolean) => {
  const logger = useWPNuxtLogger()
  const page = ref()
  //const cacheKey = computed(() => `page-${id}`)

  const tokens = useTokens()
  //const cachedPage = useNuxtData(cacheKey.value)

  /*if (cachedPage.data.value) {
    page.value = cachedPage.data.value
  } else {*/
    const { data, pending, refresh, error } = await useFetch("/api/graphql_middleware/query/PageById/", {
      //key: cacheKey.value,
      params: {
        id: id,
        asPreview: asPreview
      },
      headers: {
        Authorization: tokens.authorizationHeader
      },
      transform (data) {
        return data?.data?.page;
      }
    })
    if (error.value) {
      logger.error('usePageById, error: ', error.value)
      throw createError({ statusCode: 500, message: 'Error fetching PageById', fatal: true })
    }
    logger.debug('usePageById: fetched page from WordPress: ', data.value.title)
    page.value = data.value
  //}
  return {
    data: page.value
  }
}

export const usePageById = _usePageById
