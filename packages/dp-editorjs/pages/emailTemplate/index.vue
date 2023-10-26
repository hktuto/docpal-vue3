<template>
    <NuxtLayout class="fit-height withPadding">
        <Table v-loading="state.loading" :columns="tableSetting.columns" :table-data="state.tableData" :options="state.options"
            @row-dblclick="handleDblclick"
            @pagination-change="handlePaginationChange">
            <template #preSortButton>
                <ResponsiveFilter ref="ResponsiveFilterRef" @form-change="handleFilterFormChange"
                    inputKey="subject"/>
            </template>  
            <template #suffixSortButton>
                <el-button type="info" @click="handleEditEmailLayout">{{$t('button.editEmailLayout')}}</el-button>
                <el-button type="primary" @click="handleAdd">{{$t('button.add')}}</el-button>
            </template>
            <template #emailAction="{row, index}">
                <el-button class="emailActionButton" type="text" size="small" 
                    @click="handleDblclick(row)">
                    <SvgIcon src="/icons/edit.svg" ></SvgIcon>
                </el-button>
                <el-button v-if="row.createdBy !== 'system'" class="emailActionButton" type="text" size="small"
                    @click="handleDeleteTemplate(row.id)">
                    <SvgIcon src="/icons/menu/trash.svg" ></SvgIcon>
                </el-button>
            </template>
        </Table>
    </NuxtLayout>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import {
    GetEmailTemplatePageApi,
    DeleteEmailTemplateApi,
    GetEmailLayoutAllApi,
    defaultTableSetting, TABLE
} from 'dp-api'

// #region module: page
    const route = useRoute()
    const router = useRouter()
    const pageParams = {
        pageNum: 0,
        pageSize: 20,
        orderBy: 'createdDate',
        isDesc: true
    }
    const tableKey = TABLE.ADMIN_EMAIL_TEMPLATE
    const tableSetting = defaultTableSetting[tableKey]
    const state = reactive<State>({
        loading: false,
        tableData: [],
        options: {
            multiSelect: true,
            showPagination: true,
            paginationConfig: {
                total: 0,
                currentPage: 1,
                pageSize: pageParams.pageSize
            },
            rowKey: 'id',
            sortKey: tableKey
        },
        extraParams: {}
    })


    async function getList (param) {
        state.loading = true
        try {
            const res = await GetEmailTemplatePageApi({ ...param, ...state.extraParams })
            state.tableData = res.entryList
            state.options.paginationConfig.total = res.totalSize
            state.options.paginationConfig.pageSize = param.pageSize
            state.options.paginationConfig.currentPage = param.pageNum + 1
        } catch (error) {

        }
        state.loading = false
    }
    function handlePaginationChange (page: number, pageSize: number) {
        if(!page) page = pageParams.pageNum + 1
        if(!pageSize) pageSize = pageParams.pageSize
        const time = new Date().valueOf().toString()
        // scroll top
        router.push({
            query: { page, pageSize, time }
        })
    }
    watch(
        () => route.query,
        async (newval) => {
            const { page, pageSize } = newval
            nextTick(() => {

              pageParams.pageNum = (Number(page) - 1) || 0
              pageParams.pageSize = Number(pageSize) || pageParams.pageSize
              getList(pageParams)
            })
        },
        { immediate: true }
    )
// #endregion

async function handleDeleteTemplate(id: string) {
    const action = await ElMessageBox.confirm(`${$t('msg_confirmWhetherToDelete')}`)
    if(action !== 'confirm') return
    await DeleteEmailTemplateApi(id)
    handlePaginationChange(pageParams.pageNum + 1)
}
function handleDblclick(row) {
    router.push(`/emailTemplate/${row.id}`)
}
function handleAdd () {
    router.push(`/emailTemplate/new`)
}
// #region module: ResponsiveFilterRef
    const ResponsiveFilterRef = ref()
    async function getFilter() {
        const layouts = await GetEmailLayoutAllApi()
        const filters = [
            { key: "emailLayoutId", label: "emailTemplate.layout", type: "string", 
                options: layouts.map(item => ({
                    value: item.id,
                    label: item.name
                })) }
        ]
        ResponsiveFilterRef.value.init(filters)
    }
    function handleFilterFormChange(formModel) {
        state.extraParams = formModel
        handlePaginationChange(1)
    }
// #endregion
function handleEditEmailLayout () {
    router.push('/layoutTemplate')
}
onMounted(() => {
    getFilter()
})
</script>

<style lang="scss" scoped>

:deep(.tableHeader) {
    margin-bottom: 10px;
    & > .el-button {
        margin: unset;
    }
}
.emailActionButton {
    padding: unset;
}
</style>
