import playgroundConfig from '../../../utils/playgroundConfig'

const config = defineNuxtConfig({
  extends: ['..', '../../dp-stores'],
  ...playgroundConfig
})


console.log(config)

export default config