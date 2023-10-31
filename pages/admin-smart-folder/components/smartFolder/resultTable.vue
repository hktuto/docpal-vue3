<template>
    <Table v-loading="loading" :columns="tableSetting.columns" :table-data="tableData" :options="options"
            @pagination-change="handlePaginationChange">
            <template #tags="{ row, index }">
                <div v-if="row.properties && row.properties['nxtag:tags']">
                    <el-tag v-for="item in row.properties['nxtag:tags']" :key="item.label">{{item.label}}</el-tag>
                </div>
            </template>
    </Table>
</template>


<script lang="ts" setup>
import { watchDebounced } from '@vueuse/core'
import { nestedSearchApi, getSearchParamsArray, GetDocumentPreview, TABLE, defaultTableSetting } from 'dp-api'
const props = withDefaults(defineProps<{
    queryParams: any,
}>(), {
  queryParams: {}
})
const emits = defineEmits([
    'refresh'
])
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
        },
    })
    const tableKey = TABLE.CLIENT_SEARCH
    const tableSetting = defaultTableSetting[tableKey]

    async function getList (param) {
        state.loading = true
        try {
            const res = await nestedSearchApi({ ...param })
            state.tableData = res.entryList
            state.options.paginationConfig.total = res.totalSize
            state.options.paginationConfig.pageSize = param.pageSize
            state.options.paginationConfig.currentPage = param.currentPageIndex + 1
        } catch (error) {
            state.tableData = []
        }
        emits('refresh')
        state.loading = false
    }
    function handlePaginationChange (page: number, pageSize: number) {
        if(!pageSize) pageSize = pageParams.pageSize
        const time = new Date().valueOf().toString()
        router.push({
            query: { currentPageIndex:page, pageSize, time }
        })
    }

    watchDebounced(
        () => route.query,
        async (newVal) => {
            const { currentPageIndex, pageSize } = newVal
            pageParams = { ...pageParams, ...getSearchParamsArray(props.queryParams) }
            pageParams.currentPageIndex = currentPageIndex && (Number(currentPageIndex) - 1) > 0 ? (Number(currentPageIndex) - 1) : 0
            pageParams.pageSize = pageSize ? Number(pageSize) : pageParams.pageSize
            await getList(pageParams)
        },
        { debounce: 200, maxWait: 500, immediate: true }
    )
    const { tableData, options, loading } = toRefs(state)
// #endregion

</script>

<style lang="scss" scoped>
.el-tag {
    margin-left: calc(var(--app-padding) / 2);
}
.search-page {
    height: 100%;
    display: flex;
    flex-flow: row nowrap;
    gap: var(--app-padding);
    overflow: hidden;
    position: relative;
    @media(max-width : 1024px) {
      flex-flow: column nowrap;
      //grid-template-columns: 1fr;
      //grid-template-rows: min-content 1fr ;
    }
  .dp-table-container{
    flex: 1 0 80%;
  }
}
</style>
