<script setup lang="ts">
const config = useRuntimeConfig()
const stagingUrl = config.public.wpNuxt.stagingUrl
const { data: menu } = await useMenu('main')
const userName = ref<string>()
userName.value = getCurrentUserName()
watch(() => getCurrentUserName(), (newVal) => {
  userName.value = newVal
})
const wpLinks = menu.map(page => ({
  label: page.label,
  to: page.uri,
}))
const links = [
  ...wpLinks,
  {
    label: 'Test',
    to: '/test',
  },
]
const staging = await isStaging()
</script>

<template>
  <StagingBanner v-if="staging" />
  <div :class="staging ? 'mt-[34px]' : 'mt-0'">
    <UHeader :links="links">
      <template #logo>
        <WPNuxtLogo /> <span class="text-lg">playground</span>
      </template>
      <template #right>
        <UColorModeButton variant="soft" />
        <UButton
          v-if="!staging"
          :to="stagingUrl"
          icon="i-heroicons-pencil"
          variant="soft"
          size="sm"
        >
          Staging
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
  </div>
</template>
