
import playgroundConfig from '../../../utils/playgroundConfig'
export default defineNuxtConfig({
  extends: ['..','../../dp-stores', '../../layout-default' ],
  modules:['@nuxt/devtools',],
  typescript: {
    includeWorkspace: true
  },
  ...playgroundConfig({useFormRender:true}),
})
