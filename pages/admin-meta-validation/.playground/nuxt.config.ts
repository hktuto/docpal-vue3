import playgroundConfig from '../../../utils/playgroundConfig'

const config = defineNuxtConfig({
  extends: ['..', '../../dp-stores',  '../../dp-auth', '../../layout-default',],
  ssr: false,
  devtool: true,
  ...playgroundConfig({}),
})


export default config
