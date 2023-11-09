import { defineNuxtRouteMiddleware, ref, useFetch, useCookie, navigateTo, useRequestEvent, useRuntimeConfig } from "#imports"

export default defineNuxtRouteMiddleware(async (to, from) => {
  const config = useRuntimeConfig();
  const event = useRequestEvent()

  if (to.path === '/login') {
    login()
  } else if (to.path === '/logout') {
    return navigateTo('/auth?logout=true')
  } else if (to.path === '/auth' && to.query.logout === 'true') {
    return
  } else if (to.query.preview === 'true') {
    const previewId = to.query.p;
    const previewUrl = `${config.public.frontendSiteUrl}/preview?preview_id=${previewId}`
    if (event.context.accessToken && !to.path.startsWith('/preview')) {
      return navigateTo(previewUrl)
    } else {
      return navigateTo(`${config.public.wpNuxt.wordpressUrl}/generate?redirect_uri=${previewUrl}`, { external: true })
    }
  } else {
    const tokens = ref()
    const rtCookie = useCookie(`${config.public.frontendSiteUrl}-rt`, { httpOnly: true, maxAge: 300 });
    if (rtCookie.value) {
      const refreshToken = rtCookie.value;
      tokens.value = await useFetch('/api/tokensFromRefreshToken', {
        method: 'POST',
        body: { refreshToken: refreshToken }
      });
      rtCookie.value = tokens.value.data.tokens.refreshToken
    }
    if (tokens.value?.data?.tokens?.accessToken) {
      if (process.server) {
        const event = useRequestEvent()
        event.context.accessToken = tokens.value?.data?.tokens?.accessToken;
      }
    //} else if (to.path.startsWith('/preview') || to.path.startsWith('/test')) {
      // if we have no acces token and trying to access a protected route, redirect to login
      //login()
    }
  }
})

function login () {
  const config = useRuntimeConfig();
  const redirect_uri = `${config.public.frontendSiteUrl}/auth`;
  /*if (to.query.redirect && to.query.redirect !== '/login') {
    redirect_uri = `${config.public.frontendSiteUrl}${to.query.redirect.toString()}`;
  } else if (to.path.startsWith('/auth') || to.path.startsWith('/preview') || to.path.startsWith('/test')) {
    redirect_uri = `${config.public.frontendSiteUrl}${to.path}`;
  }*/
  const loginUrl = `${config.public.wpNuxt.wordpressUrl}/generate?redirect_uri=${redirect_uri}`;
  return navigateTo(loginUrl, { external: true })
}
