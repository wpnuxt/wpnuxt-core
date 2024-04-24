import { getContentNodes } from './useWPContent'
import { useRuntimeConfig } from '#imports'
import type { Menu } from '#graphql-operations'

const _useMenu = async (name?: string): Promise<Menu> => {
  const config = useRuntimeConfig()
  const menuName = name && name.length > 0 ? name : config.public.wpNuxt.defaultMenuName
  return getContentNodes<Menu>('Menu', 'menu', 'menuItems', 'nodes', {
    name: menuName,
  })
}

export const useMenu = _useMenu
