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
            <FolderCabinetTable ref="tableRef" @row-click="handleRowClick">
                <template #suffixSortButton>
                    <el-button class="suffixSortButton" @click="handleNewItem()">{{$t('folderCabinet.newItem')}}</el-button>
                    <!-- <el-button class="suffixSortButton" @click="handleNextItem()">{{$t('handleNextItem.newItem')}}</el-button> -->
                    <el-button class="suffixSortButton" type="info" @click="handleDownload()">{{$t('export')}}</el-button>
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
    <FolderCabinetDownloadDialog ref="DownloadDialogRef"/>
    <FolderCabinetCreateDialog ref="FolderCabinetNewItemDialogRef" @refresh="refreshTable"/>
    <FolderCabinetCreateNextDialog ref="NextDialogRef" />
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
const NextDialogRef = ref()
function handleNextItem() {
    const cc = {
        allow: false,
        children: [
            {
                "id": "561a6372-904b-4e8e-9dcd-14626b8a1ce5",
                "parentId": "61b3a1a8-a8ce-4a8a-abde-84f5c037ae9e",
                "label": "invoices",
                "documentType": "Invoices",
                "folder": true,
                "allow": true,
                "multiple": false,
                "complete": false,
                "children": [
                    {
                        "id": "07db3c1a-cfa4-4c1a-938f-38f31639ecb3",
                        "parentId": "561a6372-904b-4e8e-9dcd-14626b8a1ce5",
                        "label": "InvoiceFiles",
                        "documentType": "Invoice",
                        "folder": false,
                        "allow": false,
                        "multiple": true,
                        "complete": false
                    }
                ],
                "isLack": false,
                "properties": {}
            },
            {
                "id": "90369d36-0104-492e-b5f4-85c9a7284ef6",
                "parentId": "61b3a1a8-a8ce-4a8a-abde-84f5c037ae9e",
                "label": "contractFile",
                "documentType": "ContractFile",
                "folder": false,
                "allow": false,
                "multiple": true,
                "complete": false,
                "isLack": false,
                "children": []
            }
        ],
        createdBy: "Administrator",
        createdDate: "2023-07-04T17:32:24Z",
        documentType: "Contracts",
        folder: true,
        id: "61b3a1a8-a8ce-4a8a-abde-84f5c037ae9e",
        label: "contractFolderAndFile",
        modifiedBy: "Administrator",
        modifiedDate: "2023-07-04T17:32:24Z",
        multiple: false,
        parentId: "5ef1639f-b2e4-4114-a2a6-148631fe5802",
        rootId: "9efad5ec-edcc-4753-bb74-ef7794e75092",
        rootName: "0628",
        rootPath: "/default-domain/new Folder1687936303610"
    }
    NextDialogRef.value.handleOpen(cc, '/default-domain/new Folder1687936303610/staff1355')
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
    router.push({ query: { ...route.query, time } })
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
// #region module: Download csv
    const tableRef = ref()
    const DownloadDialogRef = ref()
    function handleDownload () {
        const searchParams = tableRef.value.getSearchParams()
        console.log({searchParams});
        
        DownloadDialogRef.value.handleOpen(searchParams)
    }
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
.suffixSortButton {
    width: 88px;
    margin-left: unset;
    margin-bottom: 10px;
}
</style>
