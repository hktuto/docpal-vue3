<template>
    <NuxtLayout class="fit-height withPadding">
                <Table v-loading="loading" :columns="tableSetting.columns" :table-data="state.tableData" :options="options"
                    @row-dblclick="handleDblclick"
                    @command="handleAction">
                    <template #preSortButton>
                        <ResponsiveFilter ref="ResponsiveFilterRef" @form-change="handleFilterFormChange"
                            inputKey="policyName"/>
                    </template>  
                    <template #suffixSortButton>
                        <el-button @click="handleAdd">{{$t('button.add')}}</el-button>
                    </template>
                    <template #active="{row, index}">
                        <el-switch v-model="row.status" 
                            active-value="A" inactive-value="D"
                            :loading="row.loading"
                            @change="(value) => handleSetStatus(value, row)"
                            />
                    </template>
                </Table>
        <HoldPoliciesAddDialog ref="HoldPoliciesAddDialogRef" @update="handlePaginationChange" />
    </NuxtLayout>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import {
    GetHoldPoliciesPageApi,
    DeleteHoldPolicyApi,
    UpdateHoldPolicyStatusApi,
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
    const tableKey = TABLE.ADMIN_HOLD_POLICIES_MANAGE
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
            const res = await GetHoldPoliciesPageApi({ ...param, ...state.extraParams })
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

const HoldPoliciesAddDialogRef = ref()
function handleAdd () {
    HoldPoliciesAddDialogRef.value.handleOpen()
}
async function handleSetStatus (status, row) {
    if(!row.id) return
    const isSuccess = await UpdateHoldPolicyStatusApi(row.id, status)
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
    await DeleteHoldPolicyApi(id)
    handlePaginationChange(pageParams.pageNum + 1)
}
function handleDblclick(row) {
    HoldPoliciesAddDialogRef.value.handleOpen({
        ...row,
        isEdit: true
    })
}
// #region module: ResponsiveFilterRef
    const ResponsiveFilterRef = ref()
    async function getFilter() {
        const data = [
            { key: "status", label: "user_active", type: "string", isMultiple: false,
                options: [
                    { label: "noActive", value: "D" },
                    { label: "isActive", value: "A" }
                ]
            }
        ]
        ResponsiveFilterRef.value.init(data)
    }
    function handleFilterFormChange(formModel) {
        state.extraParams = formModel
        handlePaginationChange(1)
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
