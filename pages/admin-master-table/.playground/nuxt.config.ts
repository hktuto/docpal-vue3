import playgroundConfig from '../../../utils/playgroundConfig'

// @ts-ignore
const config = defineNuxtConfig({
  ssr: false,
  extends: ['..', '../../dp-stores', '../../dp-browse', '../../dp-auth', '../../layout-default' ],
  ...playgroundConfig({useFormRender:true}),
})


export default config
