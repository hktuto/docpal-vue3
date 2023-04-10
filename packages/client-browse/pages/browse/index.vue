<template>
    <NuxtLayout >
        <!-- header actions  -->
        <template #headerLeft>
            <browse-options v-model="pageOptions" />
        </template>
        <page-container>
        <div v-if="data" class="browsePageContainer">
            <div class="browseHeader">
                <LazyBrowseBreadcrumb ref="breadCrumb" :path="routePath" rootPath="/" />
                <!-- folder actions container -->
                 <div id="browseHeaderRight" class=""></div>
            </div>
            <BrowseList :doc="data" :permission="permission" :viewType="pageOptions.viewType"/>
        </div>
        <Teleport v-if="data" :disabled="data.isFolder" to="body">  
            <BrowseDetail :show="!data.isFolder" :doc="data" @close="detailClosed" >
                <div class="fileNameContainer">
                    <div class="fileName">{{ data.name }}</div>
                    <BrowseActionsEditName :doc="data" />
                </div>
                    <div class="actions">
                        <Teleport :disabled="!data.isFolder" to="#browseHeaderRight">
                            <BrowseActionsSubscribe  :doc="data" />
                            <div class="actionDivider"></div>
                            <BrowseActionsEdit v-if="!data.isFolder" :doc="data" />
                            <BrowseActionsUpload v-if="data.isFolder" :doc="data" @success="handleRefresh"/>
                            <BrowseActionsDownload v-if="!data.isFolder"  :doc="data" />
                            <BrowseActionsNewFolder v-if="data.isFolder" :path="data.path" @success="handleRefresh"/>
                            <BrowseActionsDelete :doc="data" @delete="itemDeleted" @success="handleRefresh"/>
                            <div class="actionDivider"></div>
                            <BrowseActionsCopyPath :doc="data" />
                            <BrowseActionsShare :doc="data" />
                            <BrowseActionsUploadRequest v-if="data.isFolder" :path="data.path" />
                            <div class="actionDivider"></div>
                            <BrowseActionsInfo :doc="data" />
                        </Teleport>
                        <div class="actionDivider"></div>
                        <!-- <SvgIcon src="/icons/close.svg" round @click="detailClosed"></SvgIcon> -->
                        <div class="actionIconContainer">
                            <el-icon @click="detailClosed">
                                <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ea893728=""><path fill="currentColor" d="M764.288 214.592 512 466.88 259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z"></path></svg>
                            </el-icon>
                        </div>
                    </div>
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
import { GetDocDetail, GetDocPermission } from 'dp-api'

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
// #endregion

const routePath = computed( () => (route.query.path as string) || '/')

async function getPermission(){
    permission.value = await GetDocPermission(routePath.value, auth.user.value.username);
}
async function getDocDetail() {
     data.value = await GetDocDetail(routePath.value);
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
watch(route, async() => {
    loading.value = true;
    await Promise.all([
        getPermission(),
        getDocDetail()
    ])

    loading.value = false;
},{immediate:true});



function detailClosed() {
    breadCrumb.value.goParent();
}
onMounted(() => {
    useEventListener(document, 'docActionRefresh', (event) => handleRefresh(event.detail))  
})
</script>

<style lang="scss" scoped>
.browsePageContainer{
    display: grid;
    grid-template-rows: min-content 1fr;
    gap : var(--app-padding);
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
:deep {
    .actionIconContainer{
        font-size: var(--icon-size);
        background: var(--color-grey-150);
        padding: 8px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        color: var(--color-grey-950);
        &:hover{
            background: var(--color-grey-200);
        }
    }
}
</style>
