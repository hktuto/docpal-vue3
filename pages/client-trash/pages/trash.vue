<template>
    <NuxtLayout class="fit-height withPadding">
        <Table v-loading="loading" :columns="tableSetting.columns" :table-data="tableData" :options="options"
                @command="handleAction"
                @pagination-change="handlePaginationChange"
                @selection-change="handleSelectionChange"
                @row-dblclick="handleDblclick">

                <template #docIcon="{ row, index }">
                    <BrowseItemIcon :type="row.isFolder ? 'folder' : 'file'"/>
                </template>
                <template #actions>
                    <div>
                        <el-button :disabled="!selectedRow || selectedRow.length === 0" type="primary" @click="handleRestore"> {{$t('trash_actions_restore')}} </el-button>
                        <el-button :disabled="!selectedRow || selectedRow.length === 0" type="danger" @click="handleDelete"> {{$t('trash_actions_delete')}} </el-button>
                    </div>
                </template>
            </Table>
            <ReaderDialog ref="ReaderRef" v-bind="previewFile">
                <template #actions>
                    <el-button @click="handleRestoreOne(previewFile.id)">{{$t('trash_actions_restore')}}</el-button>
                    <el-button @click="handleDeleteOne(previewFile.id)"> {{$t('trash_actions_delete')}}</el-button>
                </template>
            </ReaderDialog>
            <ProgressNotification ref="ProgressNotificationRef" :options="processDetail"></ProgressNotification>
            <!-- <ProgressDialog ref="ProgressDialogRef" :options="processDetail"></ProgressDialog> -->
    </NuxtLayout>
</template>


<script lang="ts" setup>
import { GetTrashApi, DeleteByIdApi, RestoreByIdApi, GetDocumentPreview, TABLE, defaultTableSetting, Login } from 'dp-api'
import { ElNotification } from 'element-plus'
import { RefreshLeft, Delete } from '@element-plus/icons-vue'
// #region module: page
    const route = useRoute()
    const router = useRouter()
    const pageParams = {
        pageIndex: 0,
        pageSize: 20
    }
const tableKey = TABLE.CLIENT_TRASH
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
          sortKey: tableKey
        }
    })


    async function getList (param) {
        state.loading = true
        try {
            const res = await GetTrashApi(param)
            state.tableData = res.entryList
            state.options.paginationConfig.total = res.totalSize
            state.options.paginationConfig.pageSize = param.pageSize
            state.options.paginationConfig.currentPage = param.pageIndex + 1
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
    watch(
        () => route.query,
        async (newval) => {
            const { page, pageSize } = newval
            pageParams.pageIndex = (Number(page) - 1) || 0
            pageParams.pageSize = Number(pageSize) || pageParams.pageSize
            getList(pageParams)
        },
        { immediate: true }
    )
    const { tableData, options, loading } = toRefs(state)
// #endregion
const selectedRow = ref([])

function handleSelectionChange (rows) {
    selectedRow.value = rows
}
const ReaderRef = ref()
const previewFile = reactive({
    blob: null,
    name: '',
    id: '',
    loading: false,
    options: {
        noDownload: true,
        print: false,
        loadAnnotations: false,
    }
})
async function handleDblclick (row) {
    if (row.isFolder) return
    ReaderRef.value.handleOpen()
    previewFile.loading = true
    try {
        previewFile.blob = await GetDocumentPreview(row.id)
    } catch (error) {

    }
    previewFile.id = row.id
    previewFile.name = row.name
    previewFile.loading = false
}
// #region module: delete
    const batchAction = ref('')
    const processDetail = reactive({
        completedNum: 0,
        total: 0,
        title: '',
        delay: 1000
    })
    // const ProgressDialogRef = ref()
    const ProgressNotificationRef = ref()
    function handleAction (command:sting, row: any, rowIndex: number) {
        switch (command) {
            case 'delete':
                handleDeleteOne(row.id)
                break
            case 'restored':
                handleRestoreOne(row.id)
                break
        }
    }
    function handleRestore () {
        batchAction.value = 'restore'
        batchActionHandler()
    }
    function handleDelete () {
        batchAction.value = 'delete'
        batchActionHandler()
    }
    const batchActionHandler = async () => {
        if (selectedRow.value.length === 0) {
            ElNotification.error($i18n.t('dpTip_noSelection') as string)
            return
        }
        if (!batchAction.value) {
            ElNotification.error($i18n.t('trash_error_noAction') as string)
            return
        }
        processDetail.total = selectedRow.value.length
        processDetail.completedNum = 0
        // ProgressDialogRef.value.handleOpen()
        ProgressNotificationRef.value.handleOpen()
        const pList = []
        switch (batchAction.value) {
            case 'restore':
                selectedRow.value.forEach((s) => pList.push(restore(s.id)))
                break
            case 'delete':
                selectedRow.value.forEach((s) => pList.push(deleteOne(s.id)))
                break
        }
        const res = await Promise.all(pList)

        batchAction.value = null
        handleMsg(res)
        setTimeout(async() => {
            await handlePaginationChange(pageParams.pageIndex + 1)
        }, 2000)
    }
    function handleMsg (ids) {
        console.log({ids});

        let num = 0
        const fileNames = ids.reduce((p, id, index) => {
            if (id) {
                num++
                p += ' <br/>' + state.tableData.find(item => item.id === id).name
            }
            return p
        }, '')
        if (num !== 0) {
            ElNotification.error({
                title: '',
                dangerouslyUseHTMLString: true,
                message: `${num} ${$i18n.t('Fail')}: ${fileNames}`
            })
        } else {
            ElNotification.success(`${$i18n.t('commons_success')}` )
        }
    }
    const deleteOnePopoverShow = ref(false)
    async function handleDeleteOne (id, row?) {
        if(!!row) row.deleteOnePopoverShow = false
        deleteOnePopoverShow.value = false
        loading.value = true
        try {
            await deleteOne(id)
        } catch (error) {

        }
        setTimeout(async () => {
            ReaderRef.value.handleClose()
            handlePaginationChange(pageParams.pageIndex + 1)
            loading.value = false
        }, 500)
    }
    async function handleRestoreOne (id) {
        loading.value = true
        try {
            await restore(id)
        } catch (error) {

        }
        // 系统会延时 还原
        setTimeout(async () => {
            ReaderRef.value.handleClose()
            handlePaginationChange(pageParams.pageIndex + 1)
            loading.value = false
        }, 500)
    }
    async function deleteOne(idOrPath) {
        try {
            const res = await DeleteByIdApi(idOrPath)
            processDetail.completedNum++
            return ''
        } catch (error) {
            processDetail.completedNum++
            return idOrPath
        }
    }
    const restore = async (idOrPath: string) => {
        try {
            const res = await RestoreByIdApi(idOrPath)
            processDetail.completedNum++
            return ''
        } catch (error) {
            processDetail.completedNum++
            return idOrPath
        }
    }
// #endregion
async function handleDownload (row: any) {
    const params = {
        token: route.query.token,
        password: sessionStorage.getItem('sharePWD'),
        documentId: row.id
    }
    const blob = await publicDownloadApi(params)
    downloadBlob(blob, row.name || row.title, blob.type)
}
</script>

<style lang="scss" scoped>
.pageContainer {
  padding: calc(var(--app-padding) * 2 );
  position: relative;
  height: 100%;
}
</style>
