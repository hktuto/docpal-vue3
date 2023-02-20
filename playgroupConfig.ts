
export default  {
    runtimeConfig:{
        public:{
          pdfReaderUrl: process.env.pdfReaderUrl || 'http://localhost:8888/web/viewer.html',
          LOCAL_KEY: process.env.LOCAL_KEY || 'client,meta',
          PROXY: process.env.PROXY || 'https://app4.wclsolution.com/api',
          
        }
    },
}