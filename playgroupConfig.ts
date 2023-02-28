const ExcutingAnOrder = process.env.npm_lifecycle_script.split(' ')
const env = ExcutingAnOrder[ExcutingAnOrder.length - 1];

export default  {
    runtimeConfig:{
        env,
        public:{
          pdfReaderUrl: process.env.pdfReaderUrl || 'http://localhost:8888/web/viewer.html',
          LOCAL_KEY: process.env.LOCAL_KEY || 'client,meta',
          PROXY: process.env.PROXY || 'https://app4.wclsolution.com/api',
        }
    },
}