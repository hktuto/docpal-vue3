// https://v3.nuxtjs.org/api/configuration/nuxt.config
import i18nSetting from './makeI18nSetting'
import { createResolver } from '@nuxt/kit'
const { resolve } = createResolver(import.meta.url)

const styles = resolve('./assets/editLanguageStyle.scss')

export default defineNuxtConfig({
    css:[
      styles
    ],
    modules: [
        '@intlify/nuxt3',
      ],
      intlify: i18nSetting()
})
