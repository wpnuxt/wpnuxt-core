
<script setup lang="ts">
import { usePost, useRoute, useHead } from '#imports';

const route = useRoute();
const uri = route.params.slug

const post = await usePost(uri[0])
if (post?.data?.title) {
    useHead({
        title: post.data.title
    })
}
</script>
<template>
  <div v-if="post?.data">
    <nav>
      <NuxtLink to="/">
        Back
      </NuxtLink>
    </nav>
    <main>
      <img
        v-if="post.data.featuredImage?.node?.sourceUrl"
        :src="post.data.featuredImage?.node?.sourceUrl"
        style="height: 200px;"
      >
      <h1>
        {{ post.data.title }}
      </h1>
      <div>
        published: {{ post.data.date }}
      </div>
      <div v-if="post.data.editorBlocks">
        <div
          v-for="block, index in post.data.editorBlocks"
          :key="index"
        >
          <p v-html="block.renderedHtml" />
        </div>
      </div>
    </main>
  </div>
</template>
