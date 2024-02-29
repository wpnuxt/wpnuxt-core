<script setup lang="ts">
const wpUri = useWPUri();
const viewer = await useViewer()
const settings = await useSettings()
const revisions = await useRevisions()
const userName = getCurrentUserName()

const config = useRuntimeConfig()
const wpNuxtConfig = config.public.wpNuxt
</script>

<template>
  <div>
    <UContainer class="prose">
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
      <h2>useWPNuxt()</h2>
      <pre>{{ useWPNuxt() }}</pre>

      <UDivider />
      <h2>useSettings()</h2>
      <pre>{{ settings }}</pre>

      <UDivider />
      <h2>useRevisions()</h2>
      <pre>{{ revisions }}</pre>
    </UContainer>
  </div>
</template>
