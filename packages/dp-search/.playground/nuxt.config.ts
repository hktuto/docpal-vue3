import playgroundConfig from '../../../utils/playgroundConfig' 

export default defineNuxtConfig({
  extends: ['..',  '../../dp-auth', '../../dp-stores', '../../layout-default',],
  ...playgroundConfig({useFormRender:true}),
  
})
