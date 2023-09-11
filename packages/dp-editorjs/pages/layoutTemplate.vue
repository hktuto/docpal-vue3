<template>
    <NuxtLayout class="fit-height withPadding">
                <Table v-loading="loading" :columns="tableSetting.columns" :table-data="state.tableData" :options="options"
                    @row-dblclick="handleDblclick"
                    @command="handleAction"
                    @pagination-change="handlePaginationChange">
                    <template #preSortButton>
                        <ResponsiveFilter ref="ResponsiveFilterRef" @form-change="handleFilterFormChange"
                            inputKey="policyName"/>
                    </template>  
                    <template #suffixSortButton>
                        <el-button @click="handleAdd">{{$t('button.add')}}</el-button>
                    </template>
                    <template #docType="{row, index}">
                        <el-tag class="el-icon--left table-tag" v-for="item in row.triggers">{{item.documentType}}</el-tag>
                    </template>
                    <template #period="{row, index}">
                        {{row.periodNum}} {{calDate(row.periodUnit) }}
                    </template>
                    <template #active="{row, index}">
                        <el-switch v-model="row.status" 
                            active-value="A" inactive-value="D"
                            :loading="row.loading"
                            @change="(value) => handleSetStatus(value, row)"
                            />
                    </template>
                    <template #isAuto="{ row }">
                        <el-icon v-if="row.isAuto" style="--color: var(--primary-color)"><Select /></el-icon>
                        <el-icon v-else style="--color: #F56C6C"><CloseBold /></el-icon>
                    </template>
                </Table>
    </NuxtLayout>
</template>

<script lang="ts" setup>
import { Select, CloseBold } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
    GetRetentionPageApi,
    DeleteRetentionApi,
    UpdateRetentionStatusApi,
    GetRetentionConditionsApi,
    defaultTableSetting, TABLE
} from 'dp-api'

// #region module: page
    const route = useRoute()
    const router = useRouter()
    const pageParams = {
        pageNum: 0,
        pageSize: 20,
        orderBy: 'createdDate',
        isDesc: true
    }
    const tableKey = TABLE.ADMIN_RETENTION_MANAGE
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
            const res = await GetRetentionPageApi({ ...param, ...state.extraParams })
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
    const { tableData, options, loading } = toRefs(state)
// #endregion

function handleAdd () {
}
async function handleSetStatus (status, row) {
    if(!row.id) return
    const isSuccess = await UpdateRetentionStatusApi(row.id, status)
    if(isSuccess !== true) row.status = row.status === 'A' ? 'D' : 'A'
    else ElMessage.success($t('dpMsg_success'))
}
function handleAction (command, row: any, index: number) {
    switch (command) {
        case 'delete':
            deleteItem(row.id)
            break
        default:
            break
    }
}
async function deleteItem(id: string) {
    const action = await ElMessageBox.confirm(`${$t('msg_confirmWhetherToDelete')}`)
    if(action !== 'confirm') return
    await DeleteRetentionApi(id)
    handlePaginationChange(pageParams.pageNum + 1)
}
function handleDblclick(row) {
    router.push(`/retentionManage/${row.id}`)
}
// #region module: ResponsiveFilterRef
    const ResponsiveFilterRef = ref()
    async function getFilter() {
        const data = await GetRetentionConditionsApi()
        ResponsiveFilterRef.value.init(data)
    }
    function handleFilterFormChange(formModel) {
        state.extraParams = formModel
        handlePaginationChange(1)
    }
// #endregion
function calDate (unit: string) {
    let date = ''
    switch (unit) {
        case 'Y':
            date = 'common_years'
            break;
        case 'M':
            date = 'common_months'
            break;
        case 'D':
            date = 'common_days'
            break;
        default:
            break;
    }
    return $t(date)
}
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
.table-tag {
    margin-top: calc(var(--app-padding) / 6);
    margin-bottom: calc(var(--app-padding) / 6);
}
</style>
