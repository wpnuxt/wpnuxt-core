<script setup lang="ts">
import type { EditorBlock } from '#wpnuxt/blocks'

defineProps<{
  block: EditorBlock
}>()
</script>

<template>
  <p v-html="block.renderedHtml" />
</template>
