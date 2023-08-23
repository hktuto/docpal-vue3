<template>
<Table v-loading="loading" :columns="tableSetting.columns" :table-data="state.tableData" :options="options"
    @row-dblclick="handleDblclick"
    @command="handleAction">
    <template #preSortButton>
        <ResponsiveFilter ref="ResponsiveFilterRef" @form-change="handleFilterFormChange"
            inputKey="policyName"/>
    </template>
    <template #action="{ row }">
        <div class="flex-x-center">
            <el-button size="small" type="primary" @click="handleApprove(true, row)">{{$t('workflow_startAdhocWorkflow_approve')}}</el-button>
            <el-button size="small" type="danger" @click="handleApprove(false, row)">{{$t('workflow_startAdhocWorkflow_reject')}}</el-button>
        </div>
    </template>
</Table>
</template>

<script lang="ts" setup>
import { MoreFilled } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
    GetRetentionDocPageApi,
    GetRetentionDocConditionsApi,
    SubmitRetentionEventApi,
    defaultTableSetting, TABLE
} from 'dp-api'

// #region module: page
    const route = useRoute()
    const router = useRouter()
    const pageParams = {
        pageNum: 0,
        pageSize: 20,
        orderBy: 'createdDate',
        isDesc: true,
        status: 'D'
    }
    const tableKey = TABLE.CLIENT_RETENTION_PENDING
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
            const res = await GetRetentionDocPageApi({ ...param, ...state.extraParams })
            state.tableData = res.entryList
            state.options.paginationConfig.total = res.totalSize
            state.options.paginationConfig.pageSize = param.pageSize
            state.options.paginationConfig.currentPage = param.pageNum + 1
        } catch (error) {

        }
        state.loading = false
    }
    function handlePaginationChange (page: number, pageSize: number) {
        if(!page) page = pageParams.pageNum + 1
        if(!pageSize) pageSize = pageParams.pageSize
        const time = new Date().valueOf().toString()
        // scroll top
        router.push({
            query: { page, pageSize, time, tab: 'pending' }
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
    const { tableData, options, loading } = toRefs(state)
// #endregion

function handleAdd () {
    // RetentionAddDialogRef.value.handleOpen()
}
function handleAction (command, row: any, index: number) {
    switch (command) {
        case 'delete':
            break
        default:
            break
    }
}
function handleDblclick(row) {
    // router.push(`/retention/${row.id}`)
}
// #region module: ResponsiveFilterRef
    const ResponsiveFilterRef = ref()
    async function getFilter() {
        const data = await GetRetentionDocConditionsApi()
        ResponsiveFilterRef.value.init(data)
    }
    function handleFilterFormChange(formModel) {
        state.extraParams = formModel
        handlePaginationChange(1)
    }
// #endregion
// #region module: events 
    async function handleApprove(state, row) {
        console.log({state, row});
        const action = await ElMessageBox.confirm(`${$t('msg_confirmWhetherToDelete')}`)
        if(action !== 'confirm') return
    }
// #endregion
onMounted(() => {
    getFilter()
})
</script>

<style lang="scss" scoped>
.pageContainer{
  height: 100%;
  overflow: auto;
  padding: calc( var(--app-padding) * 2);
}
:deep(.tableHeader) {
    margin-bottom: 10px;
    & > .el-button {
        margin: unset;
    }
}
</style>
