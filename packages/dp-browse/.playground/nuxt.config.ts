import playgroundConfig from '../../../playgroupConfig'

const config = defineNuxtConfig({
  extends: ['..', '../../dp-stores', '../../i18n', '../../default-layout', '../../dp-components'],
  modules: [
    '@nuxt/devtools',
  ],
  ...playgroundConfig
})


export default config
