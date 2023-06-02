<template>
    <NuxtLayout >
    <page-container>
        <div v-if="listData" class="browsePageContainer">
            <BrowsePageHeader :doc="listData.doc" :permission="listData.permission" >
                <template #default="{doc, permission}" >
                    <BrowseBreadcrumb :ref="(el) => breadCrumb = el" :path="routePath" rootPath="/" />
                    <div v-show="selectList.length === 0" id="browseHeaderRight" class="folderAction">
                        <BrowseActionsSubscribe  :doc="doc" />
                        <div v-show="AllowTo({feature:'ReadWrite', userPermission: permission.permission })" class="actionDivider"></div>
                        <BrowseActionsEdit v-if="AllowTo({feature:'ReadWrite', userPermission: permission.permission })" :doc="doc" @success="handleRefresh"/>
                        <BrowseActionsNewFolder v-show="AllowTo({feature:'ReadWrite', userPermission: permission.permission })" :doc="doc" @success="handleRefresh"/>
                        <BrowseActionsUpload v-show="AllowTo({feature:'ReadWrite', userPermission: permission.permission })" :doc="doc" @success="handleRefresh"/>
                        <BrowseActionsDelete v-show="AllowTo({feature:'ReadWrite', userPermission: permission.permission })" :doc="doc" @delete="itemDeleted" @success="handleRefresh"/>
                        <BrowseActionsCopyPath v-if="AllowTo({feature:'ReadWrite', userPermission:permission.permission })" :doc="doc" />
                        <div v-show="AllowTo({feature:'ReadWrite', userPermission: permission.permission })" class="actionDivider"></div>
                        <BrowseActionsUploadRequest v-show="AllowTo({feature:'ReadWrite', userPermission: permission.permission })" :path="doc.path" />

                        <div class="actionDivider"></div>
                        <BrowseActionsInfo :doc="doc" @click="infoOpened = !infoOpened"/>
                    </div>
                    <div v-show="selectList.length !== 0" id="browseHeaderRight" class="selectedAction">
                        <BrowseActionsShare v-if="AllowTo({feature:'ReadWrite', userPermission: permission.permission })" :doc="doc" />
                        <BrowseActionsDeleteSelected v-if="AllowTo({feature:'ReadWrite', userPermission: permission.permission })" :selected="selectList" @success="handleRefresh"/>
                        <div class="actionDivider"></div>
                        <BrowseActionsInfo :doc="doc" @click="infoOpened = !infoOpened"/>

                    </div>
                </template>
            </BrowsePageHeader>
            <BrowseList
                :doc="listData.doc"
                :permission="listData.permission"
                @select-change="handleSelectionChange"
            >
                <template #default="{doc, permission}" >
                    <BrowseInfo :doc="selectList.length === 1 ? selectList[0] : doc" :permission="permission" :infoOpened="infoOpened" @close="infoOpened = false" />

                    <BrowseRightClick :permission="permission"></BrowseRightClick>
                    <!-- <BrowseActionsEdit v-if="AllowTo({feature:'ReadWrite', userPermission: permission.permission })" v-show="false" :doc="doc" @success="handleRefresh"/> -->
                </template>
            </BrowseList>
        </div>
        <Teleport v-if="detailData && detailData.doc" to="body">
            <BrowseDetail v-if="!forceRefresh" :show="detailData.doc" :doc="detailData.doc" :permission="detailData.permission" @close="detailClosed" >
                <template #default="{doc , permission}" >
                    <div class="fileNameContainer">
                        <div class="fileName">{{ doc.name }}</div>
                        <BrowseActionsEdit v-if="AllowTo({feature:'ReadWrite', userPermission: permission.permission })" :doc="doc" @success="handleRefresh"/>
                    </div>
                    <div class="actions">
                        <BrowseActionsSubscribe  :doc="doc" />
                        <div class="actionDivider"></div>
                        <BrowseActionsReplace :doc="doc" v-if=" AllowTo({feature:'ReadWrite', userPermission: permission.permission })" @success="handleRefresh"/>
                        <BrowseActionsDownload v-if="AllowTo({feature:'Read', userPermission: permission.permission })"  :doc="doc" />
                        <BrowseActionsDelete v-if="AllowTo({feature:'ReadWrite', userPermission: permission.permission })" :doc="doc" @delete="itemDeleted" @success="handleRefresh"/>
                        <BrowseActionsCopyPath v-if="AllowTo({feature:'ReadWrite', userPermission:permission.permission })" :doc="doc" />
                        <div class="actionDivider"></div>
                        <BrowseActionsShare v-if="AllowTo({feature:'ReadWrite', userPermission: permission.permission })" :doc="doc" />

                        <div class="actionDivider"></div>
                        <BrowseActionsInfo  :doc="doc" @click="infoOpened = !infoOpened"/>
                        <div class="actionDivider"></div>
                        <!-- <SvgIcon src="/icons/close.svg" round ></SvgIcon> -->
                        <div class="actionIconContainer" @click="detailClosed">
                            <el-icon >
                                <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ea893728=""><path fill="currentColor" d="M764.288 214.592 512 466.88 259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z"></path></svg>
                            </el-icon>
                        </div>
                    </div>
                </template>
                <template #info="{doc, permission}">
                    <BrowseInfo :doc="doc" :permission="permission" :infoOpened="infoOpened" :hidePreview="true" @close="infoOpened = false" />
                </template>
            </BrowseDetail>
        </Teleport>
        <!-- global action -->
        <BrowseActionsPaste v-show="false" @success="handleRefresh"/>
    </page-container>

    </NuxtLayout>
</template>


<script lang="ts" setup>
import { useEventListener } from '@vueuse/core'
import { DocDetail } from 'dp-api';
import {watch, ref, computed} from 'vue'
import { Permission } from '../../../../packages/dp-browse/utils/permissionHelper';
// #region refs
const breadCrumb = ref();

const route = useRoute();
const router = useRouter();
const listData = ref<{
    doc: DocDetail;
    permission: Permission
}>();
const detailData = ref<{
    doc: DocDetail;
    permission: Permission
} | null>(null);

const forceRefresh = ref(false)

const loading = ref(false)
const auth = useUser();
const userId:string = useUser().getUserId()
const selectList = ref<any[]>([])
// #endregion
provide('selectList', selectList)
const routePath = computed( () => (route.query.path as string) || '/')
const infoOpened = ref(false);

async function getDocDetail() {
    const response = await getDocumentDetail(routePath.value, userId)
    if(response.doc.isFolder) {

        detailData.value = null
        // check if the path is the same
        if(listData.value && listData.value.doc.id === response.doc.id && !forceRefresh.value) {
            console.log('same path do not refresh')
            return
        }
        listData.value = response
        forceRefresh.value = false
    } else {
        if(!listData.value) {
            // split router path to get parent path
            const parentPath = routePath.value.split('/').slice(0, -1).join('/')
            listData.value =  await getDocumentDetail(parentPath, userId)

        }
        detailData.value = response
      forceRefresh.value = false
    }
}

function itemDeleted(){
     //  FIXME: item deleted may not be the current path
     breadCrumb.value.goParent();
}
async function handleRefresh () {
    console.log('handleRefresh');

    forceRefresh.value = true
    await getDocDetail()
}
function handleSelectionChange (rows:any) {
    selectList.value = [...rows]
}
watch(route, async(newRoute, oldRoute) => {
    loading.value = true;
    await getDocDetail()
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
