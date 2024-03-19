import { useFetch, createError } from "#imports"
import { getRelativeImagePath } from "../util/images";
import { useTokens } from "./useTokens";
import { useWPNuxtLogger } from "./useWPNuxtlogger";

const _usePageById = async (id: number, asPreview?: boolean) => {
  const logger = useWPNuxtLogger()
  const tokens = useTokens()

  const { data, error } = await useFetch("/api/graphql_middleware/query/PageById/", {
    params: {
      id: id,
      asPreview: asPreview
    },
    headers: {
      Authorization: tokens.authorizationHeader
    },
    transform (data: any) {
      if(data?.data?.page?.featuredImage?.node?.sourceUrl) {
        data.data.page.featuredImage.node.relativePath =
          getRelativeImagePath(data.data.page.featuredImage.node.sourceUrl)
      }
      return data?.data?.page
    }
  })
  if (error.value) {
    logger.error('usePageById, error: ', error.value)
    throw createError({ statusCode: error.value.status, message: error.value.message, fatal: true })
  }

  return {
    data: data.value
  }
}

export const usePageById = _usePageById
