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
      <h2>Examples of predefined composables</h2>
      <h3>wpUri:</h3>
      <pre>{{ wpUri }}</pre>
      <h3>wpNuxtConfig:</h3>
      <pre>{{ wpNuxtConfig }}</pre>
      <h3>await useViewer()</h3>
      <pre>{{ viewer }}</pre>
      <h3>getCurrentUserName()</h3>
      <pre>{{ userName }}</pre>
      <h3>isStaging()</h3>
      <pre>{{ staging }}</pre>
      <h3>useGeneralSettings()</h3>
      <pre>{{ settings }}</pre>
    </UContainer>
  </div>
</template>
