import { prefixStorage, type Storage } from 'unstorage'
import { useLogger } from '../util/logger'
import { useStorage } from '#imports'

export const cacheStorage: Storage = prefixStorage(useStorage(), 'cache:wpnuxt-content')

export const purgeCache = async () => {
  const keys = await cacheStorage.getKeys('cache:wpnuxt-content')
  keys.forEach(async (key) => {
    await cacheStorage.removeItem(key)
  })
  useLogger().info('ServerSide cache purged!')
}
