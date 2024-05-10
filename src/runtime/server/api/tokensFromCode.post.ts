import { defineEventHandler, readBody } from 'h3'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const apiClientSecret = config.wpNuxt.faustSecretKey
  const body = await readBody(event)

  if (!apiClientSecret) {
    throw new Error(
      'The apiClientSecret must be specified to use the auth middleware'
    )
  }
  if (!body || !body.code) {
    throw new Error(
      'The request must contain a code'
    )
  }
  const code = body.code

  const response = await fetch(`${config.public.wpNuxt.wordpressUrl}/?rest_route=/faustwp/v1/authorize`, {
    headers: {
      'Content-Type': 'application/json',
      'x-faustwp-secret': apiClientSecret
    },
    method: 'POST',
    body: JSON.stringify({
      code
    })
  })
  const tokens = await response.json()
  if (tokens?.accessToken) {
    event.context.accessToken = tokens?.accessToken
  }

  return {
    tokens
  }
})
