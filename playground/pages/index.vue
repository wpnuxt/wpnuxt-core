<script setup lang="ts">
const { data: posts } = await usePosts()
const { data: settings } = await useSettings()
const { data: latestPost } = await useLatestPost()
useHead({
  title: settings.title
})
</script>

<template>
  <div>
    <ULandingSection
      id="posts"
      :title="settings.title"
      :headline="settings.description"
      description="WordPress posts are shown below as cards. WordPress pages are listed above in the header."
    >
      <UPageGrid>
        <ULandingCard
          v-for="post, index in posts"
          :key="index"
          :title="post.title"
          :description="post.date.split('T')[0]"
          :to="post.uri"
        >
          <img
            v-if="post?.featuredImage?.node?.sourceUrl"
            :src="post.featuredImage.node.sourceUrl"
            class="w-full rounded-md"
          >
          <span v-html="post.excerpt" />
        </ULandingCard>
      </UPageGrid>
    </ULandingSection>
    <ULandingSection
      id="posts"
      title="Latest Post"
    >
      <ULandingCard
        :title="latestPost.title"
        :description="latestPost.date.split('T')[0]"
        :to="latestPost.uri"
      >
        <img
          v-if="latestPost?.featuredImage?.node?.sourceUrl"
          :src="latestPost.featuredImage.node.sourceUrl"
          class="w-full rounded-md"
        >
        <span v-html="latestPost.excerpt" />
      </ULandingCard>
    </ULandingSection>
  </div>
</template>
