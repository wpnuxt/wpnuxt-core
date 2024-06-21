<script setup lang="ts">
import type { PageFragment, PostFragment } from '#build/graphql-operations'
import { isStaging, useHead, useRoute, useWPUri, ref, createError, useNodeByUri, useFeaturedImage } from '#imports'

const route = useRoute()
const post = ref<PostFragment | PageFragment | undefined>()
if (route.params.slug && route.params.slug[0]) {
  const { data } = await useNodeByUri({ uri: route.params.slug[0] })
  post.value = data.value
}
if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}
const featuredImage = useFeaturedImage(post.value)
const wpUri = useWPUri()
if (post.value?.title) {
  useHead({
    title: post.value.title
  })
}
const staging = await isStaging()
</script>

<template>
  <div>
    <StagingBanner
      v-if="staging"
      :post="post"
    />
    <UContainer>
      <UPage v-if="post">
        <UPageHeader :title="post.title" />
        <UPageBody class="prose dark:prose-invert">
          <BlockRenderer
            v-if="post.editorBlocks"
            :blocks="post.editorBlocks"
          />
        </UPageBody>
        <template #left>
          <UAside>
            <UButton
              icon="i-heroicons-arrow-left"
              variant="soft"
              size="sm"
              to="/"
            />
            <div
              v-if="featuredImage"
              class="test-sm mt-10"
            >
              featured image:
              <NuxtImg
                :src="featuredImage"
                class="rounded-lg shadow-md mt-2"
              />
            </div>
            <div class="test-sm mt-10">
              published:<br>
              {{ post.date?.split('T')[0] }}
            </div>
            <div
              v-if="staging"
              class="test-sm mt-5"
            >
              <UButton
                size="xs"
                icon="i-heroicons-pencil"
                :to="wpUri.postEdit(''+post.databaseId)"
              />
            </div>
          </UAside>
        </template>
      </UPage>
    </UContainer>
  </div>
</template>
