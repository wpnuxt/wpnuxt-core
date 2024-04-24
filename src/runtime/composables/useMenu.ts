import { getContentNodes } from './useWPContent'
import { useRuntimeConfig } from '#imports'

const _useMenu = async (name?: string) => {
  const config = useRuntimeConfig()
  const menuName = name && name.length > 0 ? name : config.public.wpNuxt.defaultMenuName
  return getContentNodes('Menu', 'menu', 'menuItems', 'nodes', {
    name: menuName,
  })
}

export const useMenu = _useMenu
