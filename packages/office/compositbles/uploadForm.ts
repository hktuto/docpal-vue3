import {duplicateDetectionApi, GetDocumentAdditionalApi} from "dp-api";
import {useUpload} from "~/compositbles/upload";
import {ElNotification} from "element-plus";


export const useUploadForm = () => {

    const { docTypeList } = useUpload();
    
    const form = reactive({
        fileName: "",
        path: "",
        docType: null as any,
        displayMeta: [],
        metadata:{} as any,
    })

    async function docTypeChange(){
        form.metadata = {};
        if(!form.docType) form.displayMeta = [];
        const metaList =  await GetDocumentAdditionalApi({documentType: form.docType})
        form.displayMeta = metaList.reduce((p:any, item:any) => {
            if (item.display) {
                item.value = null;
                p.push(item)
            }
            return p
        }, [])
    }

    async function CheckDuplicate(fileName : string) {
        const res = await duplicateDetectionApi({path:form.path, titles:[form.fileName]})
        if(res[fileName]) {
            ElNotification({
                title: 'Duplicate File',
                message: `A file with the name ${form.fileName} already exists in this folder. Please rename the file and try again.`,
                type: 'warning'
            })
            throw new Error('not implemented')
        }
    }
    
    
    return {
        CheckDuplicate,
        docTypeChange,
        form
    }
}