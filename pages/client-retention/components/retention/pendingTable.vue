<template>
<Table v-loading="loading" :columns="tableSetting.columns" :table-data="state.tableData" :options="options"
    @row-dblclick="handleDblclick"
    @command="handleAction">
    <template #preSortButton>
        <ResponsiveFilter ref="ResponsiveFilterRef" @form-change="handleFilterFormChange"
            inputKey="policyName"/>
    </template>
    <template #action="{ row }">
        <el-dropdown v-if="!!row && !!row.policyRetentionId">
            <span class="el-dropdown-link" >
                <el-button text><el-icon><MoreFilled /></el-icon></el-button>
            </span>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item v-for="item in state.events[row.policyRetentionId]" :key="item.id"
                        @click="handleEvent(item)">{{item.eventLabel}}</el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </template>
</Table>
</template>

<script lang="ts" setup>
import { MoreFilled } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
    GetRetentionDocPageApi,
    GetRetentionDocConditionsApi,
    GetRetentionEventsApi,
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
        extraParams: {},
        events: {}
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
    openFileDetail(row.documentPath, {
      showInfo: true,
      showHeaderAction: true
    })
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
    async function getEvents() {
        state.events = await GetRetentionEventsApi()
    }
    async function handleEvent (event) {
        let msg = $t('msg_confirmWhetherToExecuteCommand')
        const action = await ElMessageBox.confirm(`${msg}: ${event.eventLabel}`)
        if(action !== 'confirm') return
        await SubmitRetentionEventApi(event)
        handlePaginationChange(1)
    }
// #endregion
onMounted(() => {
    getFilter()
    getEvents()
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
