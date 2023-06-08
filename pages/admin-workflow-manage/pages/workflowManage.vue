<template>
    <NuxtLayout class="fit-height withPadding">
        <Table v-loading="loading" :columns="tableSetting.columns" :table-data="tableData" :options="options"
                @pagination-change="handlePaginationChange"
                @selection-change="handleSelectionChange"
                @command="handleAction"
                @row-dblclick="handleDblclick">
                <template #actions>
                    <div>
                        <el-button :disabled="!state.selectedRows || state.selectedRows.length === 0" type="danger" @click="handleDeleteSelected"> {{$t('deleteSelected')}} </el-button>
                    </div>
                </template> 
        </Table>
        <ReallocateDialog ref="ReallocateDialogRef" @submit="handleSubmit"></ReallocateDialog>
    </NuxtLayout>
</template>


<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { RefreshLeft, Delete } from '@element-plus/icons-vue'
import { 
    getAllTask, DeleteWorkflowProcessApi, taskClaimApi, taskUnClaimApi,
    TABLE, defaultTableSetting } from 'dp-api'
// #region module: page
    const route = useRoute()
    const router = useRouter()
    const pageParams = {
        pageIndex: 0,
        pageSize: 20
    }
    const state = reactive<State>({
        loading: false,
        tableData: [],
        selectedRows: [],
        options: { 
            multiSelect: true, 
            showPagination: true, 
            paginationConfig: {
                total: 0,
                currentPage: 1,
                pageSize: pageParams.pageSize
            }
        }
    })
    const tableKey = TABLE.ADMIN_WORKFLOW_MANAGE
    const tableSetting = defaultTableSetting[tableKey]

    async function getList (param) {
        state.loading = true
        try {
            const res = await getAllTask(param)
            state.tableData = res.entryList
            state.options.paginationConfig.total = res.totalSize
            state.options.paginationConfig.pageSize = param.size
            state.options.paginationConfig.currentPage = param.page + 1
        } catch (error) {
            
        }
        state.loading = false
    }
    function handlePaginationChange (page: number, pageSize: number) {
        if(!pageSize) pageSize = pageParams.pageSize
        const time = new Date().valueOf().toString()
        router.push({ 
            query: { page, pageSize, time } 
        })
    }
    function handleAction (command:sting, row: any, rowIndex: number) {
        switch (command) {
            case 'delete':
                handleDelete(row)
                break
            case 'reallocate':
                handleReallocate(row)
                break
        }
    }
    function handleDelete (row) {
        ElMessageBox.confirm(`${$i18n.t('msg_confirmWhetherToDelete')}`)
            .then(async() => {
                await DeleteWorkflowProcessApi({processInstanceId: row.instanceId})
                handlePaginationChange(pageParams.pageIndex - 1, pageParams.pageSize)
            })
    }
    function handleDeleteSelected () {
        ElMessageBox.confirm(`${$i18n.t('msg_confirmWhetherToDelete')}`)
            .then(async() => {
                state.loading = true
                try {
                    const pList = []
                    state.selectedRows.forEach((s) => pList.push(DeleteWorkflowProcessApi({processInstanceId: s.instanceId})))
                    
                    await Promise.all(pList)
                    handlePaginationChange(pageParams.pageIndex - 1, pageParams.pageSize)
                } catch (error) {
                    
                }
                state.loading = false
            })
    }
    function handleReallocate (row) {
        ReallocateDialogRef.value.handleOpen(row)
    }
    function handleSelectionChange (rows) {
        state.selectedRows = rows
    }
    watch(
        () => route.query,
        async (newval) => {
            const { page, pageSize } = newval
            pageParams.pageIndex = (Number(page) - 1) > 0 ? (Number(page) - 1) : 0
            pageParams.pageSize = Number(pageSize) || pageParams.pageSize
            getList({page: pageParams.pageIndex, size: pageParams.pageSize})
        },
        { immediate: true }
    )
    const { tableData, options, loading } = toRefs(state)
// #endregion

const ReallocateDialogRef = ref()
function handleDblclick (row) {
    handleReallocate(row)
}
async function handleSubmit (form) {
    if (!form.assignee) return
    const res = await taskUnClaimApi(form.id)
    if (!res) return
    const res2 = await taskClaimApi(form.id, form.assignee)
    if (!res2) return
    handlePaginationChange(pageParams.pageIndex, pageParams.pageSize)
}

</script>

<style lang="scss" scoped>
</style>