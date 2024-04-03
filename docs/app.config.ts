export default defineAppConfig({
  ui: {
    primary: 'reefgold',
    gray: 'neutral',
    footer: {
      bottom: {
        left: 'text-sm text-gray-500 dark:text-gray-400',
        wrapper: 'border-t border-gray-200 dark:border-gray-800'
      }
    },
    content: {
      prose: {
        code: {
          icon: {
            // terminal: 'i-ph-terminal'
          }
        }
      }
    }
  },
  seo: {
    siteName: 'WPNuxt ',
  },
  header: {
    logo: {
      alt: '',
      light: '',
      dark: ''
    },
    search: true,
    colorMode: true,
    links: [{
      icon: 'i-simple-icons-github',
      to: 'https://github.com/vernaillen/wpnuxt-module',
      target: '_blank',
      'aria-label': 'WPNuxt on GitHub'
    }]
  },
  footer: {
    credits: 'Copyright © 2024',
    colorMode: false,
    links: [{
      icon: 'i-simple-icons-nuxtdotjs',
      to: 'https://nuxt.com',
      target: '_blank',
      'aria-label': 'Nuxt Website'
    },
    {
      icon: 'i-simple-icons-github',
      to: 'https://github.com/vernaillen/wpnuxt-module',
      target: '_blank',
      'aria-label': 'WPNuxt on GitHub'
    }]
  },
  toc: {
    title: 'Table of Contents',
    wpnuxt: {
      title: 'WPNuxt',
      links: [
        {
          icon: 'i-ph-shooting-star-duotone',
          label: 'Star on GitHub',
          to: 'https://github.com/vernaillen/wpnuxt-module',
          target: '_blank'
        },
        {
          icon: 'i-ph-hand-heart-duotone',
          label: 'Become a Sponsor',
          to: 'https://github.com/sponsors/vernaillen',
          target: '_blank'
        },
        {
          icon: 'i-custom-vernaillen-logo-dark',
          label: 'Vernaillen.dev',
          to: 'https://vernaillen.dev',
          target: '_blank',
        }
      ]
    },
    bottom: {
      title: 'Nuxt Community',
      links: [
        {
          icon: 'i-simple-icons-nuxtdotjs',
          label: 'Nuxt docs',
          to: 'https://nuxt.com',
          target: '_blank'
        },
        {
          icon: 'i-ph-chat-centered-text-duotone',
          label: 'Nuxt Discord',
          to: 'https://chat.nuxt.dev',
          target: '_blank'
        },
        {
          icon: 'i-ph-hand-heart-duotone',
          label: 'Sponsor Nuxt',
          to: 'https://github.com/sponsors/nuxt',
          target: '_blank'
        }
      ]
    }
  },
  elements: {
    variables: {
      light: {
        background: '255 255 255',
        foreground: 'var(--color-gray-700)'
      },
      dark: {
        background: 'var(--color-gray-950)',
        foreground: 'var(--color-gray-400)'
      }
    }
  }
})
