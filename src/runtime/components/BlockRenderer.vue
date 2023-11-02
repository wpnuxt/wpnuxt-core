<script setup lang="ts">
import type { EditorBlock } from '#graphql-operations';
import BlockComponent from './BlockComponent.vue';
defineProps<{
    blocks: EditorBlock[]
}>();
</script>

<template>
  <BlockComponent
    v-for="block, index in blocks"
    :key="index"
    :block="block"
  />
</template>
