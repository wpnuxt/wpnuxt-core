<script setup>
const title = 'Playground'
const description = 'Try the WPNuxt module.'
useSeoMeta({
  title: `${title} - WPNuxt Playground`,
  ogTitle: 'WPNuxt Playground',
  description
})
defineOgImage({
  component: 'Docs',
  title,
  description
})
</script>

<template>
  <div class="h-[calc(100vh-var(--header-height))] flex dark:bg-gray-950">
    <ClientOnly>
      <iframe
        class="dark:bg-gray-950"
        :src="`https://stackblitz.com/github/vernaillen/wpnuxt-demo`"
        width="100%"
        height="100%"
      />
    </ClientOnly>
  </div>
</template>
