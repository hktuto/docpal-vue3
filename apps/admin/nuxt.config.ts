import {customLayer} from './packageManage'
import playgroundConfig from '../../utils/playgroundConfig'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    ssr: false,
    app: {
        head: {
            charset: 'utf-8',
            viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
            title: "DocPal",
            link: [
                { ref: "manifest", href: '/site.webmanifest' },,
            ]
        }
    },
    devtools: {
        enable: true
    },
    // color mode setting
    extends: [
        ...customLayer()
    ],
    ...playgroundConfig({}),

})
