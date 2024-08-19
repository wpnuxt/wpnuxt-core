<script setup lang="ts">
import type { NodeWithContentEditorFragment } from '#build/graphql-operations'

defineProps<{
  post: NodeWithContentEditorFragment
}>()
</script>

<template>
  <div
    v-sanitize="post.content"
  />
</template>
