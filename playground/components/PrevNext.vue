<script setup lang="ts">
defineProps<{
  prev?: string
  next?: string
  prevButton?: string
  nextButton?: string
}>()
</script>

<template>
  <div class="grid grid-cols-3 gap-6 max-w-28">
    <div class="flex justify-start">
      <UButton
        v-if="prev"
        :alt="prevButton"
        :to="'/' + prev"
        icon="i-heroicons-arrow-left-16-solid"
        variant="soft"
        size="sm"
      />
    </div>
    <div class="flex justify-center">
      <UButton
        to="/"
        icon="i-heroicons-home"
        variant="soft"
        size="sm"
      />
    </div>
    <div class="flex justify-end">
      <UButton
        v-if="next"
        :alt="nextButton"
        :to="'/' + next"
        trailing-icon="i-heroicons-arrow-right-16-solid"
        variant="soft"
        size="sm"
      />
    </div>
  </div>
</template>
