import playgroundConfig from '../../../utils/playgroundConfig'
import {customLayer} from '../packageManage'

const config = defineNuxtConfig({
  ssr:false,
  extends: [
    ...customLayer()
  ],
  ...playgroundConfig({}),
})


export default config
