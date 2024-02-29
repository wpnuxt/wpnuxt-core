import { useFetch, createError, useTokens } from "#imports"

const _useSettings = async () => {
    const tokens = useTokens()
    const { data, error } = await useFetch("/api/graphql_middleware/query/Settings", {
        headers: {
          Authorization: tokens.authorizationHeader
        },
        transform (data: any) {
            return data.data.generalSettings;
        }
    });
    if (error.value) {
      throw createError({ statusCode: 500, message: 'Error fetching settings', fatal: true })
    }
    return {
        title: data.value?.title,
        description: data.value?.description,
        url: data.value?.url,
        email: data.value?.email,
        dateFormat: data.value?.dateFormat,
        language: data.value?.language,
        startOfWeek: data.value?.startOfWeek,
        timezone: data.value?.timezone,
        timeFormat: data.value?.timeFormat,
    }
}

export const useSettings = _useSettings
