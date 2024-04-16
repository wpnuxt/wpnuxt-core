import { useRuntimeConfig } from '#imports'

const _isStaging = async () => {
  const config = useRuntimeConfig()
  return config.public.wpNuxt.staging
}
export const isStaging = _isStaging
