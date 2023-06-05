<template>
    <Table  :columns="tableSetting.columns" :table-data="tableData" :options="options"
            v-loading="loading"
            @pagination-change="handlePaginationChange"
            @row-dblclick="handleDblclick">
            <template #preSortButton>
                <FromRenderer :form-json="formJson" @formChange="handleFormChange"/>
            </template>
            <template #assignee="{ row, index }">
                <el-tag v-if="row.assignee" round>{{ row.assignee || ''}}</el-tag>
                <el-button v-else  type="primary" size="small" round
                        @click="claimTask(row)" >
                        {{ $t('workflow_claim') }}
                </el-button>
            </template>
    </Table>
</template>


<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import { getAllTask, taskClaimApi, getJsonApi, TABLE, defaultTableSetting } from 'dp-api'
const { t } = useI18n();
const userId:string = useUser().getUserId()
// #region module: page
    const route = useRoute()
    const router = useRouter()
    const pageParams = {
        pageIndex: 0,
        pageSize: 20,
        candidateOrAssigned: userId,
        // interrelatedUserId: userId,
        // assignedUser: userId,
        // userId
    }
    const tableKey = TABLE.CLIENT_WORKFLOW_All_TASK
    const tableSetting = defaultTableSetting[tableKey]
    const state = reactive<State>({
        loading: false,
        tableData: [],
        options: { 
            showPagination: true, 
            paginationConfig: {
                total: 0,
                currentPage: 1,
                pageSize: pageParams.pageSize
            },
            sortKey: tableKey
        },
        extraParams: {},
        tabName: 'allTask'
    })
    

    async function getList (param) {
        // param.userId = userId
        state.loading = true
        const res = await getAllTask({...param, ...state.extraParams})
        
        state.tableData = res.entryList
        state.loading = false
        state.options.paginationConfig.total = res.totalSize
        state.options.paginationConfig.pageSize = param.pageSize
        state.options.paginationConfig.currentPage = param.pageIndex + 1
    }
    function handlePaginationChange (page: number, pageSize: number = pageParams.pageSize) {
        if(!pageSize) pageSize = pageParams.pageSize
        const time = new Date().valueOf().toString()
        router.push({ 
            query: { page, pageSize, time, tab: state.tabName } 
        })
    }

    watch(
        () => route.query,
        async (newval) => {
            const { page, pageSize } = newval
            pageParams.pageIndex = (Number(page) - 1) > 0 ? (Number(page) - 1) : 0
            pageParams.pageSize = Number(pageSize) || pageParams.pageSize
            getList(pageParams)
        },
        { immediate: true }
    )
    const { tableData, options, loading } = toRefs(state)
// #endregion
// #region module: search json
    const formJson = getJsonApi('workflowUncompleteTaskSearch.json')
    function handleFormChange (data) {
        const extraParams = Object.keys(data.formModel).reduce((prev,key) => {
            if(data.formModel[key] && data.formModel[key].length > 0) prev[key] = data.formModel[key]
            return prev
        }, {})
        state.extraParams = extraParams
        handlePaginationChange(1)
    }
// #endregion
function handleDblclick (row) {
    router.push(`/workflow/${row.id}?state=${state.tabName}`)
}
async function claimTask(row) {
    dpLog(row, 'claimTask');
    await taskClaimApi(row.id, userId)
    handlePaginationChange(pageParams.pageIndex)
}
onMounted(async() => {
    
})
</script>

<style lang="scss" scoped>
:deep(.el-form-item--default) {
    margin-bottom: unset;
}
</style>