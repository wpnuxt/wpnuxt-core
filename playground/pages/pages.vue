<script setup lang="ts">
import { usePages } from '#wpnuxt'

const { data: pages } = await usePages()
</script>

<template>
  <div>
    <ULandingSection
      title="Pages"
      headline="testing the usePages() composable"
    >
      {{ test }}
      <UPageGrid>
        <ULandingCard
          v-for="page, index in pages"
          :key="index"
          :title="page.title"
          :description="page.date?.split('T')[0]"
          :to="page.uri"
        >
          <img
            v-if="page?.featuredImage?.node?.sourceUrl"
            :src="page.featuredImage.node.sourceUrl"
            class="w-full rounded-md"
          >
          <!-- eslint-disable-next-line vue/no-v-html -->
          <span v-html="page.excerpt" />
        </ULandingCard>
      </UPageGrid>
    </ULandingSection>
  </div>
</template>
