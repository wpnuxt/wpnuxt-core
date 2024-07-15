<script setup lang="ts">
import BlockComponent from './BlockComponent.vue'
import type { EditorBlock } from '#wpnuxt/blocks'

defineProps<{
  blocks: EditorBlock[]
}>()
</script>

<template>
  <div>
    <BlockComponent
      v-for="block, index in blocks"
      :key="index"
      :block="block"
    />
  </div>
</template>
