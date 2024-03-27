import { useFetch, createError, ref, useNuxtData } from "#imports"
import { useTokens } from "./useTokens";

const _useSettings = async () => {
    const settings = ref()
    const tokens = useTokens()
    const cacheKey = 'settings'
    const { data: cachedSetting } = useNuxtData(cacheKey);

    if (cachedSetting.value) {
      settings.value = cachedSetting.value
    } else {
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
      settings.value = data.value
    }
    return {
        title: settings.value?.title,
        description: settings.value?.description,
        url: settings.value?.url,
        email: settings.value?.email,
        dateFormat: settings.value?.dateFormat,
        language: settings.value?.language,
        startOfWeek: settings.value?.startOfWeek,
        timezone: settings.value?.timezone,
        timeFormat: settings.value?.timeFormat,
    }
}

export const useSettings = _useSettings
