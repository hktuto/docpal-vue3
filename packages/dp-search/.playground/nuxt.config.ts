import playgroundConfig from '../../../utils/playgroundConfig' 

export default defineNuxtConfig({
  extends: ['..', '../../layout-default', '../../dp-auth', '../../dp-stores'],
  ...playgroundConfig({useFormRender:true}),
  
})
