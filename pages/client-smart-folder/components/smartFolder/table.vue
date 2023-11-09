<template>
    <div class="smartFolder-container">
        <SmartFolderBreadCrumb :breadcrumbs="breadcrumbs"></SmartFolderBreadCrumb>
        <Table ref="tableRef" v-loading="loading" :columns="state.columns" :table-data="tableData" :options="state.options"
                @pagination-change="handlePaginationChange"
                @row-dblclick="handleDblclick">
                <template #tags="{ row, index }">
                    <div v-if="row.properties && row.properties['nxtag:tags']">
                        <el-tag v-for="item in row.properties['nxtag:tags']" :key="item.label">{{item.label}}</el-tag>
                    </div>
                </template>
        </Table>
    </div>
</template>


<script lang="ts" setup>
import { watchDebounced } from '@vueuse/core'
import { nestedSearchApi, TableAddMultiColumns, TABLE, defaultTableSetting } from 'dp-api'
const props = withDefaults(defineProps<{
    breadcrumbs: any,
    searchParams: any
}>(), {
  breadcrumbs: [],
  searchParams: {}
})
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
        columns: tableSetting.columns
    })

    async function getList (param) {
        state.loading = true
        try {
            const res = await nestedSearchApi({ ...param,  ...props.searchParams})
            state.tableData = res.entryList
            state.options.paginationConfig.total = res.totalSize
            state.options.paginationConfig.pageSize = param.pageSize
            state.options.paginationConfig.currentPage = param.currentPageIndex + 1
        } catch (error) {
            state.tableData = []
        }
        state.loading = false
    }
    function handlePaginationChange (page: number, pageSize: number) {
        if(!pageSize) pageSize = pageParams.pageSize
        const time = new Date().valueOf().toString()
        router.push({
            query: { ...route.query, ...pageParams, currentPageIndex:page, pageSize, time }
        })
    }

    watchDebounced(
        () => route.query,
        async (newVal) => {
            let { currentPageIndex, pageSize } = newVal
            if(!currentPageIndex) currentPageIndex = pageParams.currentPageIndex
            if(!pageSize) pageSize = pageParams.pageSize
            pageParams.currentPageIndex = (Number(currentPageIndex) - 1) > 0 ? (Number(currentPageIndex) - 1) : 0
            pageParams.pageSize = Number(pageSize) || pageParams.pageSize
            await getList(pageParams)
            initTable(props.searchParams)
        },
        { debounce: 200, maxWait: 500, immediate: true }
    )
    const { tableData, loading } = toRefs(state)
// #endregion
async function handleDblclick (row) {
    if(row.isFolder) {
        router.push({
            path: route.path,
            query: {
                path: row.path,
                rootId: row.id
            }
        })
    } else if(row.type === 'Collection') {
        router.push({
            path: '/collection',
            query: {
                tab: row.id
            }
        })
    } else{
      openFileDetail(row.path, {
        showInfo:true,
        showHeaderAction:true
      })
    }
}
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
.smartFolder-container{
    display: grid;
    grid-template-rows: min-content 1fr;
    gap: var(--app-padding);
    height: 100%;
    overflow: hidden;
}
</style>
