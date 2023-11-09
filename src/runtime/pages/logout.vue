<script setup lang="ts">
import { useCookie, useRuntimeConfig } from '#imports';
const config = useRuntimeConfig();
const rtCookie = useCookie(`${config.public.frontendSiteUrl}-rt`)
rtCookie.value = null;
</script>

<template>
  <div>
    logout
  </div>
</template>
