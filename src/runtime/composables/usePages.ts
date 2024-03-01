import { useFetch, createError } from "#imports"
import { useTokens } from "./useTokens";
import { useWPNuxtLogger } from "./useWPNuxtlogger";

const _usePages = async () => {
  const logger = useWPNuxtLogger()
  const tokens = useTokens()

  const { data, error } = await useFetch("/api/graphql_middleware/query/Pages", {
    headers: {
      Authorization: tokens.authorizationHeader
    },
    transform (data: any) {
        return data.data.pages.nodes;
    }
  });
  if (error.value) {
    logger.error('usePages, error: ', error.value)
    throw createError({ statusCode: error.value.status, message: error.value.message, fatal: true })
  }
  return {
    data: data.value
  }
}

export const usePages = _usePages
