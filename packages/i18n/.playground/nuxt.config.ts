import playgroundConfig from '../../../utils/playgroundConfig'

const config = defineNuxtConfig({
  extends: ['..', '../../dp-auth' , '../../dp-stores', '../../layout-default'],
  ...playgroundConfig({})
})


export default config