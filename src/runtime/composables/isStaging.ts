import { useRuntimeConfig } from '#imports'

const _isStaging = async () => {
  const config = useRuntimeConfig()
  console.log('isStaging.ts: ', config.public.wpNuxt)
  return config.public.wpNuxt.staging
}
export const isStaging = _isStaging
