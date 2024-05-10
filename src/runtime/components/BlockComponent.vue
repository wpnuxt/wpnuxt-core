<script setup lang="ts">
import { computed, resolveComponent, useRuntimeConfig } from '#imports'
import type { EditorBlock } from '#graphql-operations'

const config = useRuntimeConfig()
const showBlockInfo = config.public.wpNuxt.showBlockInfo

const props = defineProps<{
  block: EditorBlock
}>()
const componentToRender = computed(() => {
  if (props.block.parentClientId === null || props.block.parentClientId === undefined) {
    if (props.block.name === 'core/paragraph') {
      return resolveComponent('CoreParagraph')
    } else if (props.block.name === 'core/image') {
      return resolveComponent('CoreImage')
    } else if (props.block.name === 'core/gallery') {
      return resolveComponent('CoreGallery')
    } else if (props.block.name === 'core/quote') {
      return resolveComponent('CoreQuote')
    } else {
      return resolveComponent('EditorBlock')
    }
  } else {
    return undefined
  }
})
</script>

<template>
  <BlockAttr
    v-if="componentToRender && showBlockInfo"
    :block="block"
  />
  <component
    :is="componentToRender"
    v-if="componentToRender"
    :block="block"
  />
</template>
