
import {CreateDocumentApi } from 'dp-api'
export const useUpload = () => {
    type Stage = 'NOT_STARTED' | 'UPLOADING' | 'VERIFY' | 'SUCCESS' | "FAIL"
    const status = ref<Stage>("NOT_STARTED")
    const uploadStatus = ref("");
    
    const fileBuffer = ref();
    
    const form = reactive({
        fileName: "",
        path: "",
        documentType: ""
    })
    async function CheckDuplicate() {
        
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
        const data = slice.data;
        console.log(data, state);
        if(!data) throw new Error('no data')
        const file = new File(
            [new Uint8Array(data)],
            'testfile.docx',
            { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }
        );
        const formData = new FormData()
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
        formData.append('files', file)
        formData.append('document', JSON.stringify({}))
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