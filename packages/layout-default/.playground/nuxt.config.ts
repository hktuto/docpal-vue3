import playgroundConfig from '../../../utils/playgroundConfig'

const config =  defineNuxtConfig({
  extends: ['..',"../../color-mode" , '../../element-ui', '../../i18n', '../../dp-components'],
  ...playgroundConfig({}),
})


export default config