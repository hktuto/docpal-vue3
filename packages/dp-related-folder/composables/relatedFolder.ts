import { api, searchByMeta } from 'dp-api';


type DocumentMeta = {
    [key:string] : string | any[];
  }
  
  type MayBeDocumentSetting = {
    fileType?: string[]
    meta?: string,
    related?:string[],
    label?: string,
    isRoot?: boolean,
    isFolder?: boolean
  }

  type DocumentSetting = {
    fileType: string[]
    meta: string,
    related:string[],
    label: string,
    isRoot: boolean,
    isFolder: boolean
  } 

export const useRelatedFolder =() => {

    const docTypes = useState<{[key:string] :DocumentSetting}>('docTypes', () => ({}) );

    const doc = useState('relatedDoc', () => null);

    const normalizeSetting = (setting:MayBeDocumentSetting):MayBeDocumentSetting => ({ fileType:[],meta:{},related:[],...setting})

    const relatedChildren = useState<any>('relatedChildren', () => ({}));

    async function getTypeSetting() {
        console.log("getTypeSetting")
        docTypes.value = await api.get('/nuxeo/admin/setting').then(res => res.data.data);
    }


    async function getItem(meta:any) {
        // await getSetting()
        const parentKey = meta.parentKey
        if(parentKey){
            delete meta.parentKey
        }
        return await searchByMeta(meta)
    }

    async function getItemsByMeta(doc:any, setting:MayBeDocumentSetting):Promise<Document[]> {
        if (!setting.meta) return []
        const parentKey = setting.meta.parentKey
        
        const params = {
            ['ecm:primaryType']: setting.type,
            [setting.meta as string]: doc.properties[setting.meta]
        }
        const response = await getItem(params)
        return response.map((item:any) => ({ ...item }))
    }

    async function getRelatedChild(doc:any) {
        const returnObject:any[] = []
        if(Object.keys(docTypes.value).length === 0) await getTypeSetting();
        try{
            const setting:DocumentSetting = normalizeSetting(docTypes.value[doc.type]) ;
            for( let i =0; i < setting.fileType.length; i++){
                const childFileType = setting.fileType[i]
                const childSetting = normalizeSetting(docTypes.value[childFileType])
                const childrenChildren = await getItemsByMeta(doc, childSetting)
                returnObject.push(...childrenChildren)
            }
            
            if(setting.related.length > 0){
               
                for( let i = 0; i <setting.related.length; i++ ){
                    const related = {
                        name: setting.related[i].type,
                        id: new Date().valueOf().toString(),
                        children: [] as Document[],
                      }
                    const relatedItems = await getItemsByMeta(doc, setting.related[i])
                    
                    related.children.push(...relatedItems)
                    returnObject.push(related)
                }
               
            }

        } catch(e) {
            console.log(e)
        }
        console.log()
        return returnObject 
    }

    async function getRelated() {
        const allChildren = await getRelatedChild(doc.value)

        relatedChildren.value = allChildren
    }

    onMounted(async () => {
        await getTypeSetting()
    })

    watch(doc, (newDoc) => {
        if(newDoc) {
            getRelated()
        }else {
            relatedChildren.value = {}

        }
    },{
        immediate:true
    })


    return {
        doc,
        relatedChildren,
        docTypes,
    }
}