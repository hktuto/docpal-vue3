import { createResolver } from '@nuxt/kit'
const { resolve } = createResolver(import.meta.url)
// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    extends: [
      '../color-mode', 
      '../element-ui', 
      '../dp-stores', 
      '../i18n', 
      '../dp-components', 
      '../dp-ai', 
      '../dp-log', 
      '../dp-notification', 
      "../dp-error-page"
    ],
    css:[
      // dark theme
      resolve('./theme/app.scss')
    ],
    modules: [
      '@nuxtjs/device',
    ]

})
