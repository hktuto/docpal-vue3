<template>
    <Table ref="tableRef" v-loading="state.loading" 
        :columns="state.columns" 
        :table-data="state.tableData" :options="state.options"
        @sort-change="handleSortChange"
        @pagination-change="handlePaginationChange"
        @row-dblclick="handleDblclick">
        <template #tags="{ row, index }">
            <div v-if="row.properties && row.properties['nxtag:tags']">
                <el-tag v-for="item in row.properties['nxtag:tags']" :key="item.label">{{item.label}}</el-tag>
            </div>
        </template>
    </Table>
</template>

<script lang="ts" setup>
import { 
    nestedSearchApi, 
    TABLE, defaultTableSetting, TableAddMultiColumns } from 'dp-api'

// #region module: page
    const route = useRoute()
    const router = useRouter()
    let pageParams = {
        currentPageIndex: 0,
        pageSize: 20
    }
    const tableKey = TABLE.CLIENT_SEARCH
    const tableSetting = defaultTableSetting[tableKey]
    const state = reactive<any>({
        loading: false,
        tableData: [],
        options: {
            showPagination: true,
            paginationConfig: {
                total: 0,
                currentPage: 1,
                pageSize: pageParams.pageSize
            },
        },
        searchParams: {},
        columns: tableSetting.columns
    })

    async function getList (param: any) {
        state.loading = true
        try {
            const res = await nestedSearchApi({ ...param })
            state.tableData = res.entryList
            state.options.paginationConfig.total = res.totalSize
            state.options.paginationConfig.pageSize = param.pageSize
            state.options.paginationConfig.currentPage = param.currentPageIndex + 1
        } catch (error) {
            state.tableData = []
            state.options.paginationConfig.total = 0
        }
        state.loading = false
    }
    function handlePaginationChange (page: number, pageSize: number) {
        if(!pageSize) pageSize = pageParams.pageSize
        getList({...state.searchParams, currentPageIndex: page - 1, pageSize})
    }
    function handleSortChange({ column, prop, order }: any) {
        console.log(column, prop, order);
        if (!order) getList({ ...state.searchParams, ...pageParams })
        else  getList({...state.searchParams, ...pageParams, 
            orderBy: prop,
            isDesc: order === 'descending' ? true : false
        })
    }
// #endregion
async function handleDblclick (row: any) {
    if(row.isFolder) {
        goRoute(row.path)
    } else if(row.type === 'Collection') {
        goRoute(row.id, '/collection', 'tab')
    } else{
      openFileDetail(row.path, {
        showInfo:true,
        showHeaderAction:true
      })
    }

}
function goRoute (qPath: string, path: string = '/browse', qPathKey: string='path') {
    router.push({
        path,
        query: {
            [qPathKey]: qPath,
        },
    })
}
const tableRef = ref()
function initTable(searchParams: any) {
    const dynamicColumns = {
        size: { id: 'search_size', label: 'search_size', prop: 'properties.file:content.length', type: 'size' },
        height: { id: 'search_height', label: 'search_height', prop: 'properties.picture:info.height' },
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
                dynamicColumns.height,
                dynamicColumns.width,
                dynamicColumns.size
            ]
            const picData = TableAddMultiColumns(pic, tableSetting.columns, tableSetting.columns.length)
            state.columns = picData
            break;
        case 'Video':
            const vid = [
                dynamicColumns.height,
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
    nextTick(() => {
        if(state.columns) tableRef.value.reorderColumn(state.columns)
    })

}
function handleSearch(searchParams: any) {
    state.searchParams = { ...searchParams }
    initTable(searchParams)
    getList({...searchParams, currentPageIndex: 0, pageSize: pageParams.pageSize })
}
onMounted(() => {
})
defineExpose({ handleSearch })
</script>

<style lang="scss" scoped>
.table-container {
    position: relative;
    display: grid;
    grid-template-rows: min-content 1fr;
    gap: var(--app-padding);
    overflow-y: hidden;
}
</style>
