import {customLayer} from './packageManage'
import playgroundConfig from '../../utils/playgroundConfig'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    ssr:false,
    components: true,
    devtools: true,
    // color mode setting
    extends: [
        ...customLayer()
    ],
    ...playgroundConfig({}),

})
