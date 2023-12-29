
import { useEventListener } from '@vueuse/core'
import { DocDetail } from "dp-api"
import BrowseActionsHold from '../../../packages/dp-browse/components/browse/Actions/hold.vue'
import BrowseActionsSubscribe from '../../../packages/dp-browse/components/browse/Actions/subscribe.vue'
import BrowseActionsEdit from '../../../packages/dp-browse/components/browse/Actions/edit.vue'
import BrowseActionsNew from '../../../packages/dp-browse/components/browse/Actions/new.vue'
import BrowseActionsDelete from '../../../packages/dp-browse/components/browse/Actions/delete.vue'
import BrowseActionsCopyPath from '../../../packages/dp-browse/components/browse/Actions/copyPath.vue'
import BrowseActionsUploadRequest from '../../../packages/dp-browse/components/browse/Actions/uploadRequest.vue'
import BrowseActionsReplace from '../../../packages/dp-browse/components/browse/Actions/replace/index.vue'
import BrowseActionsDownload from '../../../packages/dp-browse/components/browse/Actions/download.vue'
import BrowseActionsOffice from '../../../packages/dp-browse/components/browse/Actions/office.vue'
import BrowseActionsShare from '../../../packages/dp-browse/components/browse/Actions/share.vue'

import {openFileDetail} from '../../../packages/dp-browse/utils/browseHelper'
import { useRoute } from 'vue-router'
import { Permission, AllPermission } from '../../../packages/dp-browse/utils/permission'


type BrowseActionItem = {
    name: string
    icon?: string
    showInfolder:boolean
    showInDetail:boolean
    permission:Permission
    needFeature?:string[]
    component:any
    groupBy:string
}
type ShareActionItem = {
    name: string
    icon: string
    permission:Permission
    component:any
    needFeature?:string[]
}
export const useClientBrowseStore = ( ) => {
    const userId:string = useUser().getUserId()
    const route = useRoute();
    const routePath = computed( () => (route.query.path as string) || '/')
    const loading = useState('browseLoadingState', () => false)
    const forceRefresh = useState('browseForceRefreshState', () => false)
    const currentDocument = useState<{
        doc?: DocDetail
        permission: AllPermission
    }>('browseState')
    const actions:BrowseActionItem[] = [
        {
            name:'Hold',
            showInfolder:true,
            showInDetail:false,
            permission:'Read',
            component:BrowseActionsHold,
            groupBy:'holdStatus'
        },
        {
            name:'Subscribe',
            showInfolder:true,
            showInDetail:true,
            permission:'Read',
            component:BrowseActionsSubscribe,
            groupBy:'holdStatus'
        },
        {
            name:'Edit',
            showInfolder:true,
            showInDetail:false,
            permission:'ReadWrite',
            component:BrowseActionsEdit,
            groupBy:'normal'
        },
        {
            name:'New',
            showInfolder:true,
            showInDetail:false,
            permission:'ReadWrite',
            component:BrowseActionsNew,
            groupBy:'normal'
        },
        {
            name:'Delete',
            showInfolder:true,
            showInDetail:true,
            permission:'ReadWrite',
            component:BrowseActionsDelete,
            groupBy:'normal'
        },
        {
            name:'copyPath',
            showInfolder:true,
            showInDetail:true,
            permission:'ReadWrite',
            component:BrowseActionsCopyPath,
            groupBy:'normal'
        },
        {
            name:'replace',
            showInfolder:false,
            showInDetail:true,
            permission:'ReadWrite',
            component:BrowseActionsReplace,
            groupBy:'normal'
        },
        {
            name:'download',
            showInfolder:false,
            showInDetail:true,
            permission:'ReadWrite',
            component:BrowseActionsDownload,
            groupBy:'normal'
        },
        {
            name:'office',
            showInfolder:false,
            showInDetail:true,
            permission:'ReadWrite',
            component:BrowseActionsOffice,
            groupBy:'normal'
        },
        {
            name:'share',
            showInfolder:false,
            showInDetail:true,
            permission:'ReadWrite',
            component:BrowseActionsShare,
            groupBy:'other'
        },
        {
            name:'UploadRequest',
            showInfolder:true,
            showInDetail:false,
            permission:'ReadWrite',
            component:BrowseActionsUploadRequest,
            groupBy:'other'
        },
    ]
    const shareActions:ShareActionItem[] = [
    ]

    const folderActions = computed(() => {
        if(!currentDocument.value.doc || !currentDocument.value.permission) return {}
        const result = actions.filter((item) => {
            return item.showInfolder
        }).filter((item) => {
            return AllowTo({feature:item.permission, permission: currentDocument.value.permission})
        })
        .reduce((prev:any, item:BrowseActionItem) => {
            prev[item.groupBy] = prev[item.groupBy] || []
            prev[item.groupBy].push(item)
            return prev
        }, {})
        return result
    })


    async function getDocDetail() {
        // const response = await getDocumentDetail(routePath.value, userId)
        const response = await getDocumentDetailSync(routePath.value, userId)
        
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
                const parentPath = routePath.value.split('/').slice(0, -1).join('/')
                // currentDocument.value =  await getDocumentDetail(parentPath, userId)
                currentDocument.value =  await getDocumentDetailSync(parentPath, userId)
            }
            // open detail
            openFileDetail(routePath.value, {
              showInfo:true,
              showHeaderAction:true
            })
        }
    }

    watch(()=>routePath, async(newRoute, oldRoute) => {
        loading.value = true;
        try {
            await getDocDetail()
        } catch (error) {

        }
        loading.value = false;
    },{immediate:true, deep: true});
    
    
    useEventListener(document, 'docActionRefresh', (event) => handleRefresh())
    useEventListener(document, 'tree-node-update', (event) => getDocDetail())


    return {
        actions,
        loading,
        forceRefresh,
        currentDocument,
        folderActions,
        getDocDetail
    }
}