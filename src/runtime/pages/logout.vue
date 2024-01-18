<script setup lang="ts">
import { useCookie, useRuntimeConfig } from '#imports';
const config = useRuntimeConfig();
const rtCookie = useCookie(`${config.public.wpNuxt.frontendUrl}-rt`)
rtCookie.value = null;
</script>

<template>
  <div>
    logout
  </div>
</template>
