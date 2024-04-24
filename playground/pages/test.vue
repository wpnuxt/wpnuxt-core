<script setup lang="ts">
const wpUri = useWPUri()
const viewer = await useViewer()
const settings = await useSettings()
const revisions = await useRevisions()
const staging = await isStaging()
const userName = getCurrentUserName()

const config = useRuntimeConfig()
const wpNuxtConfig = config.public.wpNuxt
</script>

<template>
  <div>
    <UContainer class="prose dark:prose-invert">
      <h2>wpUri:</h2>
      {{ wpUri }}
      <h2>wpNuxtConfig:</h2>
      {{ wpNuxtConfig }}

      <h2>useRuntimeConfig():</h2>
      {{ useRuntimeConfig() }}

      <h2>await useViewer()</h2>
      {{ viewer }}
      <h2>getCurrentUserName()</h2>
      {{ userName }}
      <UDivider />
      <h2>isStaging()</h2>
      <pre>{{ staging }}</pre>

      <UDivider />
      <h2>useSettings()</h2>
      <pre>{{ settings }}</pre>

      <UDivider />
      <h2>useRevisions()</h2>
      <pre>{{ revisions }}</pre>
    </UContainer>
  </div>
</template>
