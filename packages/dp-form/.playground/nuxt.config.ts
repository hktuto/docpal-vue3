
import playgroundConfig from '../../../utils/playgroundConfig'
export default defineNuxtConfig({
  extends: ['..','../../dp-stores', '../../layout-default', '../../dp-auth'],
  typescript: {
    includeWorkspace: true
  },
  ...playgroundConfig({useFormRender:true}),
})
