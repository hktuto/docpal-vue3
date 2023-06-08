import playgroundConfig from '../../../utils/playgroundConfig'

const config = defineNuxtConfig({
  extends: ['..', '../../dp-stores',  '../../dp-auth', '../../layout-default',],
  devTools: true,
  ...playgroundConfig({useFormRender:true}),
})


export default config
