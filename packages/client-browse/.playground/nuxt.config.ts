import playgroundConfig from '../../../utils/playgroundConfig'

const config = defineNuxtConfig({
  extends: ['..', '../../dp-stores', '../../default-layout', '../../dp-auth', '../../dp-form'],
  modules: [
    '@nuxt/devtools',
  ],
  ...playgroundConfig({useFormRender:true}),
})


export default config
