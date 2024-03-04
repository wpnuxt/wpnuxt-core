import { useFetch, createError, useRuntimeConfig, ref, useNuxtData, useNuxtApp, computed } from "#imports"
import { useTokens } from "./useTokens"
import { useWPNuxtLogger } from "./useWPNuxtlogger";

const _useMenu = async (name?: string) => {
    const menu = ref()
    const logger = useWPNuxtLogger()
    const config = useRuntimeConfig()
    const nuxtApp = useNuxtApp()
    const menuName = name && name.length > 0 ? name : config.public.wpNuxt.defaultMenuName
    const tokens = useTokens()
    const cacheKey = 'menu-' + menuName
    const { data: cachedMenu } = useNuxtData(cacheKey);

    if (cachedMenu.value) {
      menu.value = cachedMenu.value
    } else {
      const { data, error } = await useFetch<any>('/api/graphql_middleware/query/Menu', {
          params: {
            name: menuName
          },
          key: cacheKey,
          headers: {
            Authorization: tokens.authorizationHeader
          },
          transform (data: any) {
              return data.data.menu.menuItems.nodes;
          },
          getCachedData(key: string) {
            return nuxtApp.payload.data[key] || nuxtApp.static.data[key]
          }
      });
      if (error.value) {
          logger.error('useMenu, error: ', error.value)
          throw createError({ statusCode: error.value.status, message: error.value.message, fatal: true })
      }
      menu.value = data.value
    }
    return {
      data: menu.value
    }
}

export const useMenu = _useMenu
