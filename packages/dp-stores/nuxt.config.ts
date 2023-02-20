// https://v3.nuxtjs.org/api/configuration/nuxt.config
// @ts-ignore
const ExcutingAnOrder = process.env.npm_lifecycle_script.split(' ')
const env = ExcutingAnOrder[ExcutingAnOrder.length - 1];
export default defineNuxtConfig({
    modules:[
        // 'dp/nuxt-session'
    ],
    nitro:{
        devProxy:{
            '/api':{
                target: process.env.PROXY,
                changeOrigin: true,
                prependPath: true,
            },
            
        }
    }
})
