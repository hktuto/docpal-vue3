// @ts-ignore
import VForm3 from 'vform3-builds' 
import 'vform3-builds/dist/designer.style.css' 

export default defineNuxtPlugin(nuxtApp => {
    // Doing something with nuxtApp
    nuxtApp.vueApp.use(VForm3);
})