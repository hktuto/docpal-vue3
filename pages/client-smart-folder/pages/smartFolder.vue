<template>
    <NuxtLayout class="fit-height withPadding">
        <div class="grid-layout">
            <el-tabs v-model="state.tabName" @tab-click="(pane)=> handleTabClick(pane.paneName)">
                <el-tab-pane v-for="(item) in sFolderList" :key="item.id" :label="item.name" :name="item.id"/>
            </el-tabs>
            <div style="overflow: hidden;">
                <Table v-loading="loading" :columns="tableSetting.columns" :table-data="tableData" :options="options"
                    @pagination-change="handlePaginationChange"
                    @row-dblclick="handleDblclick"></Table>
            </div>
        </div>
    </NuxtLayout>
</template>


<script lang="ts" setup>
import { sfolderGetApi, nestedSearchApi, TABLE, defaultTableSetting } from 'dp-api'
const route = useRoute()
const router = useRouter()
const pageParams = {
    pageIndex: 0,
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
    sFolderList: [],
    tabName: ''
})

// #region module: sFolderList
    function handleTabClick(tab) {
        state.tabName = tab
        const time = new Date().valueOf().toString() + 1
        router.push({ 
            query: { tab, page: 1, pageSize: pageParams.pageSize, time } 
        })
    }
// #endregion

// #region module: page
    const tableKey = TABLE.CLIENT_SMART_FOLDER
    const tableSetting = defaultTableSetting[tableKey]
    async function getList (param, tab) {
        state.loading = true
        try {
            const presetParams = getPresetParams(tab)
            const res = await nestedSearchApi({...presetParams, currentPageIndex: param.pageIndex, pageSize: param.pageSize})
            state.tableData = res.entryList
            state.options.paginationConfig.total = res.totalSize
            state.options.paginationConfig.pageSize = param.pageSize
            state.options.paginationConfig.currentPage = param.pageIndex + 1
        } catch (error) {
            
        }
        state.loading = false
    }
    function getPresetParams (tab) {
        const index = state.sFolderList.findIndex(item => item.id === tab)
        if(index === -1) return
        const data = JSON.parse(state.sFolderList[index].json_value) 
        const paramsInTextSearch =  data.paramsInTextSearch
                        ? 
                        data.paramsInTextSearch.split(/ /).filter(s => { return s && s.trim() })
                        : 
                        []
        return { ...data, paramsInTextSearch }
    }
    function handlePaginationChange (page: number, pageSize: number) {
        if(!pageSize) pageSize = pageParams.pageSize
        const time = new Date().valueOf().toString()
        router.push({ 
            query: { tab: state.tabName, page, pageSize, time } 
        })
    }
    watch(
        () => route.query,
        async (newval) => {
            if (state.sFolderList.length === 0) return
            const { page, pageSize, tab } = newval
            if (tab) {
                pageParams.pageIndex = (Number(page) - 1) || 0
                pageParams.pageSize = Number(pageSize) || pageParams.pageSize
                getList(pageParams, tab)
            }
        }
    )
// #endregion
function handleDblclick (row) {
    router.push({
        path: '/browse',
        query: {
            path: row.path,
        },
    })
}

const { tableData, options, loading, sFolderList, tabName } = toRefs(state)
onMounted(async() => {
    state.sFolderList = await sfolderGetApi()
    if(state.sFolderList.length > 0) {
        let index = state.sFolderList.findIndex(item => item.id === route.query.tab)
        if (index === -1) index = 0
        handleTabClick(state.sFolderList[index].id)
    }
})
</script>

<style lang="scss" scoped>
.grid-layout {
    display: grid;
    grid-template-rows: min-content 1fr;
    height: 100%;
    overflow: hidden;
}
</style>
