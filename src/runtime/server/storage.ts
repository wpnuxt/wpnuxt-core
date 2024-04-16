import { prefixStorage, type Storage } from 'unstorage'
import { useStorage } from '#imports'
import { useWPNuxtLogger } from '../composables/useWPNuxtLogger'

//const isProduction = process.env.NODE_ENV === 'production'

export const cacheStorage: Storage = prefixStorage(useStorage(), 'cache:content')

export const purgeCache = async () => {
  const keys = await cacheStorage.getKeys()
  keys.forEach(async (key) => {
      await cacheStorage.removeItem(key)
  })
  cacheStorage.clear
  useWPNuxtLogger().info('ServerSide cache purged!')
}

/*const pendingPromises: Record<string, Promise<WordPressContent>> = {}
export const getContent = async (event: H3Event, id: string): Promise<WordPressContent> => {
  const contentId = id

  const cached: any = await cacheStorage.getItem(id)
  if (isProduction && cached) {
    return cached.parsed
  }
  const hash = ohash({
    // Last modified time
    mtime,
    // File size
    size,
    // Add Content version to the hash, to revalidate the cache on content update
    version: wpNuxtConfig.cacheVersion,
    integrity: wpNuxtConfig.cacheIntegrity
  })
  if (!pendingPromises[id]) {
    // eslint-disable-next-line no-async-promise-executor
    pendingPromises[id] = new Promise(async (resolve) => {
      const content = await cacheStorage.getItem(id)

      if (content === null) {
        return resolve({ _id: contentId, body: null } as unknown as WordPressContent)
      }

      await cacheStorage.setItem(id, { parsed }).catch(() => {})

      resolve(parsed)

      delete pendingPromises[id]
    })
  }
  return pendingPromises[id]
}*/

