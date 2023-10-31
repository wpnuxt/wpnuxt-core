# WPNuxt

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

Nuxt module for using WordPress as a headless CMS with a Nuxt 3 frontend

- [✨ &nbsp;Release Notes](/CHANGELOG.md)
<!-- - [🏀 Online playground](https://stackblitz.com/github/your-org/my-module?file=playground%2Fapp.vue) -->
<!-- - [📖 &nbsp;Documentation](https://example.com) -->

## Features

- Content is fetched from WordPress using server-side GraphQL api calls
- Support for (Gutenberg Blocks), using WPEngine's wp-graphql-content-blocks https://faustjs.org/tutorial/get-started-with-wp-graphql-content-blocks

## Quick Setup

1. Add `@vernaillen/wpnuxt` dependency to your project

```bash
# Using pnpm
pnpm add -D @vernaillen/wpnuxt

# Using yarn
yarn add --dev @vernaillen/wpnuxt

# Using npm
npm install --save-dev @vernaillen/wpnuxt
```

2. Add '@vernaillen/wpnuxt' to the `modules` section of `nuxt.config.ts`

```js
export default defineNuxtConfig({
  modules: [
    '@vernaillen/wpnuxt'
  ]
})
```

That's it! You can now use the WPNuxt module in your Nuxt app ✨

## Development

```bash
# Install dependencies
npm install

# Generate type stubs
npm run dev:prepare

# Develop with the playground
npm run dev

# Build the playground
npm run dev:build

# Run ESLint
npm run lint

# Run Vitest
npm run test
npm run test:watch

# Release new version
npm run release
```

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/@vernaillen/wpnuxt/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://www.npmjs.com/package/@vernaillen/wpnuxt

[npm-downloads-src]: https://img.shields.io/npm/dm/@vernaillen/wpnuxt.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://www.npmjs.com/package/@vernaillen/wpnuxt

[license-src]: https://img.shields.io/npm/l/@vernaillen/wpnuxt?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://www.npmjs.com/package/@vernaillen/wpnuxt

[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?logo=nuxt.js
[nuxt-href]: https://nuxt.com
