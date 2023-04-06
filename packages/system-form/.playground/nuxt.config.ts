import playgroundConfig from '../../../utils/playgroundConfig'

const config = defineNuxtConfig({
  extends: ['..', '../../dp-stores',  '../../dp-auth', '../../layout-default', '../../admin-table-setting'],
  modules: [
    '@nuxt/devtools',
  ],
  ...playgroundConfig({}),
})

export default config
