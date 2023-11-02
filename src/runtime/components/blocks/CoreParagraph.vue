<script setup lang="ts">
import type { CoreParagraph } from '#graphql-operations';
defineProps<{
    block: CoreParagraph
}>();
</script>

<template>  
    <p v-html="block?.attributes?.content"/>
</template>
