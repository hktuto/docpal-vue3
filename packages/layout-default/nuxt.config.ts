import { createResolver } from '@nuxt/kit'
const { resolve } = createResolver(import.meta.url)
// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    extends: [
      '../color-mode', '../element-ui', '../i18n', '../dp-search', '../dp-form', '../dp-components'
    ],
    css:[
      // dark theme
      resolve('./theme/app.scss')
    ],
    
})
