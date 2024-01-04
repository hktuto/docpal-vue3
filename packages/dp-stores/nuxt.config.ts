// https://v3.nuxtjs.org/api/configuration/nuxt.config
// @ts-ignore
const ExcutingAnOrder = process.env.npm_lifecycle_script.split(' ')
const env = ExcutingAnOrder[ExcutingAnOrder.length - 1];
// require('events').EventEmitter.defaultMaxListeners = 0; // 解除监听器数量限制

export default defineNuxtConfig({
    modules:[
        // 'dp/nuxt-session'
        '@pinia/nuxt',
        'nuxt-proxy'
    ],
    // @ts-ignore
    pinia: {
        autoImports: [
          // automatically imports `defineStore`
          'defineStore', // import { defineStore } from 'pinia'
          ['defineStore', 'definePiniaStore'], // import { defineStore as definePiniaStore } from 'pinia'
        ],
    },

    nitro:{
      routeRules:{
        '/api/**': {proxy: {to: process.env.PROXY +"/**"}},
        '/dashboard/**': {proxy: {to:process.env.DASHBOARD_PROXY+"/**"}},
        '/client/**': {proxy: {to:process.env.CLIENT_PROXY+"/**"}},
      },

        // devProxy:{
        //   '/api':{
        //     target: process.env.PROXY,
        //     changeOrigin: true,
        //     prependPath: true
        //   },
        //   '/dashboard':{
        //     target: process.env.DASHBOARD_PROXY,
        //     changeOrigin: true,
        //     prependPath: true
        //   },
        //   '/client':{
        //     target: process.env.CLIENT_PROXY,
        //     changeOrigin: true,
        //     prependPath: true
        //   }
        // }
        // routeRules: {
        //     '/dashboard/**': {
        //         proxy: 'https://app4.wclsolution.com/public-api/report/v1/api/**'
        //     }
        // }
    }
})
