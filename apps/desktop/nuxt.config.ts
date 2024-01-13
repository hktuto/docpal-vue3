

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr:false,
  // color mode setting
  extends: [
      '../client'
  ],

  modules: ['nuxt-electron'],

  electron: {
    disableDefaultOptions: true, //process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'development',
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
  runtimeConfig:{
    public:{
      CUSTOM_KEYCLOAK_REDIRECT: process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'development' ? "" : "docpal://login"
    }
  },
  nitro:{
    preset: 'node-server',
  },
    //  for local preview dev only
  

})
