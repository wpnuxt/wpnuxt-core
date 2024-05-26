<script setup lang="ts">
import type { CoreButton } from '#wpnuxt/blocks'

defineProps<{
  block: CoreButton
}>()
</script>

<template>
  <UButton
    :label="block.attributes.text"
    :to="block.attributes.url"
  />
</template>
