<script setup lang="ts">
const route = useRoute()

useServerSeoMeta({
  ogSiteName: 'WPNuxt',
  twitterCard: 'summary_large_image'
})

useHead({
  htmlAttrs: {
    lang: 'en'
  }
})

const links = [{
  label: 'Documentation',
  icon: 'i-heroicons-book-open-solid',
  to: '/get-started/installation'
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

const { data: files } = useLazyFetch('/api/search.json', {
  default: () => [],
  server: false
})

const { data: nav } = await useAsyncData('navigation', () => fetchContentNavigation())

const navigation = computed(() => {
  const main = nav.value?.filter(item => item._path !== '/v1')
  const v1 = nav.value?.find(item => item._path === '/v1')?.children

  return route.path.startsWith('/v1/') ? v1 : main
})

// Provide
provide('navigation', navigation)
</script>

<template>
  <UHeader :links="links">
    <template #logo>
      <LogoComponent class="h-6 w-auto" />
    </template>

    <template #right>
      <UColorModeButton v-if="!$colorMode.forced" />
      <UButton
        aria-label="WPNuxt on GitHub"
        icon="i-simple-icons-github"
        to="https://github.com/vernaillen/wpnuxt-module"
        target="_blank"
        color="gray"
        variant="ghost"
      />
    </template>
    <!-- Mobile panel -->
    <template
      v-if="$route.path !== '/'"
      #panel
    >
      <LazyUDocsSearchButton
        size="md"
        class="mb-4 w-full"
      />
      <LazyUNavigationTree
        :links="mapContentNavigation(navigation!)"
        default-open
        :multiple="false"
      />
    </template>
  </UHeader>

  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

  <UFooter :links="links">
    <template #left>
      <span class="text-sm">
        Published under <NuxtLink
          to="https://github.com/vernaillen/wpnuxt-module"
          target="_blank"
          class="underline"
        >
          MIT License
        </NuxtLink>
      </span>
    </template>
    <template #right>
      <UColorModeButton v-if="!$colorMode.forced" />
      <UButton
        aria-label="WPNuxt on GitHub"
        icon="i-simple-icons-github"
        to="https://github.com/vernaillen/wpnuxt-module"
        target="_blank"
        color="gray"
        variant="ghost"
      />
    </template>
  </UFooter>
  <ClientOnly>
    <LazyUDocsSearch
      :files="files"
      :navigation="navigation"
      :links="links"
    />
  </ClientOnly>
</template>
