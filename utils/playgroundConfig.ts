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
        pdfReaderUrl: 'https://' + process.env.DOCPAL_END_POINT + process.env.pdfReaderUrl,
        LOCAL_KEY: process.env.LOCAL_KEY || 'client,meta',
        PROXY: process.env.PROXY || 'https://app4.wclsolution.com/api',
        DASHBOARD_PROXY: process.env.DASHBOARD_PROXY || 'https://app4.wclsolution.com/public-api/report/v1/api',
        CLIENT_PROXY: process.env.CLIENT_PROXY || 'https://app4.wclsolution.com/api',
        endPoint: process.env.endPoint || 'client',
        DEFAULT_PATH: process.env.endPoint === 'admin' ? '/acl' : '/browse',
        OFFICE_END_POINT : process.env.OFFICE_END_POINT || "office.app4.wclsolution.com",
        UPLOAD_END_POINT : process.env.UPLOAD_END_POINT || "upload.app4.wclsolution.com",
        DOCPAL_END_POINT : process.env.DOCPAL_END_POINT || "app4.wclsolution.com",
        ADMIN_END_POINT : process.env.ADMIN_END_POINT || "admin.app4.wclsolution.com",
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