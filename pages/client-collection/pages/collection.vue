<template>
    <NuxtLayout class="fit-height withPadding">
        <el-container>
                <el-card>
                    <div class="collection-list" style="--color: #F56C6C">
                        <div v-for="item in collectionList" :class="['collection-item','cursorPointer', {'current': curCollection.id === item.id}]" @click="handleTabClick(item)">
                            <span class="ellipsis" :title="item.name">{{item.name}}</span>
                            <el-icon class="color__danger__hover cursorPointer"
                                @click.stop="handleDelete(item)"><Delete /></el-icon>
                        </div>
                    </div>
                    <el-button :loading="fileFormAddLoading" @click="openDialog()">{{$t('collections_new')}}</el-button>
                </el-card>
            <el-container>
                <el-header>
                    <div class="flex-x-start">{{curCollection.name}} 
                        <SvgIcon src="/icons/edit.svg" class="mg-l" 
                            @click="openDialog(true)"/>
                    </div>
                    <el-button v-if="selectedDocs.length > 1"
                        @click="handleMulDelete">{{$t('delete')}}</el-button>
                </el-header>
                <el-main class="">
                        <Table v-loading="loading" :columns="tableSetting.columns" :table-data="tableData" :options="options"
                            @selection-change="handleSelectionChange"
                            @pagination-change="handlePaginationChange"
                            @command="handleAction"
                            @row-dblclick="handleDblclick"></Table>
                </el-main>
            </el-container>
        </el-container>
        <FileFormDialog ref="fileFormDialogAddRef" :title="$t('collections_new')" @submit="submitNewCollection"></FileFormDialog>
        <FileFormDialog ref="fileFormDialogEditRef" :title="$t('collections_edit')" @submit="saveCollection"></FileFormDialog>
    </NuxtLayout>
</template>


<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'
import { getCollectionApi, DeleteByIdApi, removeCollectionApi, getCollectionDoc, createCollectionApi, patchDocApi,
        TABLE, defaultTableSetting, idOrPathParams } from 'dp-api'
const { t } = useI18n();
const route = useRoute()
const router = useRouter()
const pageParams = {
    pageIndex: 0,
    pageSize: 20
}
const state = reactive<State>({
    loading: false,
    tableData: [],
    options: { 
        // showPagination: true, 
        paginationConfig: {
            total: 0,
            currentPage: 1,
            pageSize: pageParams.pageSize
        }
    },
    collectionList: [],
    curCollection: '',
    selectedDocs: []
})

// #region module: collectionList
    async function getCollectionList () {
        const res = await getCollectionApi()
        state.collectionList = res.entryList
        if(state.collectionList.length > 0) {
            let index = state.collectionList.findIndex(item => item.id === route.query.tab)
            if (index === -1) index = 0
            handleTabClick(state.collectionList[index])
        }
    }
    function handleTabClick(row) {
        state.curCollection = row
        const time = new Date().valueOf().toString() + 1
        router.push({ 
            query: { tab: row.id, page: 0, pageSize: pageParams.pageSize, time } 
        })
    }
    function handleDelete(row) {
        ElMessageBox.confirm(`${t('msg_confirmWhetherToDelete')}`)
            .then(async() => {
                const res = await DeleteByIdApi(row.id)
                getCollectionList()
            })
    }
// #endregion

// #region module: page
    const tableKey = TABLE.CLIENT_COLLECTION
    const tableSetting = defaultTableSetting[tableKey]
    async function getList (param, tab) {
        state.loading = true
        const res = await getCollectionDoc(state.curCollection.id)
        state.tableData = res.entryList
        state.options.paginationConfig.total = res.totalSize
        state.options.paginationConfig.pageSize = param.pageSize
        state.options.paginationConfig.currentPage = param.pageIndex + 1
        state.loading = false
    }
    function handlePaginationChange (page: number, pageSize: number) {
        if(!pageSize) pageSize = pageParams.pageSize
        const time = new Date().valueOf().toString()
        router.push({ 
            query: { tab: state.curCollection.id, page, pageSize, time } 
        })
    }
    watch(
        () => route.query,
        async (newval) => {
            if (state.collectionList.length === 0) return
            const { page, pageSize, tab } = newval
            if (tab) {
                pageParams.pageIndex = (Number(page) - 1) || 0
                pageParams.pageSize = Number(pageSize) || pageParams.pageSize
                getList(pageParams, tab)
            }
        }
    )
