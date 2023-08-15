import { createResolver, defineNuxtModule, addServerHandler } from 'nuxt/kit'
import axios from 'axios';
import path from 'path';

export const api = axios.create({
    baseURL: process.env.CLIENT_ENDPOINT || 'https://app4.wclsolution.com/api',
    timeout: 50000,
})
const features = {
    BROWSE: '../../../pages/client-browse',
    UPLOAD_REQUEST: '../../../pages/client-file-request',
    SMART_FOLDER: '../../../pages/client-smart-folder',
    SEARCH: "../../../packages/dp-search",
    WORKFLOW: "../../../pages/client-workflow",
    FOLDER_CABINET: "../../../pages/client-folder-cabinet",
}
const coreFeatures = {
    RELATED_FOLDER: "../../../packages/dp-related-folder",
    BROWSE_STORE: '../../../packages/dp-browse',
    TRASH: '../../../pages/client-trash',
    SHARE_LIST: "../'../../pages/client-share-list",
    COLLECTION:"../../../pages/client-collection",
    SHARE_ME: "../../../pages/client-share-me",
    SHARE_OTHER: "../../../pages/client-share-other",
    HOLD_POLICIES: "../../../pages/client-hold-policies",
}
export default defineNuxtModule({
    meta: {
      // Usually the npm package name of your module
      name: 'client-package',
      // Compatibility constraints 
      compatibility: {
        // Semver version of supported nuxt versions
        nuxt: '^3.0.0'
      }
    },
    // Default configuration options for your module, can also be a function returning those
    defaults: {},
    // Shorthand sugar to register Nuxt hooks
    hooks: {},
    // The function holding your module logic, it can be asynchronous
    async setup(moduleOptions, nuxt) {
      // ...
      try {
          const {data} = await api.get('/docpal/systemfeature/getFeatures').then(res => res.data)
            Object.keys(data).forEach((key:string) => {
              if(!data[key] || !features[key]) return
              if(Array.isArray(features[key])) {
                  features[key].forEach((path:string) => {
                      nuxt.options._layers.push(createLayers(path as string))
                  })
              } else {
                  nuxt.options._layers.push(createLayers(features[key] as string))
              }
            })
    } catch (error) {
        
    }
        // loop coreFeatures
        Object.keys(coreFeatures).forEach((key:string) => {
            nuxt.options._layers.push(createLayers(coreFeatures[key] as string))
        })
    }
  })

  function createLayers(packagePath:string) {
    const p = path.join(__dirname, packagePath)
    const config:any = { 
        config: { 
            rootDir: p,
            srcDir: p 
        },
        cwd: p,
        source: 'nuxt.config',
        sourceOptions: {},
        configFile: p+'/nuxt.config.ts',
        meta: {} 
    }
    return config
  }