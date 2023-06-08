
import CodeDiff from 'v-code-diff'

export default defineNuxtPlugin(nuxtApp => {
    // Doing something with nuxtApp
    nuxtApp.vueApp.use(CodeDiff)
  })