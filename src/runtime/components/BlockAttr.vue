<script setup lang="ts">
import type { CoreBlock } from '#graphql-operations'

defineProps<{
  block: CoreBlock
}>()
</script>

<template>
  <div class="text-xs my-2">
    {{ block.name }} - {{ block?.attributes }}
  </div>
</template>
