<script setup lang="ts">
import { usePosts, usePages, useHead } from '#imports';

const posts = await usePosts()
const pages = await usePages()
useHead({
  title: "WPNuxt Playground"
})
</script>

<template>
  <div>
    <h2>Posts:</h2>
    <div
      v-if="posts"
      class="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
    >
      <div
        v-for="post, index in posts.data"
        :key="index"
      >
        <NuxtLink :to="post.uri">
          {{ post.title }}
        </NuxtLink>
      </div>
    </div>
    <h2>Pages:</h2>
    <div
      v-if="pages"
      class="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
    >
      <div
        v-for="page, index in pages.data"
        :key="index"
      >
        <NuxtLink :to="page.uri">
          {{ page.title }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
