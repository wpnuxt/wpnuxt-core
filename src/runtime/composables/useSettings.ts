import { getContentNodes } from "./useWPContent"

const _useSettings = async () => {

  return getContentNodes('Settings', 'generalSettings')
}

export const useSettings = _useSettings
