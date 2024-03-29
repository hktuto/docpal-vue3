import playgroundConfig from '../../../utils/playgroundConfig'

const config = defineNuxtConfig({
  extends: ['..', '../../dp-stores',  '../../dp-auth', '../../layout-default',],
  modules: [
    '@nuxt/devtools',
  ],
  ...playgroundConfig({}),
})


export default config
