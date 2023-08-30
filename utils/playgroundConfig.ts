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
        keycloakConfig: {
          "url": process.env.keycloakUrl,
          "realm": process.env.keycloakRealm,
          "clientId": process.env.keycloakClientId,
          "ssl-required": "external",
          "public-client": true,
          "confidential-port": 0
        }
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
export const skeycloakConfig = (options:RuntimeOption) => {
  console.log(process.env);
  
  return {
    "url": process.env.keycloakUrl,
    "ralm": process.env.keycloakRealm,
    "clientId": process.env.keycloakClientId,
    "ssl-required": "external",
    "public-client": true,
    "confidential-port": 0
  }
}
   
export default makeConfig