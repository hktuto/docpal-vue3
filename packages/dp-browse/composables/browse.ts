
import {DocDetail} from "dp-api";
import {actions } from '../utils/browseActions'
import { AllowTo } from "../utils/permissionHelper";
import {useRoute} from "vue-router";
import {getDocumentDetailSync, openFileDetail} from "../utils/browseHelper";
type SlotData = {
    name: string,
    order: number,
    component: any
}
export const useBrowse = () => {
    const infoSlots = useState<SlotData[]>('infoSlots', () => shallowRef<SlotData[]>([]));

    ///#region other store
    const userId:string = useUser().getUserId()
   
    ///#endregion
    
    const route = useRoute();
    const loading = useState('browseLoadingState', () => false)
    const forceRefresh = useState('browseForceRefreshState', () => false)

    const currentDocument = useState<{
        doc?: DocDetail
        permission: AllPermission
    }>('browseState')
    
    
    

    async function getDocDetail() {
        loading.value = true;
        const currentPath = route.query.path as string || '/'
        console.log("getDocDetail", currentPath)
        // const response = await getDocumentDetail(routePath.value, userId)
        const response = await getDocumentDetailSync(currentPath, userId)

        if(response.doc.isFolder) {
            // check if the path is the same
            if(currentDocument.value && currentDocument.value.doc?.id === response.doc.id && !forceRefresh.value) {
                return
            }
            currentDocument.value = response
            forceRefresh.value = false

        } else {
            if(!currentDocument.value) {
                // split router path to get parent path
                const parentPath = currentPath.split('/').slice(0, -1).join('/')
                // currentDocument.value =  await getDocumentDetail(parentPath, userId)
                currentDocument.value =  await getDocumentDetailSync(parentPath, userId)
            }
            // open detail
            openFileDetail(currentPath, {
                showInfo:true,
                showHeaderAction:true,
                openEdit:false
            })
        }
        loading.value = false;
    }

    async function handleRefresh(){
        forceRefresh.value = true
        await getDocDetail()
        // if(currentDocument?.value?.doc?.isFolder) breadCrumb.value.handleRefresh();
    }
    
    
    
    
    return {
        // slots
        infoSlots,
        // data 
        actions,
        // state
        loading,
        currentDocument,
        // method
        getDocDetail,
        handleRefresh
    }
}