import { ref, useNuxtData, useFetch, createError, useTokens } from "#imports"

const _useMenu = async (name?: string) => {
    const menu = ref()
    const cacheKey = 'menu-' + name ? name : 'main'
    const cachedMenu = useNuxtData(cacheKey.value)
    const tokens = useTokens()

    console.log('useMenu, slug: ', name)

    if (cachedMenu.data.value) {
        menu.value = cachedMenu.data.value
    } else {
        const { data, error } = await useFetch('/api/graphql_middleware/query/Menu', {
            params: {
              name: name
            },
            key: cacheKey,
            headers: {
              Authorization: tokens.authorizationHeader
            },
            transform (data: any) {
                return data.data.menu.menuItems.nodes;
            }
        });
        if (error.value) {
            throw createError({ statusCode: 500, message: 'Error fetching menu', fatal: true })
        }
        menu.value = data.value
    }
    return {
        menu
    }
}

export const useMenu = _useMenu
