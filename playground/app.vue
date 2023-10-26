<script setup lang="ts">
import { usePosts } from '#imports';

const posts = await usePosts()
</script>

<template>
  <div>
    <h1>WPNuxt module playground!</h1>
    <p>{{ posts.data }}</p>
  </div>
</template>
