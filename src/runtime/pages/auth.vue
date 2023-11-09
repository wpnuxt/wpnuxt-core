<script setup lang="ts">
import { useViewer, useCookie, useRuntimeConfig, useFetch, useRoute, useRequestEvent, ref } from '#imports';
const route = useRoute();
const config = useRuntimeConfig();
const requestEvent = useRequestEvent();
const { code, logout } = route.query;
const tokens = ref()

const rtCookie = useCookie(`${config.public.frontendSiteUrl}-rt`, { httpOnly: true, maxAge: 300 });
if (logout ) {
  rtCookie.value = null;
} else if (rtCookie.value) {
  const refreshToken = rtCookie.value;
  tokens.value = await useFetch('/api/tokensFromRefreshToken', {
    method: 'POST',
    body: { refreshToken: refreshToken }
  });
  rtCookie.value = tokens.value.data.tokens.refreshToken
} else if (code) {
  tokens.value = await useFetch('/api/tokensFromCode', {
    method: 'POST',
    body: { code: code.toString() }
  });
  rtCookie.value = tokens.value?.data?.tokens?.refreshToken;
  if (requestEvent) requestEvent.context.accessToken = tokens.value?.data?.tokens?.accessToken;
}
const viewer = await useViewer();
</script>

<template>
  <UContainer class="mt-5 prose dark:prose-invert">
    <div v-if="viewer?.username">
      <h3>
        Logged in as {{ viewer.username }}
      </h3>
      {{ viewer.email }}<br><br>
      <UButton
        to="/logout"
        :external="true"
      >
        Log out
      </UButton>
    </div>
    <div v-else>
      <h3>Not logged in</h3>
      <UButton to="/login">
        Log in
      </UButton>
    </div>
  </UContainer>
</template>
