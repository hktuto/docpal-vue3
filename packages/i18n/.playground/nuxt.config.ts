import playgroupConfig from '../../../playgroupConfig'

const config = defineNuxtConfig({
  extends: ['..', '../../dp-stores'],
  ...playgroupConfig
})


console.log(config)

export default config