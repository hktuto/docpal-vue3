

import VForm3 from 'v-form/dist/render.umd' 
import 'v-form/dist/render.style.css' 

export default defineNuxtPlugin(nuxtApp => {
    // Doing something with nuxtApp
    nuxtApp.vueApp.use(VForm3);
})