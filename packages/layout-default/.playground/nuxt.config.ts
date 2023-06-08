import playgroundConfig from '../../../utils/playgroundConfig'

const config =  defineNuxtConfig({
  ssr:false,
  extends: ['..', '../../dp-auth'],
  ...playgroundConfig({useFormDesigner:true}),
})


export default config