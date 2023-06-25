

import VForm3 from 'v-form' 
import 'v-form/dist/designer.style.css' 

// @ts-ignore
export default defineNuxtPlugin(nuxtApp => {
    // Doing something with nuxtApp
    nuxtApp.vueApp.use(VForm3);
})

