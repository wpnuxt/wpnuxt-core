import { defineNuxtRouteMiddleware, ref, useFetch, useCookie, navigateTo, useRequestEvent, useRuntimeConfig, loginUser } from "#imports"
import { useWPNuxtLogger } from "../composables/useWPNuxtlogger";

export default defineNuxtRouteMiddleware(async (to) => {
  const config = useRuntimeConfig();
  const event = useRequestEvent()
  const logger = useWPNuxtLogger()

  if (to.path === '/login') {
    logger.debug('auth middleware, redirect to wordpress login')
    login()
  } else if (to.path === '/logout') {
    return navigateTo('/auth?logout=true')
  } else if (to.path === '/auth' && to.query.logout === 'true') {
    logger.debug('auth middleware, redirect to wordpress logout')
    const rtCookie = useCookie(`${config.public.wpNuxt.frontendUrl}-rt`);
    rtCookie.value = null;
    return navigateTo(`${config.public.wpNuxt.wordpressUrl}/wp-login.php?action=logout`, { external: true })
    //return navigateTo('/')
  } else if (to.query.preview === 'true') {
    const previewId = to.query.p;
    const previewUrl = `${config.public.wpNuxt.frontendUrl}/preview?preview_id=${previewId}`
    if (event.context.accessToken && !to.path.startsWith('/preview')) {
      loginUser()
      return navigateTo(previewUrl)
    } else {
      return login(previewUrl)
    }
  } else {
    const tokens = ref()
    const rtCookie = useCookie(`${config.public.wpNuxt.frontendUrl}-rt`, { httpOnly: true, maxAge: 300 });
    if (rtCookie.value) {
      logger.debug('auth middleware: found cookie with refreshToken, fetching new access token')
      const refreshToken = rtCookie.value;
      tokens.value = await useFetch('/api/tokensFromRefreshToken', {
        method: 'POST',
        body: { refreshToken: refreshToken }
      });
      rtCookie.value = tokens.value.data.tokens.refreshToken
    }
    if (tokens.value?.data?.tokens?.accessToken) {
      logger.debug('auth middleware: got an access token, logging in the user')
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
    redirect_uri = `${config.public.wpNuxt.frontendUrl}/auth`
  }
  const loginUrl = `${config.public.wpNuxt.wordpressUrl}/generate?redirect_uri=${redirect_uri}`;
  return navigateTo(loginUrl, { external: true, replace: true })
}
