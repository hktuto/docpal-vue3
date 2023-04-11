import playgroundConfig from '../../../utils/playgroundConfig'

// @ts-ignore
const config = defineNuxtConfig({
  extends: ['..', '../../dp-stores', '../../dp-auth', '../../layout-default', '../../client-workflow' ],
  modules: [
    '@nuxt/devtools',
  ],
  ...playgroundConfig({useFormRender:true}),
})


export default config
