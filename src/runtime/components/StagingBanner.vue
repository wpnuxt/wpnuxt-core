<script setup lang="ts">
import { useRuntimeConfig, ref, watch, useHead } from '#imports';
import { useWPUri } from '../composables/useWPUri';
import { getCurrentUserName } from '../composables/user';
import type { Post } from '#graphql-operations';
defineProps<{
  post?: Post
}>()
const config = useRuntimeConfig();
const frontendUrl = config.public.wpNuxt.frontendUrl
const wordpressUrl = config.public.wpNuxt.wordpressUrl
const wpUri = useWPUri()
const userName = ref<String>()
userName.value = getCurrentUserName()
watch(() => getCurrentUserName(), (newVal) => {
    userName.value = newVal
})
useHead({
  title: 'Staging',
  link: [
    {
      type: 'stylesheet',
      href: wordpressUrl + '/wp-admin/load-styles.php?c=0&dir=ltr&load%5Bchunk_0%5D=dashicons,admin-bar,site-health,common,forms,admin-menu,dashboard,list-tables,edit,revisions,media,themes,about,nav-menus,wp-poi&load%5Bchunk_1%5D=nter,widgets,site-icon,l10n,buttons,wp-auth-check&ver=6.4.3'
    }
  ]
})
</script>
<template>
  <div
    id="wpadminbar"
    class="h-[34px] w-full fixed top-0 bg-gray-50 border-b border-gray-100 shadow-lg"
    style="z-index: 9999;"
  >
    <UContainer class="p-1">
      <div class="grid grid-cols-2">
        <div class="text-left align-top">
          <div class="inline-flex mr-10">
            <WPNuxtLogo class="-mt-2 inline-flex" />
          </div>
          <div
            class="inline-flex"
          >
            <UButton
              size="2xs"
              variant="outline"
              color="gray"
              icon="i-mdi-wordpress"
              :to="wpUri.admin"
              class="mr-2"
            >
              WP Admin
            </UButton>
          </div>
          <div
            v-if="post"
            class="inline-flex"
          >
            <UButton
              size="2xs"
              icon="i-heroicons-pencil"
              :to="wpUri.postEdit('' + post.databaseId)"
            >
              Edit {{ post.contentTypeName }}
            </UButton>
          </div>
        </div>
        <div class="text-right align-top">
          <UButton
            size="2xs"
            class="shadow-md align-top mr-2"
            variant="outline"
            color="gray"
            :to="frontendUrl"
            target="_blank"
            trailing-icon="i-uil-external-link-alt"
          >
            Open live site
          </UButton>
        </div>
      </div>
    </UContainer>
  </div>
</template>
