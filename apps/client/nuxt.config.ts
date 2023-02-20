import {customLayer} from './packageManage'
import playgroundConfig from '../../playgroupConfig'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    components: true,
    // color mode setting
    extends: [
        ...customLayer()
    ],
    ...playgroundConfig
})
