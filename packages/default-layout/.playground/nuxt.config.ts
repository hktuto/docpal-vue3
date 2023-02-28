import playgroupConfig from '../../../playgroupConfig'

const config =  defineNuxtConfig({
  extends: ['..',"../../color-mode" , '../../element-ui', '../../i18n', '../../dp-components'],
  ...playgroupConfig,
  vite:{
    optimizeDeps:{
        include: ['v-form/dist/designer.umd']
    }
  }
})


export default config