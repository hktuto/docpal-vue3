<template>
    <Table  ref="tableRef"
            :columns="tableSetting.columns" :table-data="tableData" :options="options"
            v-loading="loading"
            headerClass="table-responsive-header"
            @command="handleAction"
            @pagination-change="handlePaginationChange"
            @row-click="handleClick"
            @row-dblclick="handleClick"
      >
            <template #preSortButton>
                <ResponsiveFilter ref="ResponsiveFilterRef" @form-change="handleFilterFormChange"
                   inputKey="label" @clear-filter="handleClearFilter"/>
            </template>
            <template #status="{ row, index }">
                <SvgIcon :src="`/icons/file/status-${row.state}.svg`"></SvgIcon>
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
    TableAddColumns,
    deepCopy} from 'dp-api'
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
    const tableSetting = ref(deepCopy(defaultTableSetting[tableKey]))

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
        extraParamsFilter: {
        },
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
            const res = await GetCabinetPageApi({...param, ...state.extraParamsFilter})

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
            if (pageParams.templateId) {
                getFilter(pageParams.templateId)
                getList(pageParams)
            }
        },
        { immediate: true }
    )
    const { tableData, options, loading } = toRefs(state)


// #endregion

// #region module:
    const FromRendererRef = ref()

// #endregion
// #region module: filter
    function handleFilterFormChange(formModel, filedData) {
        if (!formModel.sortOrder) formModel.sortOrder = 'desc'
        if (!formModel.sortBy) formModel.sortBy = 'label'
        state.extraParamsFilter = formModel
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
        ...pageParams,
        templateId: route.query.tab
    }
}
const ResponsiveFilterRef = ref()
async function getFilter(tab) {
    if (state.curTab === tab) return
    state.extraParamsFilter = {}
    state.curTab = tab
    const data = await GetCabinetConditionsApi(tab)
    data.unshift(
        { key: "sortBy", label: "tableHeader.sortBy", type: "string", isMultiple: false,
            options: [
                { label: 'tableHeader_status', value: 'state' },
                { label: 'tableHeader_name', value: 'label' },
                { label: 'tableHeader_modifiedDate', value: 'modified_date_' },
                { label: 'role.creator', value: 'created_by_' },
                { label: 'info_contributors', value: 'modified_by_' },
                { label: 'tableHeader.deadline', value: 'deadline' }
            ]
        },
        { key: "sortOrder", label: "tableHeader.sortOrder", type: "string", isMultiple: false,
            options: [
                { label: 'tableHeader.desc', value: 'desc' },
                { label: 'tableHeader.asc', value: 'asc' }
            ]
        }
    )
    ResponsiveFilterRef.value.init(data)
    const ignoreList = ['createdBy', 'complete','sortOrder', 'sortBy']
    tableSetting.value = deepCopy(defaultTableSetting[tableKey])
    data.forEach(item => {
        if(!ignoreList.includes(item.key)) {
            TableAddColumns({
                id: item.key,
                label: item.key,
                prop: item.key
            }, tableSetting.value.columns)
        }
    })
    tableRef.value.reorderColumn(tableSetting.value.columns)
}
defineExpose({ getSearchParams })
</script>

<style lang="scss" scoped>
:deep(.el-form-item--default) {
    margin-bottom: unset;
}
:deep(.headerLeftExpand) {
    .el-input {
        width: 200px;
    }
}
</style>
