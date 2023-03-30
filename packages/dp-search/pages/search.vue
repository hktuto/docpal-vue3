<template>
    <NuxtLayout class="fit-height withPadding" :backPath="$route.query.searchBackPath">
        <Table v-loading="loading" :columns="tableSetting.columns" :table-data="tableData" :options="options"
                @pagination-change="handlePaginationChange"
                @row-dblclick="handleDblclick">
                <template #tags="{ row, index }">
                    <el-tag v-for="item in row.properties['nxtag:tags']" :key="item.label">{{item.label}}</el-tag>
                </template>
            </Table>
    </NuxtLayout>
</template>


<script lang="ts" setup>
import { watchDebounced } from '@vueuse/core'
import { nestedSearchApi,getSearchParamsArray, TABLE, defaultTableSetting } from 'dp-api'

// #region module: page
    const route = useRoute()
    const router = useRouter()
    let pageParams = {
        currentPageIndex: 0,
        pageSize: 20
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
    const tableKey = TABLE.CLIENT_SEARCH
    const tableSetting = defaultTableSetting[tableKey]

    async function getList (param) {
        state.loading = true
        const res = await nestedSearchApi(param)
        state.tableData = res.entryList
        state.options.paginationConfig.total = res.totalSize
        state.options.paginationConfig.pageSize = param.pageSize
        state.options.paginationConfig.currentPage = param.currentPageIndex + 1
        state.loading = false
    }
    function handlePaginationChange (page: number, pageSize: number) {
        if(!pageSize) pageSize = pageParams.pageSize
        const time = new Date().valueOf().toString()
        router.push({ 
            query: { ...pageParams, currentPageIndex:page, pageSize, time } 
        })
    }

    watchDebounced(
        () => route.query,
        async (newVal) => {
            const { currentPageIndex, pageSize } = newVal
            pageParams = getSearchParamsArray({...newVal})
            // pageParams = {...newVal}
            pageParams.currentPageIndex = (Number(currentPageIndex) - 1) > 0 ? (Number(currentPageIndex) - 1) : 0
            pageParams.pageSize = Number(pageSize) || pageParams.pageSize
            getList(pageParams)
        },
        { debounce: 200, maxWait: 500, immediate: true }
    )
    const { tableData, options, loading } = toRefs(state)
// #endregion

function handleDblclick (row) {

}
</script>

<style lang="scss" scoped>
</style>
