import { useNuxtData, ref, useFetch, createError } from "#imports"

const _usePages = async () => {
    const cacheKey = 'allPages'
    const cachedPages = useNuxtData(cacheKey)
    const pages = ref()

    if (cachedPages.data.value) {
        pages.value = cachedPages.data.value
    } else {
        const { data, error } = await useFetch("/api/graphql_middleware/query/Pages", {
            key: cacheKey,
            transform (data: any) {
                return data.data.pages.nodes;
            }
        });
        if (error.value) {
            throw createError({ statusCode: 500, message: 'Error fetching pages', fatal: true })
        }
        pages.value = data.value
    }
    return {
        data: pages.value
    }
}

export const usePages = _usePages
