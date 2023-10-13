<template>
    <div class="smartFolder-container">
        <SmartFolderBreadCrumb :breadcrumbs="breadcrumbs"></SmartFolderBreadCrumb>
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
</template>


<script lang="ts" setup>
import { watchDebounced } from '@vueuse/core'
import { nestedSearchApi, TABLE, defaultTableSetting } from 'dp-api'
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
            sortKey: 'clientSearch'
        }
    })
    const tableKey = TABLE.CLIENT_SEARCH
    const tableSetting = defaultTableSetting[tableKey]

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
        },
        { debounce: 200, maxWait: 500, immediate: true }
    )
    const { tableData, options, loading } = toRefs(state)
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
