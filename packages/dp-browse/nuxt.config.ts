// https://v3.nuxtjs.org/api/configuration/nuxt.config
// @ts-ignore
const ExcutingAnOrder = process.env.npm_lifecycle_script.split(' ')
const env = ExcutingAnOrder[ExcutingAnOrder.length - 1];
export default defineNuxtConfig({
    extends: env === 'dev' ? ['../dp-stores', '../i18n', '../default-assets', '../dp-components'] : [],
})
