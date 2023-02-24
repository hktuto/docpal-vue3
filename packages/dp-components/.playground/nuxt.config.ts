import playgroundConfig from '../../../playgroupConfig'

const config = defineNuxtConfig({
  extends: ['..', '../../dp-stores', '../../default-layout', '../../dp-auth'],
  modules: [
    '@nuxt/devtools',
  ],
  ...playgroundConfig
})


export default config
