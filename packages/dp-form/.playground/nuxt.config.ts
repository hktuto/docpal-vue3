
import playgroupConfig from '../../../playgroupConfig'
export default defineNuxtConfig({
  extends: ['..','../../dp-stores', '../../default-layout', '../../dp-auth'],
  typescript: {
    includeWorkspace: true
  },
  ...playgroupConfig,
  vite:{
    optimizeDeps:{
        include: ['v-form/dist/designer.umd']
    }
  }
})
