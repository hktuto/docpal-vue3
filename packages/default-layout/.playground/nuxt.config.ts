import playgroupConfig from '../../../playgroupConfig'

const config =  defineNuxtConfig({
  extends: ['..',"../../color-mode" , '../../element-ui', '../../i18n'],
  ...playgroupConfig
})



console.log(config)

export default config