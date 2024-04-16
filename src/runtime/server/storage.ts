import { type StorageValue, prefixStorage, type Storage } from 'unstorage'
import { useNitroApp, useRuntimeConfig, useStorage } from '#imports'
import { hash as ohash } from 'ohash'
import type { H3Event } from 'h3'
import type { WordPressContent } from '../types'

const isProduction = process.env.NODE_ENV === 'production'
const wpNuxtConfig = useRuntimeConfig().wpNuxt

export const cacheStorage: Storage = prefixStorage(useStorage(), 'cache:content')

const pendingPromises: Record<string, Promise<WordPressContent>> = {}
export const getContent = async (event: H3Event, id: string): Promise<WordPressContent> => {
  const contentId = id

  const cached: any = await cacheStorage.getItem(id)
  if (isProduction && cached) {
    return cached.parsed
  }
  /*const hash = ohash({
    // Last modified time
    mtime,
    // File size
    size,
    // Add Content version to the hash, to revalidate the cache on content update
    version: wpNuxtConfig.cacheVersion,
    integrity: wpNuxtConfig.cacheIntegrity
  })*/
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
}
