import { useRuntimeConfig } from "#imports"
import { getContentNodes } from "./useWPContent";

const _useMenu = async (name?: string) => {

  const config = useRuntimeConfig()
  const menuName = name && name.length > 0 ? name : config.public.wpNuxt.defaultMenuName
  return getContentNodes('Menu', 'menu', 'menuItems', 'nodes', {
    name: menuName
  })
}

export const useMenu = _useMenu
