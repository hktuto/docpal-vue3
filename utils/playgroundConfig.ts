const ExcutingAnOrder = process.env.npm_lifecycle_script.split(' ')
const env = ExcutingAnOrder[ExcutingAnOrder.length - 1];
const defaultConfig = {
  plugins:[

  ],
  runtimeConfig:{
      env,
      public:{
        pdfReaderUrl: process.env.pdfReaderUrl || 'http://localhost:8888/web/viewer.html',
        LOCAL_KEY: process.env.LOCAL_KEY || 'client,meta',
        PROXY: process.env.PROXY || 'https://app4.wclsolution.com/api',
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
  if(options.useFormDesigner) {
    defaultConfig.vite.optimizeDeps.include.push('v-form/dist/designer.umd');
    defaultConfig.plugins.push({
      src:'../../../utils/formDesignerPlugin', mode: 'client'
    })
  }
  if(options.useFormRender) {
    defaultConfig.vite.optimizeDeps.include.push('v-form/dist/designer.umd');
    defaultConfig.plugins.push({
      src:'../../../utils/formRenderPlugin', mode: 'client'
    })
  }
  return defaultConfig
}
export default makeConfig