import {customLayer} from './packageManage'
import playgroundConfig from '../../playgroundConfig'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    components: true,
    // color mode setting
    extends: [
        ...customLayer()
    ],
    ...playgroundConfig
})
