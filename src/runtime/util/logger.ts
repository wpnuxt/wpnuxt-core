import { createConsola, type LogLevel } from 'consola'
import { ref } from 'vue'
import { useRuntimeConfig } from '#imports'

const loggerRef = ref()

export const useLogger = () => {
  const logger = loggerRef.value
  if (logger) {
    return logger
  } else {
    const config = useRuntimeConfig()
    return initLogger(config.public.wpNuxt.logLevel ? config.public.wpNuxt.logLevel : 3)
  }
}

export const initLogger = (logLevel: LogLevel | undefined) => {
  loggerRef.value = createConsola({
    level: logLevel ? logLevel : 3,
    formatOptions: {
      colors: true,
      compact: true,
      date: true,
      fancy: true
    }
  }).withTag('wpnuxt')
  return loggerRef.value
}
