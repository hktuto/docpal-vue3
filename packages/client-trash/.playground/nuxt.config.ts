import playgroundConfig from '../../../playgroupConfig'

const config = defineNuxtConfig({
  extends: ['..', '../../dp-stores', '../../default-layout', '../../dp-auth', '../../dp-components'],
  modules: [
    '@nuxt/devtools',
  ],
  ...playgroundConfig,
  vite:{
    optimizeDeps:{
        include: ['v-form/dist/designer.umd']
    }
  }
})


export default config
