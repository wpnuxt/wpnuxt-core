import { defineEventHandler } from 'h3'
import { purgeCache } from '../storage'

export default defineEventHandler(async () => {
  purgeCache()
  return {
    data: 'Cache purged!',
    errors: [],
  }
})
