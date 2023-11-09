<script setup lang="ts">
const pages = await usePages()
const viewer = await useViewer()
const links = pages.data.map((page) => ({
  label: page.title,
  to: page.uri
}))
</script>

<template>
  <UHeader :links="links">
    <template #logo>
      <WPNuxtLogo /> <span class="text-lg">playground</span>
    </template>
    <template #right>
      <UColorModeButton variant="soft" />
      <UButton
        to="/auth"
        icon="i-heroicons-user"
        variant="soft"
        size="xs"
      >
        <span
          v-if="viewer?.username"
          class="ml-2"
        >
          {{ viewer.username }}
        </span>
        <span
          v-else
          class="text-sm"
        >Sign in</span>
      </UButton>
    </template>
  </UHeader>
  <UMain>
    <NuxtPage />
  </UMain>
  <UFooter :links="links">
    <template #left>
      <span class="text-sm">a Proof of Concept by <NuxtLink
        href="https://vernaillen.dev"
        target="_blank"
      >Wouter Vernaillen</NuxtLink></span>
    </template>
  </UFooter>
</template>
