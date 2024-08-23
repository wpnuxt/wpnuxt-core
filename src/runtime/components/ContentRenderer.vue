<script setup lang="ts">
import type { NodeWithContentEditorFragment } from '#build/graphql-operations'

defineProps<{
  node: NodeWithContentEditorFragment
}>()
</script>

<template>
  <div
    v-sanitize="node.content"
  />
</template>
