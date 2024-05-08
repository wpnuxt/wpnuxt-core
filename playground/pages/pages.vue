<script setup lang="ts">
import { usePages } from '#imports'

const { data: pages } = await usePages()
</script>

<template>
  <div>
    <ULandingSection
      title="Pages"
      headline="testing the usePages() composable"
    >
      <UPageGrid>
        <ULandingCard
          v-for="post, index in pages"
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
          <!-- eslint-disable-next-line vue/no-v-html -->
          <span v-html="post.excerpt" />
        </ULandingCard>
      </UPageGrid>
    </ULandingSection>
  </div>
</template>