// #endregion
// #region module: collection doc
    function handleMulDelete () {
        const docIds = state.selectedDocs.reduce((prev,item) => {
            prev.push({ idOrPath: item.id })
            return prev
        }, [])
        handleDocDelete(docIds)
    }
    function handleDocDelete(docIds: idOrPathParams[]) {
        const param = {
            documents: docIds,
            collection: { idOrPath: state.curCollection.id }
        }
        ElMessageBox.confirm(`${t('msg_confirmWhetherToDelete')}`)
            .then(async() => {
                state.loading = true
                const res = await removeCollectionApi(param)
                setTimeout(() => {
                    const time = new Date().valueOf().toString() + 1
                    router.push({ 
                        query: { tab: state.curCollection.id, page: 0, pageSize: pageParams.pageSize, time } 
                    })
                }, 1000) // 500的数据还没有更新
            })
    }
// #endregion
// #region module: collection new dialog
    const fileFormDialogEditRef = ref()
    const fileFormDialogAddRef = ref()
    const fileFormAddLoading = ref(false)
    const fileFormEditLoading = ref(false)
    function openDialog (isEdit) {
        if(isEdit) fileFormDialogEditRef.value.handleOpen(state.curCollection)
        else fileFormDialogAddRef.value.handleOpen()
    }
    async function submitNewCollection(form) {
        fileFormAddLoading.value = true
        dpLog({form});
        await createCollectionApi(form)
        setTimeout(async() => {
            await getCollectionList()
            // fileFormDialogAddRef.value.handleClose()
            fileFormAddLoading.value = false
        }, 500)
    }
    async function saveCollection(form) {
        fileFormEditLoading.value = true
        form.idOrPath = state.curCollection.id
        await patchDocApi(form)
        setTimeout(async() => {
            await getCollectionList()
            fileFormAddLoading.value = false
        }, 500)
    }
// #endregion
function handleDblclick (row) {
    router.push({
        path: '/browse',
        query: {
            path: row.path,
        },
    })
}
function handleAction (command, row: any, index: number) {
    switch (command) {
        case 'delete':
            const docIds = [ { idOrPath: row.id } ]
            handleDocDelete(docIds)
            break
        default:
            break
    }
}
function handleSelectionChange(rows) {
    state.selectedDocs = deepCopy(rows)
}
const { tableData, options, loading, collectionList, curCollection, selectedDocs } = toRefs(state)
onMounted(() => {
    getCollectionList()
})
</script>

<style lang="scss" scoped>
.grid-layout {
    display: grid;
    grid-template-rows: min-content 1fr;
    height: 100%;
    overflow: hidden;
}
.current {
    background-color: var(--menu-selected-bg);
    color: var(--menu-selected-color);
}
.el-container {
    height: 100%;
    overflow: hidden;
}
.el-card :deep(.el-card__body) {
    width: 200px;
    display: grid;
    grid-template-rows: 1fr min-content;
    height: 100%;
    overflow: hidden;
    gap: var(--app-padding);
    .collection-list {
        overflow: auto;
    }
    .collection-item {
        padding: var(--app-padding);
        display: grid;
        grid-template-columns: 1fr min-content;
        gap: var(--app-padding);
    }
}
.el-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.el-main {
    padding: 0 var(--app-padding);
}
.mg-l {
    margin-left: var(--app-padding);
}
</style>
