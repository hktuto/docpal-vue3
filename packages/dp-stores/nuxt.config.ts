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
    axios: {
        // 开启代理 (如果需要判断线上线下环境，可以通过 process.env.NODE_ENV !== 'production' 来判断)
        proxy: true,
        // 给请求 url 加个前缀 /api，如果这项不配置，则需要手动添加到请求链接前面
        // 如果是多个代理的时候，则不需要配置，走手动添加代理前缀
        prefix: '/api',
        // 跨域请求时是否需要使用凭证
        credentials: true
    },
    proxy: {
        //当代理多个时，只需添加如下格式的数组对象即可
        '/api': {     //  key(路由前缀)：value(target)(代理地址)
            // 目标接口域   
            target: process.env.PROXY,
            // 全局配置是否跨域
            changeOrigin: true,
            pathRewrite: {
                // 单个配置是否跨域
                // changeOrigin: true
                // 把 '/api' 替换成 '/'，具体需要替换为 '' 还是 '/' 看自己习惯
                '^/api': '/api'
            }
        },
        '/dashboard':{
            target: process.env.DASHBOARD_PROXY,
            changeOrigin: true,
            pathRewrite: {
                '^/dashboard': '/'
            }
        }
    },
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
            },
        }
    }
})
