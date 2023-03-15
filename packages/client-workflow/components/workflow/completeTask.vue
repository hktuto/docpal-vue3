<template>
    <Table  :columns="tableSetting.columns" :table-data="tableData" :options="options"
            v-loading="loading"
            @pagination-change="handlePaginationChange"
            @row-dblclick="handleDblclick"></Table>
</template>


<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import { historyProcessGetApi, TABLE, defaultTableSetting } from 'dp-api'
const { t } = useI18n();
const user = useUser();
// #region module: page
    const route = useRoute()
    const router = useRouter()
    const pageParams = {
        pageIndex: 0,
        pageSize: 20,
        completed: true,
        userId: user.user.userId || user.user.username
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
        }
    })
    const tableKey = TABLE.CLIENT_COMPLETE_TASK
    const tableSetting = defaultTableSetting[tableKey]

    async function getList (param) {
        param.userId = user.user.value.userId || user.user.value.username
        state.loading = true
        const res = await historyProcessGetApi(param)
        
        state.tableData = res.entryList
        state.loading = false
        state.options.paginationConfig.total = res.totalSize
        state.options.paginationConfig.pageSize = param.pageSize
        state.options.paginationConfig.currentPage = param.pageIndex + 1
    }
    function handlePaginationChange (page: number, pageSize: number) {
        if(!pageSize) pageSize = pageParams.pageSize
        const time = new Date().valueOf().toString()
        router.push({ 
            query: { page, pageSize, time, tab: 'completeTask' } 
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

function handleDblclick (row) {
    router.push(`/workflow/${row.id}?state=complete`)
}
onMounted(() => {
})
</script>

<style lang="scss" scoped>
</style>