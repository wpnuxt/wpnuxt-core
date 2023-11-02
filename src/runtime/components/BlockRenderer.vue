<script setup lang="ts">
import type { EditorBlock } from '#graphql-operations';
defineProps<{
    blocks: EditorBlock[]
}>();
</script>

<template>
  <Block
    v-for="block, index in blocks"
    :key="index"
    :block="block"
  />
</template>
