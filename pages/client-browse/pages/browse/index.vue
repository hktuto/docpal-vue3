<template>
<NuxtLayout>
    <template #headerLeft>
        <slot name="headerLeft"></slot>
    </template>
    <page-container>
        <div v-if="listData" class="browsePageContainer">
            <div v-if="selectList.length === 0 && listData.doc.path !== '/'"
                 class="browseHeader">
                 <slot name="breadcrumb">
                    <BrowseBreadcrumb :ref="(el) => breadCrumb = el" :path="routePath" rootPath="/" />
                </slot>                    
                <div id="browseHeaderRight" class="folderAction">
                    <CollapseMenu>
                        <template #default="{collapse}">
                        <BrowseActionsHold :permission="listData.permission" :doc="listData.doc" />
                        <BrowseActionsSubscribe v-if="allowFeature('SUBSCRIBE')" :doc="listData.doc" />
                        <div v-show="AllowTo({feature:'ReadWrite', permission: listData.permission })" :class="{actionDivider:true, collapse}"></div>
                        <BrowseActionsEdit v-if="AllowTo({feature:'ReadWrite', permission: listData.permission })" :doc="listData.doc" @success="handleRefresh"/>
                        <!-- <BrowseActionsUpload v-show="AllowTo({feature:'ReadWrite', permission: listData.permission })" :doc="listData.doc" @success="handleRefresh"/> -->
                        <BrowseActionsNew v-show="AllowTo({feature:'ReadWrite', permission: listData.permission })" :doc="listData.doc" @success="handleRefresh"/>
                        <BrowseActionsDelete v-show="AllowTo({feature:'ReadWrite', permission: listData.permission })" :doc="listData.doc" @delete="itemDeleted" @success="handleRefresh"/>
                        <BrowseActionsCopyPath v-if="AllowTo({feature:'ReadWrite', permission: listData.permission })" :doc="listData.doc" />
                        <div v-show="AllowTo({feature:'ReadWrite', permission: listData.permission })" :class="{actionDivider:true, collapse}"></div>
                        <BrowseActionsUploadRequest v-if="allowFeature('UPLOAD_REQUEST')" v-show="AllowTo({feature:'ReadWrite', permission: listData.permission })" :path="listData.doc.path" />
                        </template>
                    </CollapseMenu>
                    <div :class="{actionDivider:true, collapse}"></div>
                    <BrowseActionsInfo :doc="listData.doc" @click="infoOpened = !infoOpened"/>
                </div>
            </div>
            <div v-else-if="selectList.length !== 0" class="browseHeader--multi selectedAction">
                <div class="color__primary">{{$t('dpDocument_fileSelected')}}({{selectList.length}})</div>
                <CollapseMenu>
                    <el-button type="text" size="small" @click="handleClearSelected">{{$t('button.clearSelected')}}</el-button>
                    <BrowseActionsShare v-if="allowFeature('SHARE_EXTERNAL') && AllowTo({feature:'ReadWrite', permission: listData.permission })"
                        :doc="listData.doc" :selectedList="selectList"/>
                    <BrowseActionsCollection :selectedList="selectList" @clearSelected="handleClearSelected"></BrowseActionsCollection>
                    <BrowseActionsDeleteSelected v-if="AllowTo({feature:'ReadWrite', permission: listData.permission })" :selected="selectList" @success="handleRefresh"
                        />
                    <!-- <div class="actionDivider"></div> -->
                    <!-- <BrowseActionsInfo :doc="listData.doc" @click="infoOpened = !infoOpened"
                        class="el-icon--right"/> -->
                </CollapseMenu>
            </div>
            <BrowseList
                v-loading="loading"
                :doc="listData.doc"
                :permission="listData.permission"
                @select-change="handleSelectionChange"
            >
                <template #default="{doc, permission}" >
                    <BrowseInfo :doc="selectList.length === 1 ? selectList[0] : doc" :listData="listData" :permission="permission" :infoOpened="infoOpened" @close="infoOpened = false" />
                    <BrowseRightClick></BrowseRightClick>
                    <!-- <BrowseActionsEdit v-if="AllowTo({feature:'ReadWrite', permission })" v-show="false" :doc="listData.doc" @success="handleRefresh"/> -->
                </template>
            </BrowseList>
        </div>

        <!-- global action -->
        <BrowseActionsPaste v-show="false" @success="handleRefresh"/>
        <BrowseActionsNewFolder v-show="false" @success="handleRefresh"/>
        <BrowseActionsUploadDoc v-show="false" @success="handleRefresh"/>
    </page-container>

