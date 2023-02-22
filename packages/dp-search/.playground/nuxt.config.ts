import playGroupConfig from '../../../playgroupConfig' 

export default defineNuxtConfig({
  extends: ['..', '../../default-layout', '../../dp-auth', '../../dp-stores'],
  ...playGroupConfig
})
