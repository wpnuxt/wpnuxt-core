<script setup lang="ts">
import { useRuntimeConfig } from 'nuxt/app'

const config = useRuntimeConfig()
</script>

<template>
  <div>basic <span>{{ config.public.myValue }}</span></div>
</template>
