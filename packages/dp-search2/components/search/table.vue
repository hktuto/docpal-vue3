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
        <template #logicalPath="{ row }">
            <el-tooltip
                effect="dark"
                :content="row.logicalPath"
                placement="top-start"
            >
                {{ getLogicalPath(row) }}
            </el-tooltip>
        </template>
        <template #documentTypeHeader="{column}">
            <div> {{ $t(column.label) }} 
                <el-popover
                    v-if="state.conditionStore && state.conditionStore.type"
                    ref="documentTypeFilterPopover"
                    placement="bottom"
                    :width="250"
                    popper-class="searbar-card-container"
                >
                    <template #reference>
                        <el-icon class="document-type-filter-icon" @click.stop><ArrowDown /></el-icon>
                    </template>
                    
                    
                    <template #default>
                        <SearchBar2CardCheckbox
                            :tag="{ value: state.searchParams.type, key: 'type' }"
                            :condition="state.conditionStore.type"
                            @confirm="(searchParam: any)=>handleFilterChange('type', searchParam['type'])"></SearchBar2CardCheckbox>
                    </template>
                </el-popover>
            </div>
        </template>
    </Table>
</template>

<script lang="ts" setup>
import { ArrowDown  } from '@element-plus/icons-vue';
import { 
    nestedSearchApi, 
    TABLE, defaultTableSetting, TableAddMultiColumns } from 'dp-api'
import { 
    getConditionStore, 
} from '../../utils/searchBar2'
const emits = defineEmits(['filterChange', 'loadingChange'])
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
            sortKey: tableKey
        },
        searchParams: {},
        sortParams: {},
        conditionStore: {},
        columns: tableSetting.columns,
    })
    const filters = reactive<any>({
        type: ''
    })
    async function getList (param: any) {
        state.loading = true
        try {
            const res = await nestedSearchApi({ ...param, ...state.sortParams })
            state.tableData = res.entryList
            state.options.paginationConfig.total = res.totalSize
            state.options.paginationConfig.pageSize = param.pageSize
            state.options.paginationConfig.currentPage = param.currentPageIndex + 1
        } catch (error) {
            state.tableData = []
            state.options.paginationConfig.total = 0
        }
        state.loading = false
        emits('loadingChange', false, state.options.paginationConfig.total !== 0)
    }
    function handlePaginationChange (page: number, pageSize: number) {
        if(!pageSize) pageSize = pageParams.pageSize
        getList({...state.searchParams, currentPageIndex: page - 1, pageSize})
    }
    function handleSortChange({ column, prop, order }: any) {
        state.sortParams = order ? {
            orderBy: prop,
            isDesc: order === 'descending'
        } : {}
        getList({ ...state.searchParams, ...pageParams })

        emits('filterChange', {
            'orderBy': order ? prop : '',
            'isDesc': order === 'descending'
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
        size: { id: 'search.size', label: 'search.size', prop: 'properties.file:content.length', type: 'size' },
        height: { id: 'search.height', label: 'search.height', prop: 'properties.picture:info.height' },
        width: { id: 'search.width', label: 'search.width', prop: 'properties.picture:info.width' },
        duration: { id: 'search.duration', label: 'search.duration', prop: 'properties.vid:info.duration',
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
const documentTypeFilterPopover = ref()
function handleFilterChange(key: string, value: any) {
    emits('filterChange', {[key]: value})
    documentTypeFilterPopover.value.hide()
    state.searchParams = { ...state.searchParams, [key]: value }
    getList({...state.searchParams, currentPageIndex: 0, pageSize: pageParams.pageSize })
}
function getLogicalPath(row: any) {
    if(!row || !row.logicalPath) return ''
    return '/' + row.logicalPath.split('/').shift()
}
onMounted(async() => {
    state.conditionStore = await getConditionStore()
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
:deep(th.el-table__cell) {
    position: relative;
}
:deep(th.el-table__cell .cell) {
    display: flex;
    align-items: center;
    position: relative;
}
.document-type-filter-icon {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translate(0%,-50%);
}
</style>

