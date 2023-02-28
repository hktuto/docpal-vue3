import playgroundConfig from '../../../utils/playgroundConfig'

const config =  defineNuxtConfig({
  extends: ['..'],
  ...playgroundConfig({useFormDesigner:true}),
})


export default config