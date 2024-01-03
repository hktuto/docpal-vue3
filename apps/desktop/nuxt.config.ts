 import {customLayer} from './packageManage'
import playgroundConfig from '../../utils/playgroundConfig'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr:false,
  // color mode setting
  extends: [
      '../client'
  ],
  
    modules: ['nuxt-electron'],
    electron: {
      disableDefaultOptions:true,
        build: [
          {
            // Main-Process entry file of the Electron App.
            entry: 'electron/main.ts',
          },
          {
            entry: 'electron/preload.ts',
            onstart(args:any) {
              // Notify the Renderer-Process to reload the page when the Preload-Scripts build is complete, 
              // instead of restarting the entire Electron App.
              args.reload()
            },
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
