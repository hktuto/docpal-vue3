import { IntlifyModuleOptions,  } from '@intlify/nuxt3';

const fallbackLocale = 'en-US';
const locale = 'en-US' // default locale;
export const availableLocales = [ 'en-US', 'zh-CN', 'zh-HK']

export default ():IntlifyModuleOptions => {
    return {
        vueI18n: {
            locale,
            fallbackLocale,
        },

    }
}