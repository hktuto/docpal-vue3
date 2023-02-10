import {customLayer} from './packageManage'
// @ts-ignore
const ExcutingAnOrder = process.env.npm_lifecycle_script.split(' ')
const env = ExcutingAnOrder[ExcutingAnOrder.length - 1];

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    components: true,

    runtimeConfig: {
        // 不在public部分为仅在服务器下可用
        env,
        public: {
          env,
          LOCAL_KEY: process.env.LOCAL_KEY || 'client,meta',
          PROXY: process.env.PROXY
        },
      },
    modules:[
    ],
    // color mode setting
    extends: [
        ...customLayer()
    ],
      
})
