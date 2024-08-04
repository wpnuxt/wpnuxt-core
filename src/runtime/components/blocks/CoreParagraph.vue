<script setup lang="ts">
import type { CoreParagraph } from '#wpnuxt/blocks'

defineProps<{
  block: CoreParagraph
}>()
</script>

<template>
  <div>
    <p v-sanitize="block?.attributes?.content" />
  </div>
</template>
