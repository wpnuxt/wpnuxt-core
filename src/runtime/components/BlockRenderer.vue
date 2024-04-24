<script setup lang="ts">
import BlockComponent from './BlockComponent.vue'
import type { EditorBlock } from '#graphql-operations'

defineProps<{
  blocks: EditorBlock[]
}>()
</script>

<template>
  <BlockComponent
    v-for="block, index in blocks"
    :key="index"
    :block="block"
  />
</template>
