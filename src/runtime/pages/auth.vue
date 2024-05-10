<script setup lang="ts">
import { ref } from 'vue'
import { useWPUri } from '../composables/useWPUri'
import { getCurrentUserName, loginUser, logoutUser } from '../composables/user'
import { useCookie, useRuntimeConfig, useFetch, useRoute, useRequestEvent, navigateTo } from '#app'

const route = useRoute()
const config = useRuntimeConfig()
const requestEvent = useRequestEvent()
const wpUri = useWPUri()
const { code } = route.query
const tokens = ref()
const userName = ref<string>()

const rtCookie = useCookie(`${config.public.wpNuxt.frontendUrl}-rt`, { httpOnly: true, maxAge: 300 })
if (rtCookie.value) {
  const refreshToken = rtCookie.value
  tokens.value = await useFetch('/api/tokensFromRefreshToken', {
    method: 'POST',
    body: { refreshToken: refreshToken }
  })
  rtCookie.value = tokens.value.data.tokens.refreshToken
  userName.value = await loginUser()
} else if (code) {
  tokens.value = await useFetch('/api/tokensFromCode', {
    method: 'POST',
    body: { code: code.toString() }
  })
  rtCookie.value = tokens.value?.data?.tokens?.refreshToken
  if (requestEvent) requestEvent.context.accessToken = tokens.value?.data?.tokens?.accessToken
  userName.value = await loginUser()
} else {
  userName.value = await getCurrentUserName()
}

const logOut = async () => {
  rtCookie.value = null
  await logoutUser()
  userName.value = undefined
  navigateTo('/logout')
}
</script>

<template>
  <UContainer class="mt-5 prose dark:prose-invert">
    <ClientOnly>
      <div v-if="userName">
        <h3>
          Logged in as {{ userName }}
        </h3>
        <UButton @click="logOut">
          Log out
        </UButton>
      </div>
      <div v-else>
        <h3>Not logged in</h3>
        <UButton to="/login">
          Log in
        </UButton>
      </div>
      <h3>WordPress links:</h3>
      <ul>
        <li>
          <NuxtLink :to="wpUri.admin">
            Dashboard
          </NuxtLink>
        </li>
        <li>
          <NuxtLink :to="wpUri.pagesAdmin">
            Pages
          </NuxtLink>
        </li>
        <li>
          <NuxtLink :to="wpUri.postAdmin">
            Posts
          </NuxtLink>
        </li>
        <li>
          <NuxtLink :to="wpUri.settingsEdit">
            Settings
          </NuxtLink>
        </li>
      </ul>
    </ClientOnly>
  </UContainer>
</template>
