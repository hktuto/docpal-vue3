
import {CreateDocumentApi } from 'dp-api'
export const useUpload = () => {
    type Stage = 'NOT_STARTED' | 'UPLOADING' | 'VERIFY' | 'SUCCESS' | "FAIL"
    const status = ref<Stage>("NOT_STARTED")
    const uploadStatus = ref("");
    
    const form = reactive({
        fileName: "",
        path: "",
        documentType: ""
    })
    async function CheckDuplicate() {
        
    }
    
    async function createDocument() {
        
    }
    async function Upload() {
        try {
            await CheckDuplicate()
            await createDocument()
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
            
        }
    }
    
    function getSlice(state) {
        state.file.getSliceAsync(state.counter, function (result) {
            if (result.status == Office.AsyncResultStatus.Succeeded) {
                sendSlice(result.value, state);
            } else {
                // updateStatus(result.status);
            }
        });
    }
    
    async function sendSlice(slice, state) {
        var data = slice.data;
        console.log(data);
        if(!data) throw new Error('no data')
        // const parentPath = state._doc.path === '/' ? '' : state._doc.path
        // const document = {
        //     name: file.fileName,
        //     idOrPath: `${parentPath}/${file.fileName}`,
        //     type: file.type,
        //     languages: file.languages,
        //     properties: file.metaList.reduce((prev, metaItem) => {
        //         if (metaItem.value) prev[metaItem.metaData] = metaItem.value
        //         return prev
        //     },{})
        // }
        // const formData = new FormData()
        // formData.append('files', data)
        // formData.append('document', JSON.stringify(document))
        //
        // await CreateDocumentApi(formData).then((res) => {
        //     return !!res
        // })
    }   
    
    return {
        status,
        form,
        Upload
    }
    
    
}