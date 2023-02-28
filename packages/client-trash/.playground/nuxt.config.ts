import playgroundConfig from '../../../utils/playgroundConfig'

const config = defineNuxtConfig({
  extends: ['..', '../../dp-stores', '../../default-layout', '../../dp-auth', '../../dp-components'],
  modules: [
    '@nuxt/devtools',
  ],
  ...playgroundConfig({useFormRender:true}),
})


export default config
