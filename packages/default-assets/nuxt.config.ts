import { createResolver } from '@nuxt/kit'
const { resolve } = createResolver(import.meta.url)
// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    modules:[
        '@nuxtjs/color-mode',
        "@element-plus/nuxt"
    ],
    css:[
       // app default theme
        resolve('./theme/app.scss'),
        // dark theme
        resolve('./theme/element-plus/dark.scss')
        
    ],
    
    colorMode:{
        classSuffix:'',
      },
    elementPlus:{
        importStyle: 'scss',
        // themes:['no']
      },
    vite: {
        plugins: [],
          css: {
            // 自定义主题和解决样式未导入问题
            preprocessorOptions: {
              scss: {
                additionalData: `@use "${resolve('./theme/element-plus/default.scss')}" as *; \n`,
              },
            },
          }, 
      },
})
