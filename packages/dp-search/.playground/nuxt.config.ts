import playGroupConfig from '../../../playgroupConfig' 

export default defineNuxtConfig({
  extends: ['..', '../../default-layout', '../../dp-auth', '../../dp-stores'],
  ...playGroupConfig,
  vite:{
    optimizeDeps:{
        include: ['v-form/dist/designer.umd']
    }
  }
})
