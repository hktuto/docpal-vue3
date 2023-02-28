import playgroundConfig from '../../../utils/playgroundConfig' 

export default defineNuxtConfig({
  extends: ['..', '../../default-layout', '../../dp-auth', '../../dp-stores'],
  ...playgroundConfig({useFormRender:true}),
  
})
