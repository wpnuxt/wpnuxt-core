<script setup lang="ts">
import { usePosts } from '../../../../src/runtime/composables/usePosts'

const posts = await usePosts()
</script>

<template>
  <div>
    <p>Extending Pages and Posts with meta data from Yoast SEO</p>
    <div
      v-for="post in posts.data"
      :key="post.databaseId"
    >
      <h3>{{ post.title }}</h3>
      <div>Yoast SEO title: {{ post.seo.title }}</div>
      <div>Yoast SEO desc: {{ post.seo.metaDesc }}</div>
    </div>
  </div>
</template>
