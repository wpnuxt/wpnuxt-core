import { useNuxtData, ref, useFetch, createError } from "#imports"

const _useSettings = async () => {
    const cacheKey = 'settings'
    const cachedSettings = useNuxtData(cacheKey)
    const settings = ref()

    if (cachedSettings.data.value) {
        settings.value = cachedSettings.data.value
    } else {
        const { data, refresh, pending, error } = await useFetch("/api/graphql_middleware/query/Settings", {
            key: cacheKey,
            transform (data: any) {
                return data.data.generalSettings;
            }
        });
        if (error.value) {
          throw createError({ statusCode: 500, message: 'Error fetching settings', fatal: true })
        }
        settings.value = data.value
    }
    return {
        title: settings.value?.title,
        url: settings.value?.url
    }
}

export const useSettings = _useSettings
