export default defineNuxtConfig({
  extends: ['..', '../../dp-stores', '../../default-assets', '../../dp-components'],
  typescript: {
    includeWorkspace: true
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
