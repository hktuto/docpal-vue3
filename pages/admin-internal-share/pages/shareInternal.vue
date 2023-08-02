<template>
    <NuxtLayout class="fit-height withPadding">
        <Table v-loading="loading" :columns="tableSetting.columns" :table-data="tableData" :options="options"
                @pagination-change="handlePaginationChange"
                @command="handleAction"
                @row-dblclick="handleDblclick">
                <template #docIcon="{ row, index }">
                    <div class="nameItem">
                        <BrowseItemIcon v-if="!!row" :type="row.isFolder !== 'false' ? 'folder' : 'file'"/>
                        <div class="label">{{row.documentName}}</div>
                    </div>
                </template>   
        </Table>
    </NuxtLayout>
</template>


<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import { ElMessage, ElMessageBox } from 'element-plus'
import { RefreshLeft, Delete } from '@element-plus/icons-vue'
import { GetShareInternalApi, DeleteShareApi, TABLE, defaultTableSetting } from 'dp-api'
// #region module: page
    const route = useRoute()
    const router = useRouter()
    const pageParams = {
        pageNum: 0,
        pageSize: 20
    }
    const tableKey = TABLE.ADMIN_INTERNAL_SHEAR
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
            sortKey: tableKey,
        },
    })


    async function getList (param) {
        state.loading = true
        try {
            const res = await GetShareInternalApi(param)
            state.tableData = res.entryList
            state.options.paginationConfig.total = res.totalSize
            state.options.paginationConfig.pageSize = param.pageSize
            state.options.paginationConfig.currentPage = param.pageNum + 1
        } catch (error) {

        }
        state.loading = false
    }
    function handlePaginationChange (page: number, pageSize: number) {
        if(!pageSize) pageSize = pageParams.pageSize
        const time = new Date().valueOf().toString()
        router.push({
            query: { page, pageSize, time }
        })
    }
    function handleAction (command:sting, row: any, rowIndex: number) {
        switch(command) {
            case 'preview':
                handleDblclick(row)
                break
            case 'delete':
                handleDelete(row)
        }
    }
    watch(
        () => route.query,
        async (newval) => {
            const { page, pageSize } = newval
            dpLog({pageSize});

            pageParams.pageNum = (Number(page) - 1) > 0 ? (Number(page) - 1) : 0
            pageParams.pageSize = Number(pageSize) || pageParams.pageSize
            getList(pageParams)
        },
        { immediate: true }
    )
    const { tableData, options, loading } = toRefs(state)
// #endregion
// TODO:预览
function handleDblclick (row) {
    // if(row.isFolder) {
    //     sessionStorage.setItem('shareFolderId', row.documentId)
    //     router.push('/shareInternalFolder')
    // }
    // else {
    //     openFileDetail(row.documentId, {
    //         showInfo:false,
    //         showHeaderAction:false
    //     })
    // }
}
function handleDelete (row) {
    ElMessageBox.confirm(`${$i18n.t('msg_confirmWhetherToDelete')}`)
            .then(async() => {
                const param = []
                param.push(...row.detailIds.split(','))
                await DeleteShareApi(param)
                handlePaginationChange(pageParams.pageNum - 1, pageParams.pageSize)
            })
}
</script>

<style lang="scss" scoped>
.nameItem{
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    gap: var(--app-padding);
}
</style>
