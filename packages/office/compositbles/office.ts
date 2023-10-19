import {useUpload} from "~/compositbles/upload";


export const useOffice = () => {
    const { status, result, mineType, ext } = useUpload()
    const host = useState('officeHost',() => "");
    const ready = useState('officeReady',() => false);
    const platform = useState('platform',() => "");
    const checkReadyInterval = useState("checkReadyInterval");
    
    function initOffice() {
        // @ts-ignore
        if(!Office) return;
        Office.onReady((info:any) => {
            console.log(info)
            host.value = info.host;
            platform.value = info.platform;
            // @ts-ignore
            if(info.host === Office.HostType.Word){
                mineType.value = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                ext.value = '.docx'
            }
            // @ts-ignore
            if(info.host === Office.HostType.Excel){
                mineType.value = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                ext.value = '.xlsx'
            }
            // @ts-ignore
            if(info.host === Office.HostType.PowerPoint){
                mineType.value = 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
                ext.value = '.pptx'
            }

            ready.value = true;
        })
    }
    
    function checkOffice() {
        checkReadyInterval.value = setInterval(() => {
            console.log("interval run");
            if(ready.value){
                // @ts-ignore
                clearInterval(checkReadyInterval.value)
            }else {
                initOffice();
            }
        }, 300)
    }
        

    
    
    return {
        status,
        result,
        mineType,
        ext,
        host,
        ready,
        checkOffice,
        platform,
    }
}