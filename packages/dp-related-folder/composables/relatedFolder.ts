

type DocumentMeta = {
    [key:string] : string | any[];
  }
  
  type DocumentSetting = {
    fileType?: string[]
    meta?: DocumentMeta & {
      parentKey?: string
    }
    related?:string[],
    label?: string,
    isRoot?: boolean,
    isFolder?: boolean
  }

function useRelatedFolder() {

    const doc = useState('relatedDoc', () => null);

    const normalizeSetting = (setting:DocumentSetting):DocumentSetting => ({ fileType:[],meta:{},related:[],...setting})

    const relatedChildren = useState('relatedChildren', () => ({}));


    async function getRelatedChild(doc:any) {
        const returnObject:Document[] = []
        const setting:DocumentSetting = normalizeSetting(docTypeStore.docTypes[doc.type]);
    }

    async function getRelated() {
        const allChildren = await getRelatedChild(doc)

        const related = allChildren.find((d:any) => d.name === 'related') || {
            children: [],
        }
        const empty: any = {}
        relatedChildren.value = related.children.reduce(
            (result: any, current:any) => {
                if (result[current.type]) {
                    result[current.type].push(current)
                } else {
                    result[current.type] = [current]
                }
                return result
            },
            empty
        )
    }

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
    }
}