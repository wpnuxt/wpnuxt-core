import type { FetchError } from 'ofetch'
import { getContentNodes } from './useWPContent'
import { useRuntimeConfig } from '#imports'
import type { Menu } from '#graphql-operations'
import type { AsyncData } from '#app'

const _useMenu = async (name?: string): Promise<AsyncData<Menu, FetchError | null>> => {
  const config = useRuntimeConfig()
  const menuName = name && name.length > 0 ? name : config.public.wpNuxt.defaultMenuName
  return getContentNodes<Menu>('Menu', 'menu', 'menuItems', 'nodes', {
    name: menuName,
  })
}

export const useMenu = _useMenu
