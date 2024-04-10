import { useFetch, useRuntimeConfig, ref, useNuxtData, useNuxtApp } from "#imports"
import { useTokens } from "./useTokens"
import type { GraphqlResponse } from "~/src/types";

const _useMenu = async (name?: string) => {
    const config = useRuntimeConfig()
    const nuxtApp = useNuxtApp()
    const menuName = name && name.length > 0 ? name : config.public.wpNuxt.defaultMenuName
    const tokens = useTokens()
    const cacheKey = 'menu-' + menuName
    const { data: cachedMenu } = useNuxtData(cacheKey);

    if (cachedMenu.value) {
      return  {
        data: cachedMenu.value,
        errors: null,
      }
    } else {
      return useFetch<GraphqlResponse<any>>("/api/graphql_middleware/query/Menu", {
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
      }).then((v: GraphqlResponse<any>) => {
        return {
          data: v.data.value,
          errors: v.errors || [],
        }
      })
    }
}

export const useMenu = _useMenu
