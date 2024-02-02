<script setup lang="ts">
const wpUri = useWPUri();
const viewer = await useViewer()
const userName = getCurrentUserName()

const config = useRuntimeConfig()
const wpNuxtConfig = config.public.wpNuxt
</script>

<template>
  <div>
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
  </div>
</template>
