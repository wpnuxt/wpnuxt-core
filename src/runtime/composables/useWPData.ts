import { useFetch, createError, useTokens } from "#imports"

const _useWPData = async (name: string) => {
  const tokens = useTokens()

  const { data, error } = await useFetch("/api/graphql_middleware/query/" + name, {
    headers: {
      Authorization: tokens.authorizationHeader
    },
    transform (data: any) {
        return data.data[name.toLowerCase()].nodes;
    }
  });
  if (error.value) {
      console.error(error.value)
      throw createError({ statusCode: 500, message: 'Error fetching ' + name, fatal: true })
  }
  return {
      data: data.value
  }
}


export const useWPData = _useWPData
