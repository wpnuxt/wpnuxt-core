<script setup lang="ts">
import type { MenuItemFragment } from '#wpnuxt'
import { useMenu } from '#wpnuxt'

const { data: menu } = await useMenu({ name: 'main' })

let wpLinks: MenuItemFragment[] = []
if (menu.value) {
  wpLinks = menu.value?.map(link => ({
    label: link.label,
    to: link.uri
  }))
}
const links = [
  {
    label: 'Blog',
    to: '/'
  },
  ...wpLinks,
  {
    label: 'WPNuxt tools',
    children: [
      {
        label: 'Composables',
        to: '/composables'
      },
      {
        label: 'Config',
        to: '/config'
      },
      {
        label: 'Test Error Page',
        to: '/errorPage'
      }
    ]
  }
]
</script>

<template>
  <UHeader :links="links">
    <template #logo>
      <WPNuxtLogo /> <span class="text-lg">playground</span>
    </template>
    <template #right>
      <UColorModeButton />
    </template>
  </UHeader>
</template>
