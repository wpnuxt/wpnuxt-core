<script setup lang="ts">
import type { CoreButtons, EditorBlock } from '#wpnuxt/blocks'

defineProps<{
  block: CoreButtons
}>()
</script>

<template>
  <div
    v-for="innerBlock, index in block.innerBlocks"
    :key="index"
  >
    <CoreButton
      v-if="innerBlock.name === 'core/button'"
      :block="innerBlock"
    />
    <EditorBlock
      v-else
      :block="innerBlock"
    />
  </div>
</template>
