// @ts-ignore
const ExcutingAnOrder = process.env.npm_lifecycle_script.split(' ')
const env = ExcutingAnOrder[ExcutingAnOrder.length - 1];
const defaultConfig = {
  plugins:[

  ] as any[],
  runtimeConfig:{
      public:{
        env,
        mode: process.env.NODE_ENV,
        pdfReaderUrl: process.env.pdfReaderUrl || 'http://localhost:8888/web/viewer.html',
        LOCAL_KEY: process.env.LOCAL_KEY || 'client,meta',
        PROXY: process.env.PROXY || 'https://app4.wclsolution.com/api',
        endPoint: process.env.endPoint || 'client',
        DEFAULT_PATH: process.env.endPoint === 'admin' ? '/acl' : '/browse',
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