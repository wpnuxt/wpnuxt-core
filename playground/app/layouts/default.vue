<script setup lang="ts">
import { isStaging } from '#imports'

const staging = await isStaging()
</script>

<template>
  <div>
    <slot />
    <StagingBanner
      v-if="staging"
    />
  </div>
</template>
