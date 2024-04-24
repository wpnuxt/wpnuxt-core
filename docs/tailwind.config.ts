import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'
import { iconsPlugin, getIconCollections } from '@egoist/tailwindcss-icons'

const customIconSet = {
  prefix: 'custom',
  icons: {
    'vernaillen-logo-light': {
      body: '<g fill="none" opacity="transparent"><path fill="#000000" d="M0 0 H92 V184 H172 V0 H264 V184 H344 V0 H436 V276 H0 Z"/><path fill="#9c8e1b" d="M490 0 H582 V184 H662 V0 H754 V276 H490 Z"/></g>',
      width: 754,
      height: 400,
    },
    'vernaillen-logo-dark': {
      body: '<g fill="none" opacity="transparent"><path fill="#9c8e1b" d="M0 0 H92 V184 H172 V0 H264 V184 H344 V0 H436 V276 H0 Z"/><path fill="#ffffff" d="M490 0 H582 V184 H662 V0 H754 V276 H490 Z"/></g>',
      width: 754,
      height: 400,
    },
  },
}

export default <Partial<Config>>{
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        woodsmoke: {
          DEFAULT: '#0C0C0D',
          50: '#64646C',
          100: '#5A5A62',
          200: '#47474D',
          300: '#333337',
          400: '#202022',
          500: '#0C0C0D',
          600: '#000000',
          700: '#000000',
          800: '#000000',
          900: '#000000',
          950: '#000000',
        },
        reefgold: {
          DEFAULT: '#9c8e1b',
          50: '#faf9f0',
          100: '#f5f3e1',
          200: '#e6e2b5',
          300: '#d6d090',
          400: '#baaf4e',
          500: '#9c8e1b',
          600: '#8c7815',
          700: '#755d0f',
          800: '#5e4509',
          900: '#452e06',
          950: '#2e1b02',
        },
      },
    },
  },
  plugins: [
    iconsPlugin({
      collections: {
        custom: customIconSet,
        ...getIconCollections(['heroicons', 'simple-icons', 'ph', 'ant-design']),
      },
    }),
  ],
}
