import playgroundConfig from '../../../utils/playgroundConfig'

export default defineNuxtConfig({
  ssr:false,
  devtools: {
        enable: true
    },
  extends: ['..','../../../packages/dp-browse','../../../packages/dp-search',"../../../packages/dp-stores", "../../../packages/dp-auth", "../../../packages/dp-language", `../../../packages/layout-default`],
  ...playgroundConfig({}),
})
