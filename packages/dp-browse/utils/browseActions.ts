import BrowseActionsHold from "../components/browse/Actions/hold.vue";
import BrowseActionsSubscribe from "../components/browse/Actions/subscribe.vue";
import BrowseActionsEdit from "../components/browse/Actions/edit.vue";
import BrowseActionsNew from "../components/browse/Actions/new.vue";
import BrowseActionsDelete from "../components/browse/Actions/delete.vue";
import BrowseActionsCopyPath from "../components/browse/Actions/copyPath.vue";
import BrowseActionsReplace from "../components/browse/Actions/replace/index.vue";
import BrowseActionsDownload from "../components/browse/Actions/download.vue";
import BrowseActionsOffice from "../components/browse/Actions/office.vue";
import BrowseActionsShare from "../components/browse/Actions/share.vue";
import BrowseActionsUploadRequest from "../components/browse/Actions/uploadRequest.vue";
import BrowseActionsCollection from "../components/browse/Actions/collection.vue";
import BrowseActionsDeleteSelected from "../components/browse/Actions/deleteSelected.vue";
import BrowseActionsInfo from "../components/browse/Actions/info.vue";

import {AllPermission, Permission} from "./permissionHelper";

export type BrowseActionItem = {
    name: string
    icon?: string
    showInFolder?:boolean
    showInDetail?:boolean
    showInShare?:boolean
    permission:Permission
    needFeature?:string[]
    component:any
    groupBy:string
}
export type ShareActionItem = {
    name: string
    icon: string
    permission:Permission
    component:any
    needFeature?:string[]
}


export const actions:BrowseActionItem[] = [
    {
        name:'Hold',
        showInFolder:true,
        showInDetail:false,
        permission:'Read',
        component:BrowseActionsHold,
        groupBy:'holdStatus'
    },
    {
        name:'Subscribe',
        showInFolder:true,
        showInDetail:true,
        permission:'Read',
        component:BrowseActionsSubscribe,
        groupBy:'holdStatus'
    },
    {
        name:'Edit',
        showInFolder:true,
        showInDetail:false,
        showInShare:false,
        permission:'ReadWrite',
        component:BrowseActionsEdit,
        groupBy:'normal'
    },
    {
        name:'New',
        showInFolder:true,
        showInDetail:false,
        permission:'ReadWrite',
        component:BrowseActionsNew,
        groupBy:'normal'
    },
    {
        name:'Delete',
        showInFolder:true,
        showInDetail:true,
        permission:'ReadWrite',
        component:BrowseActionsDelete,
        groupBy:'normal'
    },
    {
        name:'copyPath',
        showInFolder:true,
        showInDetail:true,
        permission:'ReadWrite',
        component:BrowseActionsCopyPath,
        groupBy:'normal'
    },
    {
        name:'replace',
        showInFolder:false,
        showInDetail:true,
        permission:'ReadWrite',
        component:BrowseActionsReplace,
        groupBy:'normal'
    },
    {
        name:'download',
        showInFolder:false,
        showInDetail:true,
        permission:'ReadWrite',
        component:BrowseActionsDownload,
        groupBy:'normal'
    },
    {
        name:'office',
        showInFolder:false,
        showInDetail:true,
        permission:'ReadWrite',
        component:BrowseActionsOffice,
        groupBy:'normal'
    },
    {
        name:'share',
        showInFolder:false,
        showInDetail:true,
        showInShare:true,
        permission:'ReadWrite',
        needFeature:['SHARE_EXTERNAL'],
        component:BrowseActionsShare,
        groupBy:'other'
    },
    {
        name:'collection',
        showInFolder:false,
        showInDetail:false,
        showInShare:true,
        permission:'ReadWrite',
        component:BrowseActionsCollection,
        groupBy:'other'
    },{
        name:'deleteSelected',
        showInFolder:false,
        showInDetail:false,
        showInShare:true,
        permission:'Read',
        component:BrowseActionsDeleteSelected,
        groupBy:'other'
    },
    {
        name:'UploadRequest',
        showInFolder:true,
        showInDetail:false,
        permission:'ReadWrite',
        component:BrowseActionsUploadRequest,
        groupBy:'other'
    },
]
export const shareActions:ShareActionItem[] = [
]

export const ActionsFilter = (actions: BrowseActionItem[], permission:AllPermission, booleanKey:'showInFolder' | 'showInDetail') => {
    const { allowFeature } = useLayout()
    return actions
        .filter((item) => {
            if(!item.needFeature || item.needFeature.length === 0 ) return true

            return item.needFeature.every((feature) => {
                return allowFeature(feature)
            })
        }).filter((item) => {
            return item[booleanKey] 
        })
        .filter((item) => {
        
            return AllowTo({feature:item.permission, permission})
        })
        .reduce((prev:any, item:BrowseActionItem) => {
            prev[item.groupBy] = prev[item.groupBy] || []
            prev[item.groupBy].push(item)
            return prev
        }, {})
}