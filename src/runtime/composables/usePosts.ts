import { useNuxtData, ref, useFetch, createError , useGraphqlQuery } from "#imports"

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
const _useLatestPost = async () => {
    const cacheKey = 'latestPost'
    const cachedPosts = useNuxtData(cacheKey)
    const post = ref()

    if (cachedPosts.data.value) {
        post.value = cachedPosts.data.value
        console.log('useLatestPost, got post from cache: ', post.value)
    } else {
        const { data, refresh, pending, error } = await useFetch("/api/graphql_middleware/query/LatestPost", {
            key: cacheKey,
            transform (data: any) {
                return data.data.posts.nodes[0];
            }
        });
        if (error.value) {
            throw createError({ statusCode: 500, message: 'Error fetching latest post', fatal: true })
        }
        console.log('useLatestPost, successfully fetched post: ', data.value)
        post.value = data.value
    }
    return {
        data: post.value
    }
}


export const useLatestPost = _useLatestPost
export const usePosts = _usePosts
