<script setup lang="ts">
import type { Post, Page } from '#graphql-operations'
import { isStaging, useHead, useRoute, useWPUri, useNodeByUri, ref, createError } from '#imports'

const route = useRoute()
const post = ref<Post | Page | null>()
if (route.params.slug && route.params.slug[0]) {
  const { data } = await useNodeByUri(route.params.slug[0])
  post.value = data.value
}
if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}
const wpUri = useWPUri()
if (post.value?.title) {
  useHead({
    title: post.value.title,
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
        <UPageBody>
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
              v-if="post.featuredImage?.node?.sourceUrl"
              class="test-sm mt-10"
            >
              featured image:
              <ImageComponent
                :url="post.featuredImage?.node?.sourceUrl"
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
