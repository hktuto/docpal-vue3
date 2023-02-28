import playgroundConfig from '../../../utils/playgroundConfig'

const config = defineNuxtConfig({
  extends: ['..', '../../dp-stores', '../../layout-default', '../../dp-auth'],
  modules: [
    '@nuxt/devtools',
  ],
  ...playgroundConfig
})


export default config
