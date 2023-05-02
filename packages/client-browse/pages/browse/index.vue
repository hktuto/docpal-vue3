<template>
    <NuxtLayout >
        <!-- header actions  -->
        <template #headerLeft>
            <!-- <browse-options v-model="pageOptions" /> -->
        </template>
        <page-container>
        <div v-if="data" class="browsePageContainer">
            <div class="browseHeader">
                <LazyBrowseBreadcrumb ref="breadCrumb" :path="routePath" rootPath="/" />
                <!-- folder actions container -->
                 <div id="browseHeaderRight" class="">

                 </div>
            </div>
            <div class="listContainer">
                <BrowseList :doc="data" :permission="permission" v-model:view="pageOptions.viewType"
                    @select-change="handleSelectionChange"/>
                <div id="browseInfoSection">
                    
                </div>
            </div>
        </div>
        <Teleport v-if="data" :disabled="data.isFolder" to="body">  
            <BrowseDetail :show="!data.isFolder" :doc="data" @close="detailClosed" >
                <div class="fileNameContainer">
                    <div class="fileName">{{ data.name }}</div>
                    <BrowseActionsEditName :doc="data" />
                </div>
                <div class="actions">
                    <Teleport :disabled="!data.isFolder" to="#browseHeaderRight">
                        <BrowseActionsSubscribe v-if="selectList.length === 0"  :doc="data" />
                        <!-- <div class="actionDivider"></div> -->
                        <BrowseActionsEdit v-if="permissionAllow({feature:'ReadWrite', userPermission:permission.permission })" :doc="data" />
                        <BrowseActionsReplace :doc="data" v-if="!data.isFolder && permissionAllow({feature:'ReadWrite', userPermission:permission.permission })" />
                        <BrowseActionsUpload v-if="selectList.length === 0 && data.isFolder && permissionAllow({feature:'ReadWrite', userPermission:permission.permission })" :doc="data" @success="handleRefresh"/>
                        <BrowseActionsDownload v-if="selectList.length === 0 && !data.isFolder && permissionAllow({feature:'Write', userPermission:permission.permission })"  :doc="data" />
                        <BrowseActionsNewFolder v-if="selectList.length === 0 && data.isFolder && permissionAllow({feature:'ReadWrite', userPermission:permission.permission })" :doc="data" @success="handleRefresh"/>
                        <BrowseActionsDelete v-if="selectList.length === 0 && permissionAllow({feature:'ReadWrite', userPermission:permission.permission })" :doc="data" @delete="itemDeleted" @success="handleRefresh"/>
                        <!-- <div class="actionDivider"></div> -->
                        <BrowseActionsCopyPath v-if="selectList.length === 0 && permissionAllow({feature:'Write', userPermission:permission.permission })" :doc="data" />
                        <BrowseActionsShare v-if="selectList.length > 0 && permissionAllow({feature:'Write', userPermission:permission.permission })" :doc="data" />
                        <BrowseActionsUploadRequest v-if="selectList.length === 0 && data.isFolder && permissionAllow({feature:'ReadWrite', userPermission:permission.permission })" :path="data.path" />
                        <div class="actionDivider"></div>
                        <BrowseActionsInfo v-if="permissionAllow({feature:'Write', userPermission:permission.permission })" :doc="data" @click="infoOpened = !infoOpened"/>
                    </Teleport>
                    <div class="actionDivider"></div>
                    <!-- <SvgIcon src="/icons/close.svg" round ></SvgIcon> -->
                    <div class="actionIconContainer" @click="detailClosed">
                        <el-icon >
                            <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ea893728=""><path fill="currentColor" d="M764.288 214.592 512 466.88 259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z"></path></svg>
                        </el-icon>
                    </div>
                </div>
                <template #info>
                    <Teleport :disabled="!data.isFolder" to="#browseInfoSection">
                        <BrowseInfo :doc="data" :infoOpened="infoOpened"/>
                    </Teleport>
                </template>
            </BrowseDetail>
        </Teleport>
        </page-container>
        <BrowseActionsPaste v-show="false" @success="handleRefresh"/>
        <LazyBrowseRightClick :permission="permission"></LazyBrowseRightClick>
    </NuxtLayout>
</template>


<script lang="ts" setup>
import { useEventListener } from '@vueuse/core'
import {watch, ref, computed} from 'vue'
import { GetDocDetail, GetDocPermission, GetDocumentAdditionalApi } from 'dp-api'

// #region refs
const breadCrumb = ref();
const icon = ref("");
const route = useRoute();
const router = useRouter();
const data = ref();
const loading = ref(false)
const permission = ref({permission:"",print:false});
const auth = useUser();
const selectedFiles = ref([]); 
const pageOptions = ref<BrowseOptions>({viewType:'table'})

const selectList = ref([])
// #endregion
provide('selectList', selectList)
const routePath = computed( () => (route.query.path as string) || '/')
const infoOpened = ref(false);

async function getPermission(){
    permission.value = await GetDocPermission(routePath.value, auth.user.value.username);
}
async function getDocDetail() {
    // step 1 get permission
    await getPermission()
    // step 2 get doc detail
    data.value = await GetDocDetail(routePath.value);
    // step 3 get doc additional info
    data.value.displayMeta = await GetDocumentAdditionalApi({documentType:data.value.documentType})
    // step 4 set permission helper to doc
    data.value.canWrite = permissionAllow({feature:'Write', userPermission:permission.value.permission })
    data.value.canEdit = permissionAllow({feature:'Edit', userPermission:permission.value.permission })
    data.value.canContorl = permissionAllow({feature:'Manage', userPermission:permission.value.permission })
    console.log(data.value.displayMeta)
}

function itemDeleted(){
    if(!data.value.isFolder){
        breadCrumb.value.goParent();
    }
}
function handleRefresh (docId) {
    const time = new Date().valueOf().toString()
    router.push({ 
        query: { ...route.query, time } 
    })
}
function handleSelectionChange (rows) {
    selectList.value = [...rows]
}
watch(route, async() => {
    loading.value = true;
    try{
        await getDocDetail()
    }catch(error) {
        console.log(error)
    }

    loading.value = false;
},{immediate:true});



function detailClosed() {
    breadCrumb.value.goParent();
}
onMounted(() => {
    useEventListener(document, 'docActionRefresh', (event) => handleRefresh(event.detail))  
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
    .listContainer{
        display: grid;
        grid-template-columns: 1fr min-content;
        overflow: hidden;
    }
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
