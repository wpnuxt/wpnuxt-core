import { useRuntimeConfig } from '#imports'
import { createConsola } from 'consola'
import { ref } from 'vue'

const logger = ref()

export function useWPNuxtLogger () {
  const config = useRuntimeConfig()
  if (!logger.value) initLogger(config.public.wpNuxt.debug)
  return logger.value
}

export function initLogger (debug: boolean) {
  logger.value = createConsola({
    level:  debug ? 4 : 3,
    fancy: true,
    formatOptions: {
         // columns: 80,
         colors: true,
         compact: true,
         date: true,
    },
  }).withTag('WPNuxt')
  logger.value.info("initLogger ::: ", debug)
}
