import { initLogger, getLogger } from '../../utils'
import { useRuntimeConfig } from '#imports'

export const useLogger = () => {
  const logger = getLogger()
  if (logger) {
    return logger
  } else {
    const config = useRuntimeConfig()
    return initLogger(config.public.wpNuxt.logLevel ? config.public.wpNuxt.logLevel : 3)
  }
}
