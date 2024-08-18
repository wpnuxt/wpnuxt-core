<script setup lang="ts">
import type { GeneralSettingsFragment, PostFragment } from '#build/graphql-operations'
import { useHead, ref, computed } from '#imports'
import { useGeneralSettings, usePosts } from '#wpnuxt'

const isLoading = ref(true)
const posts = ref<PostFragment[]>([])
const settings = ref<GeneralSettingsFragment | null>(null)
const latestPost = ref<PostFragment | null>(null)
async function fetch() {
  isLoading.value = true
  const { data: postsData } = await usePosts()
  const { data: settingsData } = await useGeneralSettings()
  const { data: latestPostData } = await usePosts({ limit: 1 })

  posts.value = computed(() => postsData.value).value
  settings.value = computed(() => settingsData.value).value
  latestPost.value = computed(() => latestPostData.value?.[0] || null).value
  isLoading.value = false
}
fetch()
onMounted(fetch)

useHead({
  title: settings.value?.title
})
</script>

<template>
  <NuxtLayout>
    <ULandingSection
      id="posts"
      :title="settings?.title || 'WPNuxt Demo'"
      description="WordPress posts are shown below as cards. WordPress pages are listed above in the header."
    >
      <UPageGrid
        v-if="!isLoading"
      >
        <ULandingCard
          v-for="post, index in posts"
          :key="index"
          :title="post.title"
          :description="post.date?.split('T')[0]"
          :to="post.uri"
        >
          <img
            v-if="post?.featuredImage?.node?.sourceUrl"
            :src="post.featuredImage.node.sourceUrl"
            class="w-full rounded-md"
          >
          <span v-sanitize="post.excerpt" />
        </ULandingCard>
      </UPageGrid>
      <div
        v-else
        class="w-full flex justify-center items-center"
      >
        <UIcon name="i-svg-spinners-bars-scale-fade" />
      </div>
    </ULandingSection>
    <ULandingSection
      v-if="!isLoading"
      id="posts"
      title="Latest Post"
    >
      <ULandingCard
        :title="latestPost?.title"
        :description="latestPost?.date?.split('T')[0]"
        :to="latestPost?.uri"
      >
        <img
          v-if="latestPost?.featuredImage?.node?.sourceUrl"
          :src="latestPost?.featuredImage.node.sourceUrl"
          class="w-full rounded-md"
        >
        <span v-sanitize="latestPost?.excerpt" />
      </ULandingCard>
    </ULandingSection>
  </NuxtLayout>
</template>
