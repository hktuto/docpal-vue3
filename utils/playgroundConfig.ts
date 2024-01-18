// @ts-ignore
const ExcutingAnOrder = process.env.npm_lifecycle_script.split(' ')
const env = ExcutingAnOrder[ExcutingAnOrder.length - 1];
const defaultConfig = {
  plugins:[

  ] as any[],
  runtimeConfig:{
      public:{
        env,
        mode: process.env.NODE_ENV
        // availableLocales:['zh-CN','en-US','zh-HK'],
      }
  },
  vite:{
    optimizeDeps:{
        include: []
    }
  }
}

type RuntimeOption = {
  useFormRender?:boolean,
  useFormDesigner?:boolean,
}


const makeConfig = (options:RuntimeOption) => {
   
  return defaultConfig
}
   
export default makeConfig