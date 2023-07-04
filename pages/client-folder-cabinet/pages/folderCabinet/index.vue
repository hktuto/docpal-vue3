<template>
<NuxtLayout class="fit-height withPadding">
    <div class="grid-layout">
        <el-tabs v-model="activeTab" class="tag-container" @tab-change="tabChange">
            <template v-for="item in state.tabList" :key="item.id">
                <el-tab-pane  
                    :label="item.label" :name="item.id" v-loading="state.loading">
                </el-tab-pane>
            </template>
        </el-tabs>
        <main>
            <FolderCabinetTable @row-click="handleRowClick">
                <template #suffixSortButton>
                    <el-button style="margin-bottom: 10px;" @click="handleNewItem()">{{$t('folderCabinet.newItem')}}</el-button>
                </template>
            </FolderCabinetTable>
            <InteractDrawer ref="InteractDrawerRef" :minWidth="240">
                <FolderCabinetMatchingResult ref="MatchingResultRef"/>
            </InteractDrawer>
        </main>
    </div>
    <div class="buttons--absolute">
        <el-button v-if="state.uploadList.length > 0" class="el-icon--left" type="info" @click="handleOpenUploadStatus">{{$t('uploadStatus')}}</el-button>
    </div>
    <FolderCabinetCreateDialog ref="FolderCabinetNewItemDialogRef" @refresh="refreshTable"/>
    <FolderCabinetCreateUploadStatusDialog ref="CreateUploadStatusDialogRef" />
</NuxtLayout>
</template>


<script lang="ts" setup>
import { GetCabinetLoginUserListApi } from 'dp-api'
const route = useRoute()
const router = useRouter()
const state = reactive({
    loading: false,
    activeTab: '',
    loading: false,
    tabList: [],
    uploadList: []
})
const { activeTab } = toRefs(state)
function tabChange (tab) {
    const time = new Date().valueOf().toString()
    router.push({query: { tab, time }})
}
const FolderCabinetNewItemDialogRef = ref()
function handleNewItem () {
    const activeSetting = state.tabList.find(item => item.id === state.activeTab)
    FolderCabinetNewItemDialogRef.value.handleOpen(activeSetting)
}

const MatchingResultRef = ref()
const InteractDrawerRef = ref()
function handleRowClick (row) {
    const _ref = MatchingResultRef.value
    _ref.init(row, route.query.tab)
    InteractDrawerRef.value.handleOpen()
}
function refreshTable () {
    const time = new Date().valueOf().toString()
    router.push({ ...route.query, time })
}

// #region module: init
    async function getData() {
        state.loading = true
        try {
            state.tabList = await GetCabinetLoginUserListApi()
        } catch (error) {
        }
        state.loading = false
    }
    watch(() => route.query, (q) => {
        if (q.tab) state.activeTab = q.tab
    }, { immediate: true })
// #endregion

// #region module: uploadList
    const CreateUploadStatusDialogRef = ref()
    function handleOpenUploadStatus () {
        CreateUploadStatusDialogRef.value.handleOpen(state.uploadList)
    }
    function uploadListAdd(uploadItem) {
        state.uploadList.push(uploadItem)
    }
    provide('uploadListAdd', uploadListAdd)
// #endregion
onMounted(async() => {
    await getData()
    if (!state.activeTab && state.tabList.length > 0) state.activeTab = state.tabList[0].id
})
</script>

<style lang="scss" scoped>
.grid-layout {
    height: 100%;
    overflow: hidden;
    display: grid;
    grid-template-rows: min-content 1fr;
}
.buttons--absolute {
    position: absolute;
    right: calc(var(--app-padding) * 2);
    top: calc(var(--app-padding) * 2);
    z-index: 2;
}
.tag-container {
}
main {
    overflow: hidden;
    display: grid;
    grid-template-columns: 1fr min-content;
    gap: var(--app-padding);
}
</style>
