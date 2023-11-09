<template>
    <Table ref="tableRef" v-loading="loading" :columns="state.columns" :table-data="tableData" :options="options"
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
import { nestedSearchApi, getSearchParamsArray, GetDocumentPreview, 

    TableAddMultiColumns, TABLE, defaultTableSetting } from 'dp-api'
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
    const tableKey = TABLE.CLIENT_SEARCH
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
            sortKey: 'clientSearch',
            sortAll: true
        },
        columns: []
    })

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
            pageParams = { ...pageParams, paramsInTextSearch: [props.queryParams.keyword],  ...getSearchParamsArray(props.queryParams) }
            delete pageParams.keyword
            pageParams.currentPageIndex = currentPageIndex && (Number(currentPageIndex) - 1) > 0 ? (Number(currentPageIndex) - 1) : 0
            pageParams.pageSize = pageSize ? Number(pageSize) : pageParams.pageSize
            await getList(pageParams)
            initTable(pageParams)
        },
        { debounce: 200, maxWait: 500, immediate: true }
    )
    const { tableData, options, loading } = toRefs(state)
// #endregion
const tableRef = ref()
function initTable(searchParams) {
    const dynamicColumns = {
        size: { id: 'search_size', label: 'search_size', prop: 'properties.file:content.length', type: 'size' },
        hight: { id: 'search_hight', label: 'search_hight', prop: 'properties.picture:info.height' },
        width: { id: 'search_width', label: 'search_width', prop: 'properties.picture:info.width' },
        duration: { id: 'search_duration', label: 'search_duration', prop: 'properties.vid:info.duration',
                    formatList: [
                        {
                            "joiner": "",
                            "prop": "properties.vid:info.duration",
                            "formatFun": "unit",
                            "params": {
                                "unit": "s"
                            },
                            "index": 0
                        }
                    ]
            },
    }
    switch (searchParams.assetType) {
        case 'Picture':
            const pic = [
                dynamicColumns.hight,
                dynamicColumns.width,
                dynamicColumns.size
            ]
            const picData = TableAddMultiColumns(pic, tableSetting.columns, tableSetting.columns.length)
            state.columns = picData
            break;
        case 'Video':
            const vid = [
                dynamicColumns.hight,
                dynamicColumns.width,
                dynamicColumns.size,
                dynamicColumns.duration
            ]
            const vidData = TableAddMultiColumns(vid, tableSetting.columns, tableSetting.columns.length)
            state.columns = vidData
            break
        case 'Audio':
            const aud = [
                dynamicColumns.size
            ]
            const audData = TableAddMultiColumns(aud, tableSetting.columns, tableSetting.columns.length)
            state.columns = audData
            break
        default:
            const def = [
                dynamicColumns.size
            ]
            const defData = TableAddMultiColumns(def, tableSetting.columns, tableSetting.columns.length)
            state.columns = defData
            break;
    }
    tableRef.value.reorderColumn(state.columns)

}
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