</NuxtLayout>
</template>


<script lang="ts" setup>
import { useEventListener } from '@vueuse/core'
import { DocDetail } from 'dp-api';
import { Permission } from '../../../../packages/dp-browse/utils/permissionHelper';
import {openFileDetail} from '../../../../packages/dp-browse/utils/browseHelper';


// #region refs
const breadCrumb = ref();
const route = useRoute();
const router = useRouter();
const { allowFeature } = useLayout()
const listData = ref<{
    doc: DocDetail;
    permission: Permission
}>();


const forceRefresh = ref(false)

const loading = ref(false)
const auth = useUser();
const userId:string = useUser().getUserId()
const { public:{feature} } = useRuntimeConfig();
const selectList = ref<any[]>([])
// #endregion
provide('selectList', selectList)
const routePath = computed( () => (route.query.path as string) || '/')
const infoOpened = ref(false);




async function getDocDetail() {
    // const response = await getDocumentDetail(routePath.value, userId)
    const response = await getDocumentDetailSync(routePath.value, userId)
    
    if(response.doc.isFolder) {
        // check if the path is the same
        if(listData.value && listData.value.doc.id === response.doc.id && !forceRefresh.value) {
            return
        }
        listData.value = response
        forceRefresh.value = false

    } else {
        if(!listData.value) {
            // split router path to get parent path
            const parentPath = routePath.value.split('/').slice(0, -1).join('/')
            // listData.value =  await getDocumentDetail(parentPath, userId)
            listData.value =  await getDocumentDetailSync(parentPath, userId)
        }
        // open detail
        openFileDetail(routePath.value, {
          showInfo:true,
          showHeaderAction:true
        })
    }
}

function itemDeleted(){
     //  FIXME: item deleted may not be the current path
     breadCrumb.value.goParent();
}
async function handleRefresh () {
    forceRefresh.value = true
    await getDocDetail()
    if(listData?.value?.doc?.isFolder) breadCrumb.value.handleRefresh();
}

function handleSelectionChange (rows:any) {
    selectList.value = [...rows]
}
function handleClearSelected() {
    const ev = new CustomEvent('setTableSelection')
    document.dispatchEvent(ev)
}
watch(()=>routePath, async(newRoute, oldRoute) => {
    loading.value = true;
    try {
        await getDocDetail()
    } catch (error) {

    }
    loading.value = false;
},{immediate:true, deep: true});

function detailClosed() {
    breadCrumb.value.goParent();
}
onMounted(() => {
    useEventListener(document, 'docActionRefresh', (event) => handleRefresh())
    useEventListener(document, 'tree-node-update', (event) => getDocDetail())
})
</script>

<style lang="scss" scoped>
.browsePageContainer{
    display: grid;
    grid-template-rows: min-content 1fr;
    gap : 0;
    height: 100%;
    overflow: hidden;
    position: relative;

}
.browseHeader{
    display: grid;
    grid-template-columns: 1fr min-content;
    justify-content: flex-start;
    align-items: center;
    position: relative;
}
.browseHeader--multi {
    width: calc(100% - 10px);
    margin: 5px;
    display: grid;
    padding: 6px 16px;
    grid-template-columns: 1fr min-content;
    justify-content: flex-start;
    align-items: center;

    background: #fff;
    border-radius: 36px;
    box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.3);
}
.fileName{
    font-size: 1.5rem;
    font-weight: 500;
    color: #fff;
}
.actions, #browseHeaderRight{
    display: flex;
    flex-flow: row nowrap;
    gap: var(--app-padding);
    justify-content: flex-start;
    align-items: center;
    font-size: 16px;
    --icon-size: 16px;

}
.actionDivider{
    height: calc( var(--icon-size) + 16px);
    width: 1px;
    background: var(--color-grey-100);
    &.collapse{
      width:100%;
      height: 1px;
    }
}
.fileNameContainer{
    display: flex;
    flex-flow: row nowrap;
    gap: var(--app-padding);
    align-items: center;
}
#browseInfoSection{
    overflow: hidden;
}
:deep {
    .actionIconContainer{
        font-size: var(--icon-size);
        background: var(--color-grey-150);
        padding: 8px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        color: var(--color-grey-950);
        cursor: pointer;
        &:hover{
            background: var(--color-grey-200);
        }
    }
}
#browseInfoSection {
    :deep {
        .infoContainer {
            padding-top: 0px;
        }
    }
}
</style>
