
import playgroundConfig from '../../../utils/playgroundConfig'
export default defineNuxtConfig({
  extends: ['..','../../dp-stores', '../../default-layout', '../../dp-auth'],
  typescript: {
    includeWorkspace: true
  },
  ...playgroundConfig({useFormRender:true}),
})
