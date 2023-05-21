import playgroundConfig from '../../../utils/playgroundConfig'

const config = defineNuxtConfig({
  ssr:false,
  extends: ['..', '../../dp-stores',  '../../dp-auth', '../../layout-default',],
  devTools: true,
  ...playgroundConfig({useFormRender:true}),
})


export default config
