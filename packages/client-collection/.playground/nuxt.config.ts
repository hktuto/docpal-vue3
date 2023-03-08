import playgroundConfig from '../../../utils/playgroundConfig'

const config = defineNuxtConfig({
  extends: ['..', '../../dp-stores',  '../../dp-auth', '../../layout-default',
            '../../client-browse'],
  modules: [
    '@nuxt/devtools',
  ],
  ...playgroundConfig({useFormRender:true}),
})


export default config
