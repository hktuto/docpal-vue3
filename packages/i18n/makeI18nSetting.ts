

const fallbackLocale = 'en-US';
const locale = 'en-US' // default locale;
export const availableLocales = [ 'en-US', 'zh-CN', 'zh-HK']

export default () => {
    return {
        vueI18n: {
            locale,
            fallbackLocale,
        },

    }
}