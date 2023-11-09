 import {customLayer} from './packageManage'
import playgroundConfig from '../../utils/playgroundConfig'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    ssr:false,
    app: {
       
    },
    css:[
        '~/assets/tauri.scss',
    ],
    devtools: {
        enabled: true,
    },
    // color mode setting
    extends: [
        "../client"
    ],
    //  for local preview dev only
    // nitro:{
    //     routeRules:{
    //         "/api/**" :{proxy:"https://app2.wclsolution.com/api/**"},
    //     }
    // }

})
