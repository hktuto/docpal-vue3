<template>
    <NuxtLayout >
        <PageContainer>
        <Table v-loading="loading" :columns="tableColumn" :table-data="tableData" :options="options"
                @pagination-change="handlePaginationChange"
                @row-dblclick="handleDblclick"></Table>
        <Drawer ref="DrawerRef" :modal="false" pointerModal>
            <template #title>
                <div class="grid__drawer__title">
                <h3 v-if="detailFile">{{detailFile.name}}</h3>
                <div class="flex">
                    <el-button class="mg-r" size="mini" type="primary" :icon="RefreshLeft" @click="handleRestoreOne(detailFile.id)" circle></el-button>
                    <el-popover  :visible="deleteOnePopoverShow"
                            placement="bottom" width="20rem">
                        <p>{{$t('msg_confirmWhetherToDelete')}}</p>
                        <div style="text-align: right; margin: 0">
                            <el-button @click="deleteOnePopoverShow = false">{{ $t('dpButtom_cancel')}}</el-button>
                            <el-button @click="handleDeleteOne(detailFile.id)" type="primary">{{ $t('trash_actions_delete')}}</el-button>
                        </div>
                        <template #reference>
                            <el-button  size="mini" type="danger" :icon="Delete" circle
                                        @click="deleteOnePopoverShow = !deleteOnePopoverShow"></el-button>
                        </template>
                    </el-popover>
                </div>
                </div>
            </template>
        </Drawer>
        </PageContainer>
    </NuxtLayout>
</template>


<script lang="ts" setup>
import { GetTrashApi, DeleteByIdApi, RestoreByIdApi } from 'dp-api'
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
            showPagination: true, 
            paginationConfig: {
                total: 0,
                currentPage: 1,
                pageSize: pageParams.pageSize
            }
        }
    })
    const tableColumn = [
  {
    "type": "",
    "label": "tableHeader_name",
    "prop": "name",
    "align": "left",
    "hide": false,
    "system": false,
    "showOverflowTooltip": false,
    "formatList": [],
    "id": "1"
  },
  {
    "type": "",
    "label": "tableHeader_path",
    "prop": "logicalPath",
    "align": "left",
    "hide": false,
    "system": false,
    "showOverflowTooltip": false,
    "formatList": [],
    "id": "2"
  },
  {
    "type": "",
    "label": "tableHeader_type",
    "prop": "type",
    "align": "left",
    "hide": false,
    "system": false,
    "showOverflowTooltip": false,
    "formatList": [],
    "id": "3"
  },
  {
    "type": "",
    "label": "trash_deleteBy",
    "prop": "properties.principalName",
    "align": "left",
    "hide": false,
    "system": false,
    "showOverflowTooltip": false,
    "formatList": [],
    "id": "4"
  },
  {
    "type": "",
    "label": "modifiedDate",
    "prop": "modifiedDate",
    "align": "left",
    "hide": false,
    "system": false,
    "showOverflowTooltip": false,
    "formatList": [
      {
        "joiner": "",
        "prop": "name",
        "formatFun": "",
        "params": {},
        "index": 0
      },
      {
        "joiner": "",
        "prop": "modifiedDate",
        "formatFun": "dateFormat",
        "params": {
          "format": "YYYY-MM"
        },
        "index": 1
      }
    ],
    "id": "1677748673863"
  },
  {
    "type": "date",
    "label": "trash_date",
    "prop": "properties.trashed_date",
    "align": "left",
    "hide": false,
    "system": false,
    "showOverflowTooltip": false,
    "formatList": [],
    "id": "5"
  }
]
    // const tableColumn = [
    //     { label: 'tableHeader_name', prop: 'name' },
    //     { label: 'tableHeader_path', prop: 'logicalPath' },
    //     { label: 'tableHeader_type', prop: 'type' },
    //     { label: 'trash_deleteBy', prop: 'properties.principalName' },
    //     { label: 'trash_date', prop: "properties.trashed_date", type: 'date' },
    // ]
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
const detailFile=ref<any>({
    name: ''
})
function handleDblclick (row) {
    detailFile.value = row
    if (!row.isFolder) DrawerRef.value.handleOpen()
    else DrawerRef.value.handleClose()
}

// #region module: delete
    const DrawerRef = ref()
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
        deleteAllPopoverShow.value = false
    }
    const batchActionHandler = async () => {
        if (selectedRow.value.length === 0) {
            ElNotification.error(i18n.t('dpTip_noSelection') as string)
            return
        }
        if (!batchAction.value) {
            ElNotification.error(i18n.t('trash_error_noAction') as string)
            return
        }
        processDetail.value.totalNum = selectedRow.value.length
        processDetail.value.completeNum = 0
        ProgressDialogRef.value.openDialog()

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
            await TableRef.value.tableDataGet()
            TableRef.value.clearSelection()
        }, 2000)
    }
    function handleMsg (ids) {
        let num = 0
        const fileNames = ids.reduce((p, id, index) => {
        if (id) {
            num++
            p += ' <br/>' + TableRef.value.tableData.find(item => item.id === id).name
        }
        return p
        }, '')
        if (num !== 0) {
            ElNotification.error({
                title: '',
                dangerouslyUseHTMLString: true,
                message: `${num} ${i18n.t('Fail')}: ${fileNames}`
            })
        } else {
            ElNotification.success(`${i18n.t('commons_success')}` )
        }
    }
    const deleteOnePopoverShow = ref(false)
    async function handleDeleteOne (id, row?) {
        if(!!row) row.deleteOnePopoverShow = false
        deleteOnePopoverShow.value = false
        loading.value = true
        await deleteOne(id)
        setTimeout(async () => {
            handlePaginationChange(pageParams.pageIndex + 1)
            loading.value = false
            DrawerRef.value.handleClose()
        }, 500)
    }
    async function handleRestoreOne (id) {
        loading.value = true
        await restore(id)
        // 系统会延时 还原
        setTimeout(async () => {
            handlePaginationChange(pageParams.pageIndex + 1)
            loading.value = false
            DrawerRef.value.handleClose()
        }, 500)
    }
    async function deleteOne(idOrPath) {
        await DeleteByIdApi(idOrPath)
        // processDetail.value.completeNum++
        return idOrPath
    }
    const restore = async (idOrPath: string) => {
        await RestoreByIdApi(idOrPath)
        // processDetail.value.completeNum++
        return idOrPath
    }
// #endregion
</script>

<style lang="scss" scoped>
</style>