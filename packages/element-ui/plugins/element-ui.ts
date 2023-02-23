// @ts-ignore
import ElementPlus from 'element-plus'
import '../theme/element-plus/dark.scss'
export default defineNuxtPlugin(nuxtApp => {
    // Doing something with nuxtApp
    nuxtApp.vueApp.use(ElementPlus);
})