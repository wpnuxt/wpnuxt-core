<script setup lang="ts">
import { ref, useRuntimeConfig } from '#imports';

const config = useRuntimeConfig();
const wpUrl = config.public.wpNuxt.wordpressUrl
const props = defineProps<{
    url: string
    width?: number
    height?: number
}>();
const imgUrl = ref(props.url)
if (imgUrl.value.indexOf(wpUrl) > -1) {
    imgUrl.value = imgUrl.value.replace(wpUrl, '')
}
</script>

<template>
  <NuxtImg
    v-if="imgUrl"
    :src="imgUrl"
    :width="width"
    :height="height"
  />
</template>
