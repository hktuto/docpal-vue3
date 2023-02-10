export default defineNuxtConfig({
  extends: ['..', '../../dp-stores', '../../i18n', '../../default-assets', '../../dp-components'],
  runtimeConfig:{
    public:{
      LOCAL_KEY: process.env.LOCAL_KEY || 'client,meta',
      PROXY: process.env.PROXY
    }
  },
  nitro:{
    devProxy:{
        '/docpalEndpoint':{
            target: process.env.PROXY,
            changeOrigin: true,
            prependPath: true,
        }
    }
  }
})
