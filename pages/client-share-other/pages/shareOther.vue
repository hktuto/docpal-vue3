<template>
    <NuxtLayout class="fit-height withPadding">
        <Table v-loading="loading" :columns="tableSetting.columns" :table-data="tableData" :options="options"
                @pagination-change="handlePaginationChange"
                @command="handleAction"
                @row-dblclick="handleDblclick"
                @row-contextmenu="handleRightClick">
                <template #docIcon="{ row, index }">
                    <div class="nameItem">
                        <BrowseItemIcon v-if="!!row" :type="row.isFolder !== 'false' ? 'folder' : 'file'"/>
                        <div class="label">{{row.documentName}}</div>
                    </div>
                </template>   
        </Table>
        <BrowseRightClick></BrowseRightClick>
        <BrowseInfoAclEditDialog />
        <BrowseActionsEdit v-show="false" @success="handleRefresh" />
        <BrowseActionsNew v-show="false" @success="handleRefresh" />
        <BrowseActionsDelete v-show="false" @success="handleRefresh"/>
        <BrowseActionsPaste v-show="false" @success="handleRefresh"/>
        <BrowseActionsNewFolder v-show="false" @success="handleRefresh"/>
        <BrowseActionsUploadDoc v-show="false" @success="handleRefresh"/>
    </NuxtLayout>
</template>


<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import { ElMessage, ElMessageBox } from 'element-plus'
import { RefreshLeft, Delete } from '@element-plus/icons-vue'
import { GetShareOthersApi, DeleteShareApi, TABLE, defaultTableSetting } from 'dp-api'
// #region module: page
    const route = useRoute()
    const router = useRouter()
    const pageParams = {
        pageNum: 0,
        pageSize: 20
    }
    const tableKey = TABLE.CLIENT_INTERNAL_SHEAR_OTHER
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
            const res = await GetShareOthersApi(param)
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
    async function handleRefresh () {
        handlePaginationChange(...route.query)
        // forceRefresh.value = true
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
// TODO:预览，由于后端数据暂时没法支持预览，所以先不做预览
function handleDblclick (row) {
    if(row.isFolder) {
        // shareFolderId 目录下一层rootId，用于breadcrumbs划分
        sessionStorage.setItem('shareFolderId', row.documentId)
        router.push(`/shareOtherFolder?path=${row.documentId}`)
    }
    else {
        openFileDetail(row.documentId, {
            showInfo:true,
            showHeaderAction:true
        })
    }
}
function handleRightClick (row: any, column: any, event: MouseEvent) {
    event.preventDefault()
    event.stopPropagation();
    // handleSelect([])
    console.log('row', row.isFolder)
    const data = {
        doc: { id: row.documentId, isFolder: row.isFolder, name: row.documentName, path: row.path },
        isFolder: row.isFolder === "false" ? false : true,
        idOrPath: row.path,
        pageX: event.pageX,
        pageY: event.pageY,
        actions: {
            delete: false,
            copy: false, // 后端没返回docPath,没法重命名检测
            cut: false,
            paste: false,
            // rename: false,
            addFolder: false,
            addFile: false
        }
    }
    const ev = new CustomEvent('fileRightClick',{ detail: data })
    document.dispatchEvent(ev)
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
