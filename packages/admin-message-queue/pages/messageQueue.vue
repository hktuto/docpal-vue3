<template>
    <NuxtLayout class="fit-height withPadding">
        <Table :columns="tableSetting.columns" :table-data="tableData" :options="options"
                v-loading="loading"
                @pagination-change="handlePaginationChange"
                @row-dblclick="handleDblclick">
                <template #preSortButton>
                    <FromRenderer :form-json="formJson" @formChange="handleFormChange"/>
                </template>
                <template #refreshAction="{ row, index }">
                    <el-button text :loading="row.loading">
                        <SvgIcon v-if="row.status === 'ERROR'" src="/icons/retry.svg"  style="--icon-color: var(--primary-color)" @click.stop="handleReSubmit(row)"></SvgIcon>
                    </el-button>
                </template>
        </Table>
    </NuxtLayout>
</template>


<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { 
    GetMessageQueuePageApi, ReSubmitMessageQueueApi, 
    getJsonApi, TABLE, defaultTableSetting } from 'dp-api'
// #region module: page
    const route = useRoute()
    const router = useRouter()
    const pageParams = {
        pageNum: 0,
        pageSize: 20,
    }
    const state = reactive<State>({
        loading: false,
        tableData: [],
        options: { 
            showPagination: true, 
            paginationConfig: {
                total: 0,
                currentPage: 1,
                pageSize: pageParams.pageSize
            }
        },
        extraParams: {}
    })
    const tableKey = TABLE.ADMIN_MESSAGE_QUEUE
    const tableSetting = defaultTableSetting[tableKey]

    async function getList (param) {
        state.loading = true
        const res = await GetMessageQueuePageApi(param.pageNum, param.pageSize, {...state.extraParams})
        
        state.tableData = res.entryList
        state.loading = false
        state.options.paginationConfig.total = res.totalSize
        state.options.paginationConfig.pageSize = param.pageSize
        state.options.paginationConfig.currentPage = param.pageNum + 1
    }
    function handlePaginationChange (page: number, pageSize: number = pageParams.pageSize) {
        if(!pageSize) pageSize = pageParams.pageSize
        if(!page && page !== 0) page = pageParams.pageNum + 1
        const time = new Date().valueOf().toString()
        router.push({ 
            query: { page, pageSize, time } 
        })
    }

    watch(
        () => route.query,
        async (newval) => {
            const { page, pageSize } = newval
            pageParams.pageNum = (Number(page) - 1) > 0 ? (Number(page) - 1) : 0
            pageParams.pageSize = Number(pageSize) || pageParams.pageSize
            getList(pageParams)
        },
        { immediate: true }
    )
    const { tableData, options, loading } = toRefs(state)
// #endregion
// #region module: search json
    const formJson = getJsonApi('admin-adminMessageQueueSearch.json')
    function handleFormChange (data) {
        const extraParams = Object.keys(data.formModel).reduce((prev,key) => {
            if(data.formModel[key]) prev[key] = data.formModel[key]
            return prev
        }, {})
        state.extraParams = extraParams
        handlePaginationChange(1)
    }
// #endregion
async function handleReSubmit (row) {
    console.log(row);
    row.loading = true
    const res = await ReSubmitMessageQueueApi(row.messageId)
    if (res.resultCode === 200) {
        ElMessage.success('success')
        handlePaginationChange()
    }
    setTimeout(() => {
        row.loading = false
    }, 500)
}
function handleDblclick (row) {
}
onMounted(async() => {
    
})
</script>

<style lang="scss" scoped>
:deep(.el-form-item--default) {
    margin-bottom: unset;
}
</style>