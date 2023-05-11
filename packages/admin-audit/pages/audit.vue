<template>
    <NuxtLayout class="fit-height withPadding">
        <Table :columns="tableSetting.columns" :table-data="tableData" :options="options"
                v-loading="loading"
                @command="handleAction"
                @pagination-change="handlePaginationChange"
                @row-dblclick="handleDblclick">
                <template #preSortButton>
                    <FromRenderer :form-json="formJson" @formChange="handleFormChange"/>
                </template>
                <template #currentPath="{row}">
                    <span v-if="row.currentPath" class="pathButton"  @click="goClientPath(row.currentPath)">{{ row.logicalPath }}</span>
                </template>
        </Table>
    </NuxtLayout>
</template>


<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { 
    GetAuditEventApi, 
    getJsonApi, TABLE, defaultTableSetting, deepCopy } from 'dp-api'
// #region module: page
    const route = useRoute()
    const router = useRouter()
    const pageParams = {
        pageNum: 0,
        pageSize: 20,
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
        extraParams: {}
    })
    const tableKey = TABLE.ADMIN_AUDIT
    const tableSetting = defaultTableSetting[tableKey]

    async function getList (param) {
        state.loading = true
        const res = await GetAuditEventApi({...param, ...state.extraParams})
        state.tableData = res.entryList
        state.loading = false
        state.options.paginationConfig.total = res.totalSize
        state.options.paginationConfig.pageSize = param.pageSize
        state.options.paginationConfig.currentPage = param.pageNum + 1
    }
    function handlePaginationChange (page: number, pageSize: number = pageParams.pageSize) {
        if(!pageSize) pageSize = pageParams.pageSize
        if(!page && page !== 0) page = pageParams.pageNum + 1
        const time = new Date().valueOf().toString()
        router.push({ 
            query: { page, pageSize, time } 
        })
    }

    watch(
        () => route.query,
        async (newval) => {
            const { page, pageSize } = newval
            pageParams.pageNum = (Number(page) - 1) > 0 ? (Number(page) - 1) : 0
            pageParams.pageSize = Number(pageSize) || pageParams.pageSize
            getList(pageParams)
        },
        { immediate: true }
    )
    const { tableData, options, loading } = toRefs(state)
// #endregion
// #region module: search json
    const formJson = getJsonApi('admin/auditSearch.json')
    function handleFormChange (data) {
        const extraParams = Object.keys(data.formModel).reduce((prev,key) => {
            console.log(key, data.formModel[key]);
            if (key === 'auditTemplate' && data.formModel[key]) {
                if (data.formModel[key][0]) prev.eventCategory = data.formModel[key][0]
                if (data.formModel[key][1]) prev.eventId = data.formModel[key][1]
            } else if(key === 'dates' && data.formModel[key]) {
                if (data.formModel[key][0]) prev.eventDateFrom = data.formModel[key][0].replace(/.000.*$/, '.000Z')
                if (data.formModel[key][1]) prev.eventDateTo = data.formModel[key][1].replace(/.000.*$/, '.000Z')
                // .replace(/.000.*$/, 'Z')
            } else if(key === 'path' && data.formModel[key]) {
                const p = deepCopy(data.formModel[key])
                prev.documentId = p.pop()
            }  else if(data.formModel[key]) prev[key] = data.formModel[key]
            return prev
        }, {})
        state.extraParams = extraParams
        handlePaginationChange(1)
    }
// #endregion
function handleAction (command:sting, row: any, rowIndex: number) {
    switch (command) {
        case 'goClientPath':
            goClientPath(row)
            break
    }
}
function handleDblclick (row) {
}

function goClientPath (row) {
    const p = (window.location.origin).replace('admin.', '');
    window.open(p + '/file/browse?path=' + path, '_blank');
}
onMounted(async() => {
    
})
</script>

<style lang="scss" scoped>
:deep(.el-form-item--default) {
    margin-bottom: unset;
}
.pathButton{
    cursor: pointer;
}
</style>