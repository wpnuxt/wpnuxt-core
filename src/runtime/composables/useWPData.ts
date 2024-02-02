import { useNuxtData, ref, useFetch, createError } from "#imports"

const _useWPData = async (name: string) => {
    const cacheKey = name
    const cachedData = useNuxtData(cacheKey)
    const wpData = ref()

    if (cachedData.data.value) {
        wpData.value = cachedData.data.value
    } else {
        const { data, error } = await useFetch("/api/graphql_middleware/query/" + name, {
            key: cacheKey,
            transform (data: any) {
                return data.data[name.toLowerCase()].nodes;
            }
        });
        if (error.value) {
            console.error(error.value)
            throw createError({ statusCode: 500, message: 'Error fetching ' + name, fatal: true })
        }
        console.log(data.value)
        wpData.value = data.value
    }
    return {
        data: wpData.value
    }
}


export const useWPData = _useWPData
