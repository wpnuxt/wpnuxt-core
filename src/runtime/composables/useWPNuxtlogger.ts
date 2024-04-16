import { useRuntimeConfig } from '#imports'
import { createConsola } from 'consola'
import { ref } from 'vue'

const logger = ref()

export function useWPNuxtLogger () {
  const config = useRuntimeConfig()
  if (!logger.value) {
    const level = config.public.wpNuxt.trace ? 5 : config.public.wpNuxt.debug ? 4 : 3
    initLogger(level)
  }
  return logger.value
}

export function initLogger (level: number) {
  logger.value = createConsola({
    level,
    formatOptions: {
         // columns: 80,
         colors: true,
         compact: true,
         date: true,
    },
  }).withTag('WPNuxt')
  logger.value.debug("initLogger ::: level:", level)
}
//
