

import VForm3 from 'v-form/dist/designer.umd' 
import 'v-form/dist/designer.style.css' 

export default defineNuxtPlugin(nuxtApp => {
    // Doing something with nuxtApp
    nuxtApp.vueApp.use(VForm3);
})