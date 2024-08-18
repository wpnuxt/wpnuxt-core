<script setup lang="ts">
import type { PageFragment, PostFragment } from '#build/graphql-operations'
import { isStaging, useHead, useRoute, useWPUri, ref, useNodeByUri, useFeaturedImage, computed, usePrevNextPost, createError } from '#imports'

const isLoading = ref(true)
const postData = ref<PostFragment | PageFragment | null>()
const prevData = ref()
const nextData = ref()
const route = useRoute()
const id = computed(() => route.params?.slug?.[0])

async function fetch() {
  isLoading.value = true
  try {
    if (!id.value) {
      throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
    }
    const { data } = await useNodeByUri({ uri: id.value })
    postData.value = data
    if (!data) {
      throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
    }
    const { prev, next } = await usePrevNextPost(id.value)
    prevData.value = prev
    nextData.value = next
  } finally {
    isLoading.value = false
  }
}
fetch()
const post = computed<PostFragment | PageFragment | null | undefined>(() => postData.value)

const featuredImage = computed(() => useFeaturedImage(post.value))
const wpUri = useWPUri()
if (post.value?.title) {
  useHead({
    title: post.value.title
  })
}
const staging = await isStaging()
</script>

<template>
  <NuxtLayout>
    <UContainer>
      <UPage v-if="!isLoading">
        <UPageHeader :title="post.title" />
        <UPageBody class="prose dark:prose-invert">
          <div v-sanitize="post.content" />
        </UPageBody>
        <template #left>
          <UAside>
            <PrevNext
              :prev="post.contentTypeName === 'post' ? prevData : undefined"
              :next="post.contentTypeName === 'post' ? nextData : undefined"
              prev-button="Vorige"
              next-button="Volgende"
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
      <UPage v-else>
        <UPageHeader>
          <UIcon
            name="i-svg-spinners-bars-fade"
            class="mt-[18px] opacity-30"
          />
        </UPageHeader>
        <div class="mt-10 space-y-3">
          <USkeleton class="h-4 w-2/3" />
          <USkeleton class="h-4 w-1/2" />
        </div>
        <template #left>
          <UAside>
            <PrevNext
              :prev="undefined"
              :next="undefined"
            />
          </UAside>
        </template>
      </UPage>
    </UContainer>
  </NuxtLayout>
</template>
