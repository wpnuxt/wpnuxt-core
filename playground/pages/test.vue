<script setup lang="ts">
import { getCurrentUserName, isStaging, useGeneralSettings, useRuntimeConfig, useViewer, useWPUri } from '#imports'

const wpUri = useWPUri()
const { data: viewer } = await useViewer()
const { data: settings } = await useGeneralSettings()
const staging = await isStaging()
const userName = getCurrentUserName()

const config = useRuntimeConfig()
const wpNuxtConfig = config.public.wpNuxt
</script>

<template>
  <div>
    <UContainer class="prose dark:prose-invert pt-5">
      <h2>wpUri:</h2>
      <pre>{{ wpUri }}</pre>
      <h2>wpNuxtConfig:</h2>
      <pre>{{ wpNuxtConfig }}</pre>
      <h2>await useViewer()</h2>
      <pre>{{ viewer }}</pre>
      <h2>getCurrentUserName()</h2>
      <pre>{{ userName }}</pre>
      <h2>isStaging()</h2>
      <pre>{{ staging }}</pre>
      <h2>useGeneralSettings()</h2>
      <pre>{{ settings }}</pre>
    </UContainer>
  </div>
</template>
