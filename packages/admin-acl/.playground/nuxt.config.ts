import playgroundConfig from '../../../utils/playgroundConfig'

const config = defineNuxtConfig({
  extends: ['..', '../../dp-stores',  '../../dp-auth', '../../layout-default', '../../client-browse'],
  devTools: true,
  ...playgroundConfig({}),
})


export default config
