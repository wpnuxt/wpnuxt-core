<script setup lang="ts">
import { useMenu } from '#imports'

const { data: menu } = await useMenu('main')

const wpLinks = menu.value?.map(link => ({
  label: link.label,
  to: link.uri,
}))
const links = [
  ...wpLinks,
  {
    label: 'Test',
    to: '/test',
  },
  {
    label: 'Auth',
    to: '/auth',
  },
  {
    label: 'Error Handling',
    to: '/errorHandling',
  },
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
