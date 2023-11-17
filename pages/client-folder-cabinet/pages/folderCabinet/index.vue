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
                    <el-button @click="handleNewItem()">{{$t('folderCabinet.newItem')}}</el-button>
                    <el-button class="suffixSortButton" @click="handleNextItem()">{{$t('handleNextItem.newItem')}}</el-button>
                    <el-button type="info" @click="handleDownload()">{{$t('export')}}</el-button>
                    <el-button :loading="state.uploading" text></el-button>
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
    tabList: [],
    uploadList: [],
    uploading: false
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
        "id": "513b6ee1-f84c-458b-900f-bbab07162120",
        "rootId": "3d064eb2-2e92-49ac-ba9a-88c885dec562",
        "parentId": "5ef1639f-b2e4-4114-a2a6-148631fe5802",
        "label": "testMeta",
        "documentType": "Folder",
        "folder": true,
        "allow": true,
        "multiple": false,
        "createdBy": "Administrator",
        "modifiedBy": "Administrator",
        "createdDate": "2023-11-17T08:03:30Z",
        "modifiedDate": "2023-11-17T08:03:30Z",
        "binds": [
            {
            "id": 244023,
            "folderCabinetId": "513b6ee1-f84c-458b-900f-bbab07162120",
            "bindId": "administrators",
            "type": "group"
            },
            {
            "id": 244024,
            "folderCabinetId": "513b6ee1-f84c-458b-900f-bbab07162120",
            "bindId": "members",
            "type": "group"
            },
            {
            "id": 244025,
            "folderCabinetId": "513b6ee1-f84c-458b-900f-bbab07162120",
            "bindId": "Administrator",
            "type": "user"
            }
        ],
        "metadata": [],
        "labelRule": "[{\"dataType\": \"string\", \"metaData\": \"fc:label\"}, {\"dataType\": \"date\", \"metaData\": \"fc:createDate\"}]",
        "notificationReminder": 10,
        "reportDay": 10,
        "emailReminder": 10,
        "tos": [
            "createBy"
        ],
        "ccs": [
            "frank.yangs@wclsolution.com"
        ],
        "children": [
            {
            "id": "8cbc8ca6-4b09-47a5-93e1-2a3a5cab2620",
            "parentId": "513b6ee1-f84c-458b-900f-bbab07162120",
            "label": "invoice",
            "documentType": "Invoices",
            "folder": true,
            "allow": true,
            "multiple": false,
            "complete": false,
            "children": [
                {
                "id": "a60aed35-3d0c-4895-88e4-34864ffb0308",
                "parentId": "8cbc8ca6-4b09-47a5-93e1-2a3a5cab2620",
                "label": "invoiceFile",
                "documentType": "Invoice",
                "folder": false,
                "allow": false,
                "multiple": true,
                "complete": false
                }
            ]
            },
            {
            "id": "9376d775-74f7-4dab-b374-cd7f352e7a68",
            "parentId": "513b6ee1-f84c-458b-900f-bbab07162120",
            "label": "folder",
            "documentType": "Folder",
            "folder": true,
            "allow": true,
            "multiple": false,
            "complete": false,
            "children": [
                {
                "id": "c9c5c614-7ba7-4191-b4df-1456c2df0a74",
                "parentId": "9376d775-74f7-4dab-b374-cd7f352e7a68",
                "label": "file",
                "documentType": "File",
                "folder": false,
                "allow": false,
                "multiple": true,
                "complete": false
                }
            ]
            }
        ]
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
    function setUploading (uploading: boolean = false) {
        state.uploading = uploading
        if (!state.uploading) {
            const time = new Date().valueOf().toString()
            refreshTable()
        }
    }
    provide('uploadListAdd', uploadListAdd)
    provide('setUploading', setUploading)
// #endregion
// #region module: Download csv
    const tableRef = ref()
    const DownloadDialogRef = ref()
    function handleDownload () {
        const searchParams = tableRef.value.getSearchParams()
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
