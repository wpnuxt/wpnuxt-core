<script setup lang="ts">
import { isStaging } from '#imports'

const staging = await isStaging()
</script>

<template>
  <StagingBanner v-if="staging" />
  <div :class="staging ? 'mt-[34px]' : 'mt-0'">
    <HeaderComponent />
    <UMain>
      <NuxtPage />
    </UMain>
    <UFooter />
  </div>
</template>
