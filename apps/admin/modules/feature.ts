import { createResolver, defineNuxtModule, addServerHandler } from 'nuxt/kit'
import axios from 'axios';
import path from 'path';

export const api = axios.create({
    baseURL: process.env.CLIENT_ENDPOINT || 'https://admin.app4.wclsolution.com/api',
    timeout: 50000,
})
const features = {
    SMART_FOLDER: '../../../pages/admin-pre-search-config',
    SEARCH: "../../../packages/dp-search",
    WORKFLOW: ["../../../pages/admin-workflow-form", "../../../pages/admin-workflow-manage"],
    FOLDER_CABINET: "../../../pages/admin-folder-cabinet",
    SHARE_EXTERNAL: "../../../pages/admin-share-list",
    SHARE_INTERNAL: "../../../pages/admin-internal-share",
    WATERMARK: ["../../../pages/admin-watermark", "../../../packages/dp-watermark"],
    BULK_IMPORT: "../../../pages/admin-bulk-import-config",
    AUDIT: "../../../pages/admin-audit",
    DIRECTUS: "../../../pages/admin-directus",
    DOCKER_LOG: "../../../pages/admin-docker-log",
    VOCABULARY: "../../../pages/admin-vocabulary",
    GENERATE_TEMPLATE: "../../../pages/admin-doc-template",
    DAM_FILE_CONVERTION: "../../../pages/admin-dam",
    LOG_MANAGE: "../../../pages/admin-log-manage",
    DOCUMENT_TYPE: "../../../pages/admin-doc-type-manage",
    MAIL_CONFIG: "../../../pages/admin-mail-config",
    MAIL_TEMPLATE: "../../../pages/dp-editorjs",
    JOB_STATUS: "../../../pages/admin-message-queue",
    
}
const coreFeatures = {
    Retention: "../../../pages/admin-retention",
    ACL: "../../../pages/admin-acl",
    META_MANAGE: "../../../pages/admin-meta-manage",
    TABLE_SETTING: "../../../pages/admin-table-setting",
    USER_MANAGE: "../../../pages/admin-user-manage",
    HOLD_POLICIES: "../../../pages/admin-hold-policies",
    BROWSE_STORE: '../../../packages/dp-browse',
    EMAIL_TEMPLATE: '../../../packages/dp-editorjs'
    
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
            console.log(data)
          //   nuxt.options.runtimeConfig.public.features = data
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
        console.log("No Feature API")
        Object.keys(features).forEach((key:string) => {
            if(Array.isArray(features[key])) {
                
                features[key].forEach((path:string) => {
                    nuxt.options._layers.push(createLayers(path as string))
                })
            } else {
                nuxt.options._layers.push(createLayers(features[key] as string))
            }
        })
    }
        // loop coreFeatures
        Object.keys(coreFeatures).forEach((key:string) => {
            if(Array.isArray(coreFeatures[key])) {
                coreFeatures[key].forEach((p:string) => {
                    console.log(p)
                    nuxt.options._layers.push(createLayers(p as string))
                })
            }else {
                nuxt.options._layers.push(createLayers(coreFeatures[key] as string))
            }
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