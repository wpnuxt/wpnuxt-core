import type { FetchError } from 'ofetch'
import { getContentNodes } from './useWPContent'
import type { GeneralSettings } from '#graphql-operations'
import type { AsyncData } from '#app'

const _useGeneralSettings = async (): Promise<AsyncData<GeneralSettings, FetchError | null>> => {
  return getContentNodes<GeneralSettings>('GeneralSettings', 'generalSettings')
}

export const useGeneralSettings = _useGeneralSettings
