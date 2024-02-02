<script setup lang="ts">
const menu = await useMenu('main')
const userName = ref<String>()
userName.value = getCurrentUserName()
watch(() => getCurrentUserName(), (newVal) => {
    userName.value = newVal
})
const wpLinks = menu.menu.value.map((page) => ({
  label: page.label,
  to: page.uri
}))
const links = [
  ...wpLinks,
  {
    label: 'Test',
    to: '/test'
  }
]
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
        size="sm"
      >
        <span
          v-if="userName"
          class="ml-2"
        >
          {{ userName }}
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
