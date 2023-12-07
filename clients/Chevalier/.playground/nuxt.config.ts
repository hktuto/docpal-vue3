import playgroundConfig from '../../../utils/playgroundConfig'

const config = defineNuxtConfig({
  extends: ['..',  '../../../apps/client'],
  ssr: false,
  devtool: true,
  ...playgroundConfig({}),
})


export default config
