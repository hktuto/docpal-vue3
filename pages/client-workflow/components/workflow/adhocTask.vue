<template>
<div class="grid-c2">
    <el-tabs v-model="activeTab" class="leftTab" tab-position="left" 
            @tab-change="handlePaginationChange(1)">
        <el-tab-pane :label="$t('status.pendingApproval')" name="pendingApproval"></el-tab-pane>
        <el-tab-pane :label="$t('status.submitted')" name="submitted"></el-tab-pane>
        <el-tab-pane :label="$t('status.completed')" name="completed"></el-tab-pane>
    </el-tabs>
    <Table  ref="tableRef"
            :columns="tableSetting.columns" :table-data="tableData" :options="options"
            v-loading="loading"
            @pagination-change="handlePaginationChange"
            @row-dblclick="handleDblclick">
    </Table>
</div>
</template>


<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import { getAdHocPageApi, getJsonApi, TABLE, defaultTableSetting } from 'dp-api'
const { t } = useI18n();
const userId:string = useUser().getUserId()
// #region module: page
    const route = useRoute()
    const router = useRouter()
    const tableRef = ref()
    const pageParams = {
        pageIndex: 0,
        pageSize: 20,
    }
    const tableKey = TABLE.CLIENT_WORKFLOW_COMPLETE_TASK
    const tableSetting = ref(defaultTableSetting[tableKey])
    const state = reactive<State>({
        loading: false,
        activeTab: 'pendingApproval',
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
        extraParams: {}
    })
    
    async function getList (param) {
        handleTableChange()
        state.loading = true
        try {
            const res = await getAdHocPageApi({...param, ...state.extraParams})
            
            state.tableData = res.entryList
            state.options.paginationConfig.total = res.totalSize
            state.options.paginationConfig.pageSize = param.pageSize
            state.options.paginationConfig.currentPage = param.pageIndex + 1
        } catch (error) {
            
        }
        state.loading = false
    }
    function handlePaginationChange (page: number, pageSize: number = pageParams.pageSize) {
        if(!pageSize) pageSize = pageParams.pageSize
        const time = new Date().valueOf().toString()
        router.push({ 
            query: { page, pageSize, time, tab: 'adhocTask', subTab: state.activeTab } 
        })
    }
    function handleTableChange () {
        const tabName = route.query.subTab || 'pendingApproval'
        let tKey
        switch(tabName) {
            case 'submitted':
                tKey = TABLE.CLIENT_ADHOC_SUBMITTED_TASK
                tableSetting.value = defaultTableSetting[tKey]
                state.extraParams = {
                    user_creator_id: userId,
                    processInstanceStatus: 0
                }
                break
            case 'pendingApproval':
                tKey = TABLE.CLIENT_ADHOC_APPROVAL_TASK
                tableSetting.value = defaultTableSetting[tKey]
                state.extraParams = {
                    user_approver_id: userId,
                    processInstanceStatus: 0
                }
                break
            case 'completed':
                tKey = TABLE.CLIENT_ADHOC_COMPLETED_TASK
                tableSetting.value = defaultTableSetting[tKey]
                state.extraParams = {
                    participant: userId,
                    isComplete: true
                }
                break
        }
        setTimeout(() => {
            state.options.sortKey = tKey
            tableRef.value.reorderColumn(tableSetting.value.columns)
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
    const { tableData, options, loading, activeTab } = toRefs(state)
// #endregion
function handleDblclick (row) {
    router.push(`/file/browse?path=${row.documentPath}`)
}
onMounted(async() => {
    
})
watch(() => route.query.subTab, (newTab) => {
    if(!newTab) newTab = 'pendingApproval'
    state.activeTab = newTab
}, { immediate: true })
</script>

<style lang="scss" scoped>
.grid-c2 {
    height: 100%;
    overflow: hidden;
    display: grid;
    grid-template-columns: min-content 1fr;
    .el-tabs--left {
        display: unset;
        grid-template-rows: unset;
    }
}
</style>