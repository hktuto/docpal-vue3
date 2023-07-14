<template>
    <Table  ref="tableRef"
            :columns="tableSetting.columns" :table-data="tableData" :options="options"
            v-loading="loading"
            @command="handleAction"
            @pagination-change="handlePaginationChange"
            @row-click="handleClick">
            <template #preSortButton>
                <FromRenderer ref="FromRendererRef" :form-json="formJson" @formChange="handleFormChange"/>
                <ResponsiveFilter ref="ResponsiveFilterRef" @form-change="handleFilterFormChange"
                    @clear-filter="handleClearFilter"/>
            </template>
            <template #suffixSortButton>
                <div class="suffixSortButton">
                    <slot name="suffixSortButton"></slot>
                </div>
            </template>
    </Table>
</template>


<script lang="ts" setup>
import { 
    GetCabinetConditionsApi, 
    GetCabinetPageApi, 
    getJsonApi, TABLE, defaultTableSetting,
    TableAddColumns } from 'dp-api'
const emit = defineEmits(['row-click']);
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
                pageSize: pageParams.pageSize,
            },
            sortKey: tableKey,
            highlightCurrentRow: true,
            rowKey: 'id'
        },
        extraParams: {},
        curTab: ''
    })
    function handleAction (command, row: any, index: number) {
        switch (command) {
        case 'goRoute':
            goRoute(row)
            break
        default:
            break
        }
    }
    function goRoute (row) {
        router.push({ 
            path: '/browse',
            query: { path: row.documentPath } 
        })
    }
    async function getList (param) {
        state.loading = true
        try {
            state.tableData = []
            const res = await GetCabinetPageApi({...param, ...state.extraParams})
            
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
            pageParams.templateId = route.query.tab
            if(pageParams.templateId) getList(pageParams)
            getFilter(pageParams.templateId)
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
            if(typeof data.formModel[key] === 'boolean') prev[key] = data.formModel[key]
            else if(data.formModel[key] && data.formModel[key].length > 0) prev[key] = data.formModel[key]
            return prev
        }, {})
        state.extraParams = { ...state.extraParams, ...extraParams }
        handlePaginationChange(1)
    }
// #endregion
// #region module: filter
    function handleFilterFormChange(formModel, filedData) {
        Object.keys(formModel).forEach((key) => {
            if(typeof formModel[key] === 'boolean') state.extraParams[key] = formModel[key]
            else if(formModel[key] && formModel[key].length > 0) state.extraParams[key]  = formModel[key]
            else {
                delete state.extraParams[key]
            }
        })
        handlePaginationChange(1)
    }
    function handleClearFilter () {
        FromRendererRef.value.vFormRenderRef.resetForm()
    }
// #endregion
const tableRef = ref()
function handleClick (row) {
    emit('row-click', row)
}
function getSearchParams () {
    return {
        ...state.extraParams,
        ...pageParams,
        templateId: route.query.tab
    }
}
const ResponsiveFilterRef = ref()
async function getFilter(tab) {
    if (state.curTab === tab) return
    state.curTab = tab
    const data = await GetCabinetConditionsApi(tab) 
    ResponsiveFilterRef.value.init(data)
    const ignoreList = ['createdBy', 'complete']
    data.forEach(item => {
        if(!ignoreList.includes(item.key)) {
            TableAddColumns({
                id: item.key,
                label: item.key,
                prop: item.key
            }, tableSetting.columns)
        }
    })
    console.log(tableSetting.columns);
    
}
defineExpose({ getSearchParams })
</script>

<style lang="scss" scoped>
:deep(.el-form-item--default) {
    margin-bottom: unset;
}
:deep(.tableHeader) {
    display: grid;
    grid-template-columns: 1fr min-content;
    margin-bottom: var(--app-padding);
    .headerLeftExpand {
        display: grid;
        grid-template-columns: 200px 1fr;
    }
    .suffixSortButton {
        display: flex;
    }
}
@media (max-width : 1024px) {
    :deep(.tableHeader) {
        width: 100%;
        grid-template-columns: 1fr;
        .headerLeftExpand { 
            gap: var(--app-padding);
            grid-template-columns: unset;
        }
    }
}
</style>