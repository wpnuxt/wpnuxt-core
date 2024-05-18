import { type LogLevel, createConsola } from 'consola'
import { ref } from 'vue'
import type { WPNuxtConfig } from './types'

const loggerRef = ref()

export const initLogger = (logLevel: LogLevel | undefined) => {
  loggerRef.value = createConsola({
    level: logLevel ? logLevel : 3,
    formatOptions: {
      colors: true,
      compact: true,
      date: true,
      fancy: true
    }
  })
  return loggerRef.value
}

export const getLogger = () => {
  if (loggerRef.value) {
    return loggerRef.value
  }
}

/**
 * Validate the module options.
 */
export function validateConfig(options: Partial<WPNuxtConfig>) {
  if (!options.wordpressUrl || options.wordpressUrl.length === 0) {
    getLogger().error('WordPress url is missing')
    throw new Error('WordPress url is missing')
  }
}
