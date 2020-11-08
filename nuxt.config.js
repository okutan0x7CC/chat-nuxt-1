import colors from 'vuetify/es5/util/colors'

require('dotenv').config()

export default {

  // Environment variables
  env: process.env,

  // Disable server-side rendering (https://go.nuxtjs.dev/ssr-mode)
  ssr: false,

  // Target (https://go.nuxtjs.dev/config-target)
  target: 'static',

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    titleTemplate: '%s - chat-nuxt-1',
    title: 'chat-nuxt-1',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    '~/plugins/vue-observe-visibility.js'
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    // load environment variables
    [
      '@nuxtjs/dotenv',
      { filename: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development' }
    ]
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',

    // load firebase configuration from env
    [
      '@nuxtjs/firebase',
      {
        config: {
          production: {
            apiKey: 'AIzaSyAUcPiZE-8mut5DQSNT_GLJLt1OLVIbJVk',
            authDomain: 'chat-nuxt-76297.firebaseapp.com',
            databaseURL: 'https://chat-nuxt-76297.firebaseio.com',
            projectId: 'chat-nuxt-76297',
            storageBucket: 'chat-nuxt-76297.appspot.com',
            messagingSenderId: '320897460043',
            appId: '1:320897460043:web:9b24eb76319a6dc2a8eace',
            measurementId: ''
          },
          development: {
            apiKey: 'AIzaSyAUcPiZE-8mut5DQSNT_GLJLt1OLVIbJVk',
            authDomain: 'chat-nuxt-76297.firebaseapp.com',
            databaseURL: 'https://chat-nuxt-76297.firebaseio.com',
            projectId: 'chat-nuxt-76297',
            storageBucket: 'chat-nuxt-76297.appspot.com',
            messagingSenderId: '320897460043',
            appId: '1:320897460043:web:9b24eb76319a6dc2a8eace',
            measurementId: ''
          }
        },
        services: {
          database: true,
          auth: true
        }
      }
    ]

  ],

  // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
  vuetify: {
    customVariables: ['assets/variables.scss'],
    treeShake: true,
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
  }
}
