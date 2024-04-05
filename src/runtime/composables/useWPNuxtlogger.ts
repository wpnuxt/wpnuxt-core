import { useRuntimeConfig } from '#imports'
import { createConsola } from 'consola'
import { ref } from 'vue'

const logger = ref()

export function useWPNuxtLogger () {
  const config = useRuntimeConfig()
  if (!logger.value) initLogger(config.public.wpNuxt.debug ? config.public.wpNuxt.debug : false)
  return logger.value
}

export function initLogger (debug: boolean) {
  logger.value = createConsola({
    level:  debug ? 4 : 3,
    formatOptions: {
         // columns: 80,
         colors: true,
         compact: true,
         date: true,
    },
  }).withTag('WPNuxt')
  logger.value.debug("initLogger ::: debug:", debug)
}
