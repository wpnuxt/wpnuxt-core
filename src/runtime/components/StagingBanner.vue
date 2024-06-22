<script setup lang="ts">
import { useWPUri } from '../composables/useWPUri'
import { getCurrentUserName } from '../composables/user'
import { getContentNodes } from '../composables'
import { useRuntimeConfig, ref, watch, useHead, useRoute } from '#imports'

const config = useRuntimeConfig()
const frontendUrl = config.public.wpNuxt.frontendUrl
const wordpressUrl = config.public.wpNuxt.wordpressUrl
const wpUri = useWPUri()
const userName = ref<string>()
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

const route = useRoute()
let uri = route.path === '/' ? 'home' : route.path
if (uri.startsWith('/')) {
  uri = uri.substring(1)
}
if (uri.endsWith('/')) {
  uri = uri.substring(0, uri.length - 1)
}
const { data: post } = await getContentNodes('NodeByUri', 'nodeByUri', undefined, undefined, { uri: uri })
if (post.value) {
  useHead({
    title: `Edit ${post.value.contentTypeName + post.value.title} `
  })
}
</script>

<template>
  <div
    id="wpadminbar"
    class="h-[34px] w-full fixed top-0 left-0 right-0 bg-gray-50 border-b border-gray-100 shadow-lg"
    style="z-index: 9999;"
  >
    <UContainer class="p-1">
      <div class="flex w-full">
        <div class="grow text-left align-top overflow-hidden">
          <div class="hidden sm:inline-flex mr-6 sm:mr-10">
            <WPNuxtLogo class="-mt-2 inline-flex" />
          </div>
          <div
            class="inline-block"
          >
            <UButton
              size="2xs"
              variant="outline"
              color="gray"
              icon="i-mdi-wordpress"
              :to="wpUri.admin"
              class="mr-2"
            >
              WP<span class="hidden sm:inline-flex"> Admin</span>
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
              Edit <span class="hidden sm:inline-flex">{{ post.contentTypeName }}</span>
            </UButton>
          </div>
        </div>
        <div class="flex-none justify-end text-right align-top">
          <UButton
            v-if="frontendUrl"
            size="2xs"
            class="shadow-md align-top mr-2"
            variant="outline"
            color="gray"
            :to="frontendUrl"
            target="_blank"
            trailing-icon="i-uil-external-link-alt"
          >
            Live site
          </UButton>
        </div>
      </div>
    </UContainer>
  </div>
</template>
