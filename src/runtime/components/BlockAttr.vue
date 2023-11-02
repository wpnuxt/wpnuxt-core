<script setup lang="ts">
import type { EditorBlock } from '#graphql-operations';

defineProps<{
    block: EditorBlock
}>();
</script>

<template>
    <div class="text-xs my-2">{{ block.name }} - {{ block?.attributes }}</div>
</template>