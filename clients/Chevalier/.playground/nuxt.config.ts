import playgroundConfig from '../../../utils/playgroundConfig'

const config = defineNuxtConfig({
  extends: ['..',  '../../../packages/dp-auth', '../../../packages/layout-default', '../../../pages/client-workflow'],
  ssr: false,
  devtool: true,
  ...playgroundConfig({}),
})


export default config
