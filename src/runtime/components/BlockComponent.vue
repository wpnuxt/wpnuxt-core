<script setup lang="ts">
import { pascalCase } from 'scule'
import { resolveComponent, useRuntimeConfig } from '#imports'
import type { EditorBlock } from '#wpnuxt/blocks'

const manifest = await import('#wpnuxt/blocks').catch(() => ({}))

const config = useRuntimeConfig()
const showBlockInfo = config.public.wpNuxt.showBlockInfo

const props = defineProps<{
  block: EditorBlock
}>()
const findComponentToRender = async () => {
  // only process top level blocks
  if (props.block.parentClientId === null || props.block.parentClientId === undefined) {
    if (config.public.wpNuxt.blocks && props.block.name) {
      const componentName = pascalCase(props.block.name)
      const componentImporter = manifest[componentName]
      if (typeof componentImporter === 'function') {
        return await componentImporter()
      }
    }
    return resolveComponent('EditorBlock')
  } else {
    return undefined
  }
}
const componentToRender = await findComponentToRender()
</script>

<template>
  <LazyBlockInfo
    v-if="componentToRender && showBlockInfo"
    :block="block"
    :component-to-render="componentToRender"
  />
  <component
    :is="componentToRender"
    v-if="componentToRender"
    :block="block"
  />
</template>
