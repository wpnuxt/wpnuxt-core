<script setup lang="ts">
const props = defineProps<{
  wpColor?: string
}>()
const wpLight = props.wpColor ? props.wpColor : 'back'
const wpDark = props.wpColor ? props.wpColor : 'white'
</script>

<template>
  <div class="wpnuxt-logo">
    <span class="wpnuxt-logo-wp">WP</span><span class="wpnuxt-logo-nuxt">Nuxt</span>
  </div>
</template>

<style scoped>
.wpnuxt-logo {
  display: inline-flex;
  font-weight: 700;
  font-size: 1.5rem;
  line-height: 2rem;
}
.wpnuxt-logo-wp {
  color: v-bind(wpLight);
  font-family: ui-serif, Times, serif;
}
html.dark .wpnuxt-logo-wp {
  color: v-bind(wpDark);
  font-family: ui-serif, Times, serif;
}
.wpnuxt-logo-nuxt {
  margin-top: -1px;
  --tw-text-opacity: 1;
  color: rgb(186 175 78 / var(--tw-text-opacity));
}
</style>
