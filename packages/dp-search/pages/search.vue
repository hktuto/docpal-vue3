<template>
    <NuxtLayout class="fit-height withPadding" :backPath="$route.query.searchBackPath" :showSearch="false">
        <div :class="['search-page',state.expanded ? 'search-page-expanded':'search-page-narrow']">
            <SearchFilterLeft ref="SearchFilterLeftRef" :searchParams="state.searchParams"
                :ready="state.firstReady" :loading="loading"></SearchFilterLeft>
            <div class="search-page-divider">
                <el-button data-testid="search-zoom-button" :class="['zoom-button', state.expanded ? 'button-expanded':'button-narrow']" type="info" :icon="ArrowLeftBold" circle 
                    @click="state.expanded = !state.expanded"/>
            </div>
            <div class="table-container">
                <SearchBar ref="SearchBarRef" :searchParams="state.searchParams"
                    :aggregation="state.aggregation"
                    @updateForm="handleUpdateForm"></SearchBar>
                <div style="overflow: hidden">
                    <Table ref="tableRef" v-loading="loading" :columns="state.columns" :table-data="tableData" :options="state.options"
                            @pagination-change="handlePaginationChange"
                            @row-dblclick="handleDblclick">
                            <template #tags="{ row, index }">
                                <div v-if="row?.properties && row?.properties['nxtag:tags']">
                                    <el-tag v-for="item in row?.properties['nxtag:tags']" :key="item.label">{{item.label}}</el-tag>
                                </div>
                            </template>
                    </Table>
                </div>
                
            </div>
        </div>
        <ReaderDialog ref="ReaderRef" v-bind="previewFile" >
            <template #header>
                <SvgIcon src="/icons/file/position.svg" round :content="$t('jump to browse')"
                    @click="goRoute(previewFile.path)"></SvgIcon></template>
        </ReaderDialog>
    </NuxtLayout>
</template>


<script lang="ts" setup>
import { ArrowLeftBold } from '@element-plus/icons-vue';
import { watchDebounced } from '@vueuse/core'
import { 
    nestedSearchApi,getSearchParamsArray, isSearchParamsEqual, GetDocumentPreview, 
    TABLE, defaultTableSetting, TableAddMultiColumns, deepCopy } from 'dp-api'

// #region module: page
    const route = useRoute()
    const router = useRouter()
    const SearchFilterLeftRef = ref()
    let pageParams = {
        currentPageIndex: 0,
        pageSize: 20
    }
    const tableKey = TABLE.CLIENT_SEARCH
    const tableSetting = defaultTableSetting[tableKey]
    const state = reactive<State>({
        expanded: true,
        firstReady: false,
        loading: false,
        tableData: [],
        aggregation: {},
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
        searchParams: {},
        columns: tableSetting.columns
    })

    async function getList (param) {
        state.loading = true
        try {
            const res = await nestedSearchApi({ ...param })
            SearchFilterLeftRef.value.updateOptions(res.aggregation)
            state.tableData = res.entryList
            state.aggregation = res.aggregation
            state.options.paginationConfig.total = res.totalSize
            state.options.paginationConfig.pageSize = param.pageSize
            state.options.paginationConfig.currentPage = param.currentPageIndex + 1
        } catch (error) {
            state.tableData = []
            state.aggregation = {}
            state.options.paginationConfig.total = 0
            // SearchFilterLeftRef.value.updateOptions(await getAggregation(null))
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
        async (newVal, oldVal) => {
            if (isSearchParamsEqual(deepCopy(newVal), deepCopy(oldVal))) return
            const { currentPageIndex, pageSize } = newVal
            if(!currentPageIndex || !pageSize) return
            pageParams = getSearchParamsArray({...newVal})

            state.searchParams = pageParams

            // pageParams = {...newVal}
            pageParams.currentPageIndex = (Number(currentPageIndex) - 1) > 0 ? (Number(currentPageIndex) - 1) : 0
            pageParams.pageSize = Number(pageSize) || pageParams.pageSize

            await getList(pageParams)
            setTimeout(() => {
                initTable(pageParams)
                state.firstReady = true
            }, 100)
        },
        { debounce: 200, maxWait: 500, immediate: true }
    )
    const { tableData, loading } = toRefs(state)
// #endregion
const ReaderRef = ref()
const previewFile = reactive({
    blob: null,
    name: '',
    id: '',
    path: '',
    loading: false,
    options: {
        noDownload: true,
        print: false,
        loadAnnotations: false,
        readOnly: true
    }
})
async function handleDblclick (row) {
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
function goRoute (qPath, path: string = '/browse', qPathKey: string='path') {
    router.push({
        path,
        query: {
            [qPathKey]: qPath,
        },
    })
}
const tableRef = ref()
function initTable(searchParams) {
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
// #region module: search form
    function handleUpdateForm() {
        nextTick(() => {
            const data = deepCopy(pageParams)
            if(data.includeFolder || data.includeFolder === false) data.includeFolder = data.includeFolder ? 'true' : 'false'
            SearchFilterLeftRef.value.initForm(data)
        })
    }
// #endregion
onMounted(() => {
    setTimeout(() => {
        if(!route.query || Object.keys(route.query).length === 0) state.firstReady = true
    },1000)
})
</script>

<style lang="scss" scoped>
.el-tag {
    margin-left: calc(var(--app-padding) / 2);
}
.search-page {
    height: 100%;
    display: grid;
    grid-template-columns: min-content min-content 1fr;
    transition: all 0.5s;
    overflow: hidden;
    position: relative;
    @media(max-width : 1024px) {
      flex-flow: column nowrap;
      grid-template-columns: 20px min-content 1fr;
    //   grid-template-rows: min-content 1fr ;
    }
}
.search-page-narrow {
    grid-template-columns: 0 min-content 1fr;
    transition: all 0.5s;
    .filterContainer {
        opacity: 0;
    }
}
.table-container {
    // padding-left: 10px;
    // margin-left: 10px;
    // border-left: 1px solid #ddd;
    position: relative;
    display: grid;
    grid-template-rows: min-content 1fr;
    gap: var(--app-padding);
    overflow-y: hidden;
    
    
}
.search-page-divider {
    position: relative;
    margin: 0 15px;
    border-left: 1px solid #ddd;
    .zoom-button {
        position: absolute;
        top: 1px;
        left: -10px;
        width: 15px;
        height: 15px;
    }
    .button-narrow {
        transform: rotate(180deg);
        transition: all 0.5s;
    }
    .button-expanded {
        transition: all 0.5s;
    }
}
</style>
