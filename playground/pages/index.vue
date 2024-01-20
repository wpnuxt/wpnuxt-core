<script setup lang="ts">
const posts = await usePosts()
const settings = await useSettings()

useHead({
  title: settings.title
})
</script>

<template>
  <ULandingSection
    id="posts"
    :title="settings.title"
    :headline="settings.description"
    description="WordPress posts are shown below as cards. WordPress pages are listed above in the header."
  >
    <UPageGrid>
      <ULandingCard
        v-for="post, index in posts.data"
        :key="index"
        :title="post.title"
        :description="post.date.split('T')[0]"
        :to="post.uri"
      >
        <img
          v-if="post.data?.featuredImage?.node?.sourceUrl"
          :src="post.featuredImage.node.sourceUrl"
          class="w-full rounded-md"
        >
        <span v-html="post.excerpt" />
      </ULandingCard>
    </UPageGrid>
  </ULandingSection>
</template>
