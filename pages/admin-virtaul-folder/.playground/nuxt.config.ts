import playgroundConfig from '../../../utils/playgroundConfig'

const config = defineNuxtConfig({
  ssr: false,
  extends: ['..', '../../../packages/dp-stores',  '../../../packages/dp-auth', '../../../packages/dp-search', '../../../packages/dp-components', '../../../packages/layout-default',],
  devTools: true,
  ...playgroundConfig({useFormRender:true}),
})


export default config
