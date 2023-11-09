import { defineEventHandler, useRuntimeConfig } from '#imports';
import { readBody } from 'h3';

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const apiClientSecret = config.faustSecretKey;
    const body = await readBody(event)

    if (!apiClientSecret) {
        throw new Error(
            'The apiClientSecret must be specified to use the auth middleware',
        );
    }
    if (!body || !body.refreshToken) {
        throw new Error(
            'The request must contain a refreshToken',
        );
    }
    const refreshToken = body.refreshToken;

    const response = await fetch(`${config.public.wpNuxt.wordpressUrl}/?rest_route=/faustwp/v1/authorize`, {
        headers: {
            'Content-Type': 'application/json',
            'x-faustwp-secret': apiClientSecret,
        },
        method: 'POST',
        body: JSON.stringify({
            refreshToken
        }),
    });
    const tokens = await response.json();

    return {
        tokens
    }
})
