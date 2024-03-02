import { useFetch, createError, useRuntimeConfig, ref, useNuxtData, } from "#imports"
import { useTokens } from "./useTokens";
import { useWPNuxtLogger } from "./useWPNuxtlogger";

const _useMenu = async (name?: string) => {
    const menu = ref()
    const logger = useWPNuxtLogger()
    const config = useRuntimeConfig()
    const menuName = name && name.length > 0 ? name : config.public.wpNuxt.defaultMenuName
    const tokens = useTokens()
    const cacheKey =  'menu-' + menuName
    const cachedMenu = useNuxtData(cacheKey)

    if (cachedMenu.data.value) {
      menu.value = cachedMenu.data.value
    } else {
      const { data, error } = await useFetch('/api/graphql_middleware/query/Menu', {
          params: {
            name: menuName
          },
          headers: {
            Authorization: tokens.authorizationHeader
          },
          transform (data: any) {
              return data.data.menu.menuItems.nodes;
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
