<template>
    <Table  :columns="tableSetting.columns" :table-data="tableData" :options="options"
            v-loading="loading"
            @pagination-change="handlePaginationChange"
            @row-dblclick="handleDblclick">
            <template #preSortButton>
                <FromRenderer ref="FromRendererRef" :form-json="formJson" @formChange="handleFormChange"/>
            </template>
            <template #suffixSortButton>
                <slot name="suffixSortButton"></slot>
            </template>
    </Table>
</template>


<script lang="ts" setup>
import { GetCabinetSubDocumentsApi, getJsonApi, TABLE, defaultTableSetting } from 'dp-api'
const emit = defineEmits(['db-row-click']);
const userId:string = useUser().getUserId()
// #region module: page
    const route = useRoute()
    const router = useRouter()
    const pageParams = {
        pageNum: 0,
        pageSize: 20,
    }
    const tableKey = TABLE.CLIENT_FOLDER_CABINET
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
            sortKey: tableKey
        },
        extraParams: {},
    })
    
    async function getList (param) {
        state.loading = true
        try {
            const res = await GetCabinetSubDocumentsApi({...param, ...state.extraParams})
            
            state.tableData = res.entryList
            state.options.paginationConfig.total = res.totalSize
            state.options.paginationConfig.pageSize = param.pageSize
            state.options.paginationConfig.currentPage = param.pageNum + 1
        } catch (error) {
            state.tableData =[]
        }
        state.loading = false
    }
    function handlePaginationChange (page: number, pageSize: number = pageParams.pageSize) {
        if(!pageSize) pageSize = pageParams.pageSize
        const time = new Date().valueOf().toString()
        router.push({ 
            query: { ...route.query, page, pageSize, time } 
        })
    }

    watch(
        () => route.query,
        async (newval) => {
            const { page, pageSize } = newval
            pageParams.pageNum = (Number(page) - 1) > 0 ? (Number(page) - 1) : 0
            pageParams.pageSize = Number(pageSize) || pageParams.pageSize
            pageParams.id = route.query.tab
            getList(pageParams)
        },
        { immediate: true }
    )
    const { tableData, options, loading } = toRefs(state)
// #endregion

// #region module: 
    const FromRendererRef = ref()

// #endregion
// #region module: search json
    const formJson = getJsonApi('folderCabinetSearch.json')
    function handleFormChange (data) {
        const extraParams = Object.keys(data.formModel).reduce((prev,key) => {
            if(data.formModel[key] && data.formModel[key].length > 0) prev[key] = data.formModel[key]
            return prev
        }, {})
        state.extraParams = extraParams
        handlePaginationChange(1)
    }
// #endregion
function handleDblclick (row) {
    emit('db-row-click', row)
    // router.push(`/workflow/${row.id}?state=${state.tabName}`)
}
onMounted(() => {
    setTimeout(() => {
    })  
})
// defineExpose({ })
</script>

<style lang="scss" scoped>
:deep(.el-form-item--default) {
    margin-bottom: unset;
}
</style>