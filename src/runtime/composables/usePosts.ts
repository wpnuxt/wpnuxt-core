import { useNuxtData, ref, useFetch, createError } from "#imports"

const _usePosts = async () => {
    const cacheKey = 'allPosts'
    const cachedPosts = useNuxtData(cacheKey)
    const posts = ref()

    if (cachedPosts.data.value) {
        posts.value = cachedPosts.data.value
    } else {
        const { data, refresh, pending, error } = await useFetch("/api/graphql_middleware/query/Posts", {
            key: cacheKey,
            transform (data: any) {
                return data.data.posts.nodes;
            }
        });
        if (error.value) {
            throw createError({ statusCode: 500, message: 'Error fetching posts', fatal: true })
        }
        posts.value = data.value
    }
    return {
        data: posts.value
    }
}

export const usePosts = _usePosts
