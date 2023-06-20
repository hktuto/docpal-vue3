
import {CreateDocumentApi, DocType, duplicateDetectionApi, getDocTypeListApi, GetDocumentAdditionalApi} from 'dp-api'
import { ElNotification } from 'element-plus'
export const useUpload = () => {
    type Stage = 'NOT_STARTED' | 'UPLOADING' | 'VERIFY' | 'SUCCESS' | "FAIL"
    const status = useState<Stage>("uploadStatus", () => "NOT_STARTED")
    const uploadStatus = ref("");
    
    const result = useState<any>('uploadResult', () => ({}));
    const docTypeList = ref<DocType[]>([])
    
    const fileBuffer = ref();
    
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
    
    async function getDocTypeList() {
     const list = await getDocTypeListApi()
        docTypeList.value = list.filter( item => !item.isFolder && item.name !== 'Audio' && item.name !== 'Video' && item.name !== 'Picture')
    }
    async function CheckDuplicate() {
        const res = await duplicateDetectionApi({path:form.path, titles:[form.fileName]})
        if(res[form.fileName]) {
            ElNotification({
                title: 'Duplicate File',
                message: `A file with the name ${form.fileName} already exists in this folder. Please rename the file and try again.`,
                type: 'warning'
            })
            throw new Error('not implemented')
        }
    }
    
    async function Upload() {
        try {
            await CheckDuplicate()
            Office.context.document.getFileAsync("compressed",
                {sliceCount: 1},
                (result:any) => {
                    if(result.status === Office.AsyncResultStatus.Succeeded) {
                        var myFile = result.value;
                        var state = {
                            file: myFile,
                            counter: 0,
                            sliceCount: myFile.sliceCount
                        };
                        status.value = 'UPLOADING'
                        getSlice(state)
                    }
                }
                )
        }catch( err ) {
            console.log(err)
            throw new Error('not implemented')
        }
    }
    
    function getSlice(state:any) {
        state.file.getSliceAsync(state.counter, function (result) {
            if (result.status == Office.AsyncResultStatus.Succeeded) {
                sendSlice(result.value, state);
            } else {
                // updateStatus(result.status);
            }
        });
    }
    
    async function sendSlice(slice:any, state:any) {
        const data = slice.data;
        console.log(data, state);
        if(!data) throw new Error('no data')
        const file = new File(
            [new Uint8Array(data)],
            'testfile.docx',
            { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }
        );
        const formData = new FormData()
        const document = {
            name: form.fileName,
            idOrPath: `${form.path}/${form.fileName}`,
            type: form.docType,
            properties: form.metadata
        }
        formData.append('files', file)
        formData.append('document', JSON.stringify(document))
        result.value = await CreateDocumentApi(formData)
        closeFile(state);
        status.value = 'SUCCESS'
    }
    
    function closeFile(state:any){
        state.file.closeAsync(function (result:any) {

            // If the result returns as a success, the
            // file has been successfully closed.
            if (result.status === Office.AsyncResultStatus.Succeeded) {
                status.value = 'SUCCESS'
            } else {
            }
        });
    }
    
    
    onMounted(() => getDocTypeList());
    return {
        status,
        form,
        Upload,
        docTypeList,
        docTypeChange,
        result
    }
    
    
}