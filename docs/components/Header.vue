<script setup lang="ts">
import type { NavItem } from '@nuxt/content/dist/runtime/types'

const navigation = inject<NavItem[]>('navigation', [])

const { header } = useAppConfig()

const links = [{
  label: 'Documentation',
  icon: 'i-heroicons-book-open-solid',
  to: '/getting-started/installation'
}, {
  label: 'Demo',
  icon: 'i-ph-monitor',
  to: 'https://demo.wpnuxt.com',
  target: '_blank'
}, {
  label: 'Open Demo in StackBlitz',
  icon: 'i-ph-play-duotone',
  to: 'https://stackblitz.com/github/vernaillen/wpnuxt-demo',
  target: '_blank'
}, {
  label: 'Releases',
  icon: 'i-heroicons-rocket-launch-solid',
  to: 'https://github.com/vernaillen/wpnuxt-module/releases',
  target: '_blank'
}]
</script>

<template>
  <UHeader :links="links">
    <template #logo>
      <LogoComponent class="h-6 w-auto" />
    </template>

    <template #right>
      <UContentSearchButton v-if="header?.search" :label="null" />

      <UColorModeButton v-if="header?.colorMode" />

      <template v-if="header?.links">
        <UButton
          v-for="(link, index) of header.links"
          :key="index"
          v-bind="{ color: 'gray', variant: 'ghost', ...link }"
        />
      </template>
    </template>

    <template #panel>
      <UNavigationTree :links="mapContentNavigation(navigation)" />
    </template>
  </UHeader>
</template>
