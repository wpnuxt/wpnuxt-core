const _useWPNuxt = () => {

  return {
    isStaging: process.env.NODE_ENV === 'development'
      || process.env.NODE_ENV === 'staging'
      || process.env.STAGING === 'true',
  }
}

export const useWPNuxt = _useWPNuxt
