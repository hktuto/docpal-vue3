
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



    return {


    }
}
