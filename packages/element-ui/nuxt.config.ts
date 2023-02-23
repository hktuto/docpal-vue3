import { createResolver } from '@nuxt/kit'
const { resolve } = createResolver(import.meta.url)
// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    modules:[
        // "@element-plus/nuxt"
    ],
    css:[
        // dark theme
        resolve('./theme/element-plus/dark.scss')
        
    ],
    // @ts-ignore
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
                // additionalData: `@use "${resolve('./theme/element-plus/default.scss')}" as *; \n`,
              },
            },
          }, 
      },
})
