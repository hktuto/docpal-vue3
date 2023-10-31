<template>
    <NuxtLayout class="fit-height withPadding" :backPath="$route.query.searchBackPath" :showSearch="false">
        <div class="search-page">
            <SearchFilterLeft ref="SearchFilterLeftRef" :ready="state.firstReady" :loading="loading"></SearchFilterLeft>
            <Table v-loading="loading" :columns="tableSetting.columns" :table-data="tableData" :options="options"
                    @pagination-change="handlePaginationChange"
                    @row-dblclick="handleDblclick">
                    <template #tags="{ row, index }">
                        <div v-if="row.properties && row.properties['nxtag:tags']">
                            <el-tag v-for="item in row.properties['nxtag:tags']" :key="item.label">{{item.label}}</el-tag>
                        </div>
                    </template>
            </Table>
        </div>
        <ReaderDialog ref="ReaderRef" v-bind="previewFile" >
            <template #header>
                <SvgIcon src="/icons/file/position.svg" round :content="$t('jump to browse')"
                    @click="goRoute(previewFile.path)"></SvgIcon></template>
        </ReaderDialog>
    </NuxtLayout>
</template>


<script lang="ts" setup>
import { watchDebounced } from '@vueuse/core'
import { nestedSearchApi,getSearchParamsArray, GetDocumentPreview, TABLE, defaultTableSetting } from 'dp-api'

// #region module: page
    const route = useRoute()
    const router = useRouter()
    const SearchFilterLeftRef = ref()
    let pageParams = {
        currentPageIndex: 0,
        pageSize: 20
    }
    const state = reactive<State>({
        firstReady: false,
        loading: false,
        tableData: [],
        options: {
            showPagination: true,
            paginationConfig: {
                total: 0,
                currentPage: 1,
                pageSize: pageParams.pageSize
            },
            sortKey: 'clientSearch'
        },
        searchParams: {}
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
            const { currentPageIndex, pageSize } = newVal
            if(!currentPageIndex || !pageSize) return
            pageParams = getSearchParamsArray({...newVal})

            state.searchParams = pageParams
            if(!state.firstReady) SearchFilterLeftRef.value.initForm(state.searchParams)

            // pageParams = {...newVal}
            pageParams.currentPageIndex = (Number(currentPageIndex) - 1) > 0 ? (Number(currentPageIndex) - 1) : 0
            pageParams.pageSize = Number(pageSize) || pageParams.pageSize

            await getList(pageParams)
            state.firstReady = true
        },
        { debounce: 200, maxWait: 500, immediate: true }
    )
    const { tableData, options, loading } = toRefs(state)
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
        // ReaderRef.value.handleOpen()
        // previewFile.loading = true
        // try {
        //     previewFile.id = row.id
        //     previewFile.path = row.path
        //     previewFile.name = row.name
        //     previewFile.blob = await GetDocumentPreview(row.id)
        // } catch (error) {
        //
        // }
        // previewFile.loading = false
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
