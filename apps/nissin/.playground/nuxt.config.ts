import playgroundConfig from '../../../utils/playgroundConfig'

const config = defineNuxtConfig({
  ssr:false,
  extends: ['..'],
  ...playgroundConfig({useFormRender:true}),
})


export default config
