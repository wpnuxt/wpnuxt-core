import { useRequestEvent } from "#imports";

const _useTokens = () => {
  const event = useRequestEvent()
  return {
    accessToken: event?.context?.accessToken,
    authorizationHeader: event?.context?.accessToken ? `Bearer ${event.context.accessToken}` : ''
  }
}

export const useTokens = _useTokens
