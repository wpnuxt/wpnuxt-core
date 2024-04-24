import { prefixStorage, type Storage } from 'unstorage'
import { useWPNuxtLogger } from '../composables/useWPNuxtLogger'
import { useStorage } from '#imports'

export const cacheStorage: Storage = prefixStorage(useStorage(), 'cache:content')

export const purgeCache = async () => {
  const keys = await cacheStorage.getKeys()
  keys.forEach(async (key) => {
    await cacheStorage.removeItem(key)
  })
  cacheStorage.clear
  useWPNuxtLogger().info('ServerSide cache purged!')
}
