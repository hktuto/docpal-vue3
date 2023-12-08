import playgroundConfig from '../../../utils/playgroundConfig'

const config = defineNuxtConfig({
  extends: ['..'],
  ssr: false,
  devtool: true,
  ...playgroundConfig({}),
})


export default config
