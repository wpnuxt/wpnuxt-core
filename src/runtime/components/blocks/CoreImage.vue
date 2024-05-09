<script setup lang="ts">
import { getRelativeImagePath } from '../../util/images';
import type { CoreImage } from '#graphql-operations'

const props = defineProps<{
  block: CoreImage
}>()
const imgUrl = getRelativeImagePath(props.block?.attributes?.url)
</script>

<template>
  <ImageComponent
    v-if="imgUrl"
    :url="imgUrl"
    :alt="block?.attributes?.alt"
    :width="block?.attributes?.width"
    :height="block?.attributes?.height"
  />
  <div
    v-else
    v-html="block?.renderedHtml"
  />
</template>
