<template>
    <NuxtLayout class="fit-height withPadding">
        <Table v-loading="loading" :columns="tableSetting.columns" :table-data="tableData" :options="options"
                @pagination-change="handlePaginationChange"
                @selection-change="handleSelectionChange"
                @row-dblclick="handleDblclick">
                <template #actions>
                    <div>
                        <el-button :disabled="!selectedRow || selectedRow.length === 0" type="primary" @click="handleRestore"> {{$t('restoreSelected')}} </el-button>
                        <el-button :disabled="!selectedRow || selectedRow.length === 0" type="danger" @click="handleDelete"> {{$t('deleteSelected')}} </el-button>
                    </div>
                </template>    
            </Table>
            <ReaderDialog ref="ReaderRef" v-bind="previewFile">
                <template #actions>
                    <el-button @click="handleRestoreOne(previewFile.id)">{{$t('restore')}}</el-button>
                    <el-button @click="handleDeleteOne(previewFile.id)"> {{$t('delete')}}</el-button>
                </template>
            </ReaderDialog>
            
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
            }
        }
    })
    const tableKey = TABLE.CLIENT_TRASH
    const tableSetting = defaultTableSetting[tableKey]

    async function getList (param) {
        state.loading = true
        const res = await GetTrashApi(param)
        state.tableData = res.entryList
        state.options.paginationConfig.total = res.totalSize
        state.options.paginationConfig.pageSize = param.pageSize
        state.options.paginationConfig.currentPage = param.pageIndex + 1
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
        noDownload: true
    }
})
async function handleDblclick (row) {
    ReaderRef.value.handleOpen()
    previewFile.loading = true
    try {
        previewFile.blob = await GetDocumentPreview(row.id)
    } catch (error) {
        
    }
    previewFile.loading = false
    previewFile.id = row.id
    previewFile.name = row.name
}
// #region module: delete
    const batchAction = ref('')
    const processDetail = ref({
        completeNum: 0,
        totalNum: 0,
        curName: '',
    })
    const ProgressDialogRef = ref()
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
        processDetail.value.totalNum = selectedRow.value.length
        processDetail.value.completeNum = 0
        // ProgressDialogRef.value.openDialog()

        const promises = []
        switch (batchAction.value) {
            case 'restore':
                selectedRow.value.forEach((s) => promises.push(restore(s.id)))
                break
            case 'delete':
                selectedRow.value.forEach((s) => promises.push(deleteOne(s.id)))
                break
        }
        const res = await Promise.all(promises)
        
        batchAction.value = null
        handleMsg(res)
        setTimeout(async() => {
            await handlePaginationChange(pageParams.pageIndex + 1)
        }, 2000)
    }
    function handleMsg (ids) {
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
        await deleteOne(id)
        setTimeout(async () => {
            ReaderRef.value.handleClose()
            handlePaginationChange(pageParams.pageIndex + 1)
            loading.value = false
        }, 500)
    }
    async function handleRestoreOne (id) {
        loading.value = true
        await restore(id)
        // 系统会延时 还原
        setTimeout(async () => {
            ReaderRef.value.handleClose()
            handlePaginationChange(pageParams.pageIndex + 1)
            loading.value = false
        }, 500)
    }
    async function deleteOne(idOrPath) {
        const res = await DeleteByIdApi(idOrPath)
        processDetail.value.completeNum++
        return !!res ? '' : idOrPath
    }
    const restore = async (idOrPath: string) => {
        const res = await RestoreByIdApi(idOrPath)
        processDetail.value.completeNum++
        return !!res ? '' : idOrPath
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
</style>