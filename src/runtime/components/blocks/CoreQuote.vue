<script setup lang="ts">
import type { CoreQuote } from '#graphql-operations';
defineProps<{
    block: CoreQuote
}>();
</script>

<template>
    <p v-html="block.renderedHtml"></p>
</template>
