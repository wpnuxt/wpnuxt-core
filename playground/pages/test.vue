<script setup lang="ts">
const wpUri = useWPUri();

const config = useRuntimeConfig()
const wpNuxtConfig = config.public.wpNuxt
</script>

<template>
  <div>
    <h2>wpUri:</h2>
    {{ wpUri }}
    <h2>wpNuxtConfig:</h2>
    {{ wpNuxtConfig }}

    <h2>useRuntimeConfig().public:</h2>
    {{ useRuntimeConfig().public }}
  </div>
</template>
