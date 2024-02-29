import { useFetch, createError, useTokens } from "#imports"

const _useRevisions = async () => {
    const tokens = useTokens()

    const { data, error } = await useFetch("/api/graphql_middleware/query/Revisions", {
        headers: {
          Authorization: tokens.authorizationHeader
        },
        transform (data: any) {
            return data;
        }
    });
    if (error.value) {
      throw createError({ statusCode: 500, message: 'Error fetching revisions', fatal: true })
    }
    return {
        data
    }
}

export const useRevisions = _useRevisions
