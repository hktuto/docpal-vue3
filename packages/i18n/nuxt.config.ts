// https://v3.nuxtjs.org/api/configuration/nuxt.config
import i18nSetting, {availableLocales} from './makeI18nSetting'

export default defineNuxtConfig({
    modules: [
      '@nuxtjs/i18n',
      ],
      // @ts-ignore
      i18n: i18nSetting(),
      runtimeConfig:{
        public: {
          availableLocales
        }
      }
})
