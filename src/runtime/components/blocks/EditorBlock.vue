<script setup lang="ts">
import type { EditorBlock } from '#graphql-operations';
defineProps<{
    block: EditorBlock
}>();
</script>

<template>
    <p v-html="block.renderedHtml"></p>
</template>
