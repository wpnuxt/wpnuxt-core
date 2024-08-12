<script setup lang="ts">
import { createError, usePostByUri } from '#imports'

const { data: post } = await usePostByUri({ uri: 'missingUriForTesting' })
if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}
</script>

<template>
  <NuxtLayout>
    <UContainer class="prose dark:prose-invert pt-5">
      You should never see this<br>
      {{ post }}
    </UContainer>
  </NuxtLayout>
</template>
