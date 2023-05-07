import playgroundConfig from '../../../utils/playgroundConfig'

const config = defineNuxtConfig({
  extends: ['..', '../../dp-stores',  '../../dp-auth', '../../layout-default',],
  devTools: true,
  ...playgroundConfig({}),
})


export default config
