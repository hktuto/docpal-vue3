import playgroundConfig from '../../../utils/playgroundConfig'

// @ts-ignore
const config = defineNuxtConfig({
  ssr: false,
  extends: ['..', '../../dp-stores', '../../dp-auth', '../../layout-default', '../../client-workflow' ],
  ...playgroundConfig({useFormRender:true}),
})


export default config
