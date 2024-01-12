import { defineNuxtRouteMiddleware, ref, useFetch, useCookie, navigateTo, useRequestEvent, useRuntimeConfig, loginUser, logoutUser } from "#imports"

export default defineNuxtRouteMiddleware(async (to, from) => {
  const config = useRuntimeConfig();
  const event = useRequestEvent()

  if (to.path === '/login') {
    login()
  } else if (to.path === '/logout') {
    return navigateTo('/auth?logout=true')
  } else if (to.path === '/auth' && to.query.logout === 'true') {
    const rtCookie = useCookie(`${config.public.frontendSiteUrl}-rt`);
    rtCookie.value = null;
    return navigateTo(`${config.public.wpNuxt.wordpressUrl}/wp-login.php?action=logout`, { external: true })
    //return navigateTo('/')
  } else if (to.query.preview === 'true') {
    const previewId = to.query.p;
    const previewUrl = `${config.public.frontendSiteUrl}/preview?preview_id=${previewId}`
    if (event.context.accessToken && !to.path.startsWith('/preview')) {
      loginUser()
      return navigateTo(previewUrl)
    } else {
      return login(previewUrl)
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
        loginUser()
      }
    //} else if (to.path.startsWith('/preview') || to.path.startsWith('/test')) {
      // if we have no acces token and trying to access a protected route, redirect to login
      //login()
    }
  }
})

function login (redirect_uri?: string) {
  const config = useRuntimeConfig();
  if (!redirect_uri) {
    redirect_uri = `${config.public.frontendSiteUrl}/auth`
  }
  const loginUrl = `${config.public.wpNuxt.wordpressUrl}/generate?redirect_uri=${redirect_uri}`;
  return navigateTo(loginUrl, { external: true, replace: true })
}
