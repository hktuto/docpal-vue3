import { api, searchByMeta } from 'dp-api/src/index';

export type DocumentMeta = {
    [key:string] : string | any[];
}

export type DocumentSetting = {
    fileType?: string[]
    meta?: DocumentMeta & {
        parentKey?: string
    }
    related?:any[],
    displayMeta?: any[],
    label?: string,
    isRoot?: boolean,
    isFolder?: boolean
}

export const uiseVirtualFolder = () => {

    const docTypes = useState<any>('DocTypes', () => {});

    const getDocType = async() => {
        const setting = await api.get('/nuxeo/admin/setting').then(res => res.data);
        docTypes.value = setting
    }
    const normalizeSetting = (setting:DocumentSetting):DocumentSetting => ({ fileType:[],meta:{},related:[],...setting})

    const getItem = async(meta:any) => {
        // await getSetting()
        const parentKey = meta.parentKey
        if(parentKey){
            delete meta.parentKey
        }
        return await searchByMeta(meta)
    }
    const getItemsByMeta = async(doc:any,setting:DocumentSetting):Promise<Document[]> => {
        if (!setting.meta) return []
        const parentKey = setting.meta.parentKey
        for( const [key ,value] of Object.entries(setting.meta)) {
            if(value && value.includes("parentValue")) {
                const pKey = (<any>value).split('?').pop();
                setting.meta[key] = doc.properties[pKey]
                
            }
        }
        if(parentKey){
            setting.meta[parentKey] = doc.properties[parentKey]
            delete setting.meta.parentKey
            delete setting.meta.isFolder
            const response = await getItem(setting.meta)
            return response.map((item:any) => ({ ...setting, ...item }))
        }else{
            const response = await getItem(setting.meta)
            delete setting.meta.isFolder
            return response.map((item:any) => ({ ...setting, ...item }))
        }
    }

    const getRelatedChild = async(doc:any):Promise<Document[]> => {
        const returnObject:Document[] = []
        try {
            // normalize setting
            
            if(!docTypes.value) {
                await getDocType()
            }
            const setting = normalizeSetting(docTypes.value[doc.type]);
            // get direct child if fileType is in the setting
            for( let i =0; i < setting.fileType.length; i++){
                const childFileType = setting.fileType[i]
                const childSetting = normalizeSetting(docTypes.value[childFileType])
                const childrenChildren = await getItemsByMeta(doc,childSetting)
                returnObject.push(...childrenChildren)
            }
            // get Related folder
            if(setting.related.length > 0){
                const related = {
                    isFolder: true,
                    name: `related`,
                    path: `${doc.path}/related`,
                    id: new Date().valueOf().toString(),
                    children: [],
                  }
                for( let i = 0; i <setting.related.length; i++ ){
                    const relatedFileType = setting.related[i];
                    // const relatedSetting = normalizeSetting(docTypeStore.docTypes[relatedFileType])
                    const relatedChildren = await searchByMeta({
                        [relatedFileType.meta]: doc.properties[relatedFileType.meta],
                        "ecm:primaryType": relatedFileType.type
                    })
                    related.children.push(...relatedChildren)
                }
                if(related.children.length > 0) returnObject.push(related)
            }
                
            
        } catch (error) {

            // TODO: error handling later
            console.log(error)
            return []
        } 
        return returnObject   
    }


    return {
        docTypes
    }
}