// https://v3.nuxtjs.org/api/configuration/nuxt.config
import i18nSetting from './makeI18nSetting'


export default defineNuxtConfig({
    modules: [
        '@intlify/nuxt3',
      ],
      intlify: i18nSetting()
})
