 import {customLayer} from './packageManage'
import playgroundConfig from '../../utils/playgroundConfig'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    ssr:false,
    app: {
       
    },
    css:[
    ],
    devtools: {
        enabled: true,
    },
    // color mode setting
    extends: [
        "../client"
    ],
    modules: ['nuxt-electron'],
    electron: {
        build: [
          {
            // Main-Process entry file of the Electron App.
            entry: 'electron/main.ts',
          },
        ],
      },
    //  for local preview dev only
    // nitro:{
    //     routeRules:{
    //         "/api/**" :{proxy:"https://app2.wclsolution.com/api/**"},
    //     }
    // }

})
