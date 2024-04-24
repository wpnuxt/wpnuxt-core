import { getContentNodes } from './useWPContent'
import type { GeneralSettings } from '#graphql-operations'

const _useGeneralSettings = async (): Promise<GeneralSettings> => {
  return getContentNodes<GeneralSettings>('GeneralSettings', 'generalSettings')
}

export const useGeneralSettings = _useGeneralSettings
