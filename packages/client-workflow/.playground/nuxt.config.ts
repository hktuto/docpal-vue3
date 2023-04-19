import playgroundConfig from '../../../utils/playgroundConfig'

const config = defineNuxtConfig({
  ssr:false,
  extends: ['..', '../../dp-stores',  '../../dp-auth', '../../layout-default',],
  modules: [
    '@nuxt/devtools',
  ],
  ...playgroundConfig({useFormRender:true}),
})


export default config
