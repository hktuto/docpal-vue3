import {NuxtI18nOptions} from '@nuxtjs/i18n';

const fallbackLocale = 'en-US';
const locale = 'en-US' // default locale;
export const availableLocales = [ 'en-US', 'zh-CN', 'zh-HK']

export default ():NuxtI18nOptions => {
    return {
        vueI18n: {
            locale,
            fallbackLocale,
        },

    }
}