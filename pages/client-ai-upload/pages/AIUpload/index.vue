<template>
    <NuxtLayout class="fit-height withPadding">
        <Table v-loading="state.loading" :columns="tableSetting.columns" :table-data="state.tableData" :options="state.options"
            @command="handleAction"
            @row-dblclick="handleDblclick"
            @pagination-change="handlePaginationChange">
            <template #preSortButton>
                <ResponsiveFilter ref="ResponsiveFilterRef" @form-change="handleFilterFormChange"
                    inputKey="name"/>
            </template>  
            <template #suffixSortButton>
                <el-button type="primary" @click="handleAdd()">{{$t('button.add')}}</el-button>
            </template>
        </Table>
        <DashboardDialog ref="DashboardDialogRef" @refresh="handlePaginationChange(1)"/>
    </NuxtLayout>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import {
    UploadAIPageApi,
    DeleteDashboardApi,
    defaultTableSetting, TABLE, deepCopy
} from 'dp-api'

// #region module: page
    const route = useRoute()
    const router = useRouter()
    const pageParams = {
        pageNum: 0,
        pageSize: 20,
        orderBy: 'createdDate',
        isDesc: true,
        userId: useUser().getUserId()
    }
    const tableKey = TABLE.CLIENT_UPLOAD_AI
    const tableSetting = defaultTableSetting[tableKey]
    const state = reactive<State>({
        loading: false,
        tableData: [],
        options: {
            multiSelect: true,
            showPagination: true,
            paginationConfig: {
                total: 0,
                currentPage: 1,
                pageSize: pageParams.pageSize
            },
            rowKey: 'id',
            sortKey: tableKey
        },
        extraParams: {}
    })


    async function getList (param) {
        state.loading = true
        try {
            const res = await UploadAIPageApi({ ...param, ...state.extraParams })
            state.tableData = res.entryList
            state.options.paginationConfig.total = res.totalSize
            state.options.paginationConfig.pageSize = param.pageSize
            state.options.paginationConfig.currentPage = param.pageNum + 1
        } catch (error) {

        }
        state.loading = false
    }
    function handlePaginationChange (page: number, pageSize?: number) {
        if(!page) page = pageParams.pageNum + 1
        if(!pageSize) pageSize = pageParams.pageSize
        const time = new Date().valueOf().toString()
        // scroll top
        router.push({
            query: { page, pageSize, time }
        })
    }
    watch(
        () => route.query,
        async (newval) => {
            const { page, pageSize } = newval
            nextTick(() => {
              pageParams.pageNum = (Number(page) - 1) || 0
              pageParams.pageSize = Number(pageSize) || pageParams.pageSize
              getList(pageParams)
            })
        },
        { immediate: true }
    )
// #endregion
function handleAction (command, row: any, index: number) {
    switch (command) {
        case 'delete':
            handleDelete(row.id)
            break
        case 'edit':
            handleAdd(row)
            break
        default:
            break
    }
}
async function handleDelete(id: string) {
    const action = await ElMessageBox.confirm(`${$t('msg_confirmWhetherToDelete')}`)
    if(action !== 'confirm') return
    await DeleteDashboardApi(id)
    handlePaginationChange(pageParams.pageNum + 1)
}
function handleDblclick(row) {
    router.push(`/AIUpload/${row.uploadId}`)
}
const DashboardDialogRef = ref()
function handleAdd (setting) {
    DashboardDialogRef.value.handleOpen(setting)
}
// #region module: ResponsiveFilterRef
    function handleFilterFormChange(formModel) {
        state.extraParams = formModel
        handlePaginationChange(1)
    }
// #endregion
function handleEditEmailLayout () {
    router.push('/layoutTemplate')
}
onMounted(() => {
})
</script>

<style lang="scss" scoped>

:deep(.tableHeader) {
    margin-bottom: 10px;
    & > .el-button {
        margin: unset;
    }
}
.emailActionButton {
    padding: unset;
}
</style>
