// https://v3.nuxtjs.org/api/configuration/nuxt.config
// @ts-ignore
const ExcutingAnOrder = process.env.npm_lifecycle_script.split(' ')
const env = ExcutingAnOrder[ExcutingAnOrder.length - 1];
const dashboardProxy = process.env.DASHBOARD_PROXY?.replace('admin.', '')
export default defineNuxtConfig({
    modules:[
        // 'dp/nuxt-session'
        '@pinia/nuxt',
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
        devProxy:{
            '/api':{
                target: process.env.PROXY,
                changeOrigin: true,
                prependPath: true,
            },
            '/dashboard':{
                target: dashboardProxy,
                changeOrigin: true,
                prependPath: true,
            }
        },
        routeRules: {
            '/dashboard/**': { proxy: process.env.DASHBOARD_PROXY },
        }
    }
})
