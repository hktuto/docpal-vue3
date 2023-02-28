import playgroupConfig from '../../../playgroupConfig'

const config =  defineNuxtConfig({
  extends: ['..',"../../color-mode" , '../../element-ui', '../../i18n', '../../dp-components'],
  ...playgroupConfig
})


export default config