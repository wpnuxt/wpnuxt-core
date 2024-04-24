import { getContentNodes } from './useWPContent'
import type { SettingsQuery } from '#graphql-operations'

const _useSettings = async () => {
  return getContentNodes<SettingsQuery>('Settings', 'generalSettings')
}

export const useSettings = _useSettings
