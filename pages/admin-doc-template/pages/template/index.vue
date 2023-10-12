<template>
<NuxtLayout class="fit-height withPadding">
    <Table v-loading="loading" :columns="tableSetting.columns" :table-data="state.tableData" :options="options"
        @row-dblclick="handleDblclick"
        @command="handleAction"
        @pagination-change="handlePaginationChange">
        <template #preSortButton>
            <ResponsiveFilter ref="ResponsiveFilterRef" @form-change="handleFilterFormChange"
                inputKey="name"/>
        </template>  
        <template #suffixSortButton>
            <el-button @click="handleAdd">{{$t('button.add')}}</el-button>
        </template>
        <template #iconName="{ row }">
            <BrowseItemIcon v-if="row.fileType" class="icon" type="'file'" :mimeType="getMimeType(row.fileType)" status="general"/>
        </template>
        <template #templateAction="{ row }">
            <el-dropdown @click.stop @dblclick.stop>
                <SvgIcon src="/icons/dots.svg" @click.stop @dblclick.stop></SvgIcon>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item v-loading="loading" @click="handleDblclick(row)">{{$t('common_preview')}}</el-dropdown-item>
                        <el-dropdown-item v-loading="loading" @click="handleReplace(row)">{{$t('tip.templateReplace')}}</el-dropdown-item>
                        <el-dropdown-item v-loading="loading" :disabled="row.fileType === 'PDF'" @click="handleEdit(row)">{{$t('template.edit')}}</el-dropdown-item>
                        <el-dropdown-item v-loading="loading" @click="handleEditInfo(row)">{{$t('template.editInfo')}}</el-dropdown-item>
                        <el-dropdown-item v-loading="loading" @click="handleDelete(row)">{{$t('common_delete')}}</el-dropdown-item>
                        <el-dropdown-item v-loading="loading" @click="handleDownload(row)">{{$t('template.download')}}</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
            
        </template>
    </Table>
    <TemplateAddStep1Dialog ref="TemplateAddStep1DialogRef" @update="handlePaginationChange(1)"></TemplateAddStep1Dialog>
    <TemplateReplaceDialog ref="TemplateReplaceDialogRef" @refresh="emits('refresh')"/>
</NuxtLayout>
</template>

<script lang="ts" setup>
import { Download } from '@element-plus/icons-vue';
import { ElNotification, ElMessage, ElMessageBox } from 'element-plus'
import {
    GetTemplatePageApi,
    DeleteTemplateApi,
    GetTemplatePageConditionsApi,
    getOfficeTokenApi,
    DownloadDocApi,
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
    const tableKey = TABLE.ADMIN_DOC_TEMPLATE
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
            rowKey: 'id'
        },
        extraParams: {}
    })
    async function getList (param) {
        state.loading = true
        try {
            const res = await GetTemplatePageApi({ ...param, ...state.extraParams })
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
    const { tableData, options, loading } = toRefs(state)
// #endregion

// #region module: handleAction
    function handleAction (command, row: any, index: number) {
        switch (command) {
            default:
                break
        }
    }
    async function handleDelete(row) {
        const action = await ElMessageBox.confirm(`${$t('msg_confirmWhetherToDelete')}`)
        if(action !== 'confirm') return
        row.loading = true
        await DeleteTemplateApi(row.id)
        row.loading = false
        handlePaginationChange(pageParams.pageNum + 1)
    }

    const TemplateAddStep1DialogRef = ref()
    function handleAdd() {
        TemplateAddStep1DialogRef.value.handleOpen()
    }
    function handleDblclick(row) {
        router.push(`/template/${row.id}`)
    }
    function handleEditInfo(row) {
        TemplateAddStep1DialogRef.value.handleOpen({ ...row, isEdit: true })
    }
    const TemplateReplaceDialogRef = ref()
    function handleReplace (row) {
        TemplateReplaceDialogRef.value.handleOpen(row)
    }
    async function handleEdit(row){
        try {
            const token = await getOfficeTokenApi(row.documentId)
            const baseUrl = officeUrl(row.documentId, token)
            // const baseUrl = `https://office.app4.wclsolution.com/browser/85ac843/cool.html?WOPISrc=https://app4.wclsolution.com/api/wopi/files/${props.doc.id}?access_token=${token}`
            window.open(baseUrl, '_blank')
        } catch (error) {
            
        }
    }
    function officeUrl(docId:string, token:string) {
        let host = window.location.host.replace('admin.', '');
        if(!host.includes('localhost')){
            return `https://office.${host}/browser/85ac843/cool.html?WOPISrc=https://office.${host}/wopi/files/${docId}?access_token=${token}`
        }else{
            return `https://office.app4.wclsolution.com/browser/85ac843/cool.html?WOPISrc=https://office.app4.wclsolution.com/wopi/files/${docId}?access_token=${token}`
        }
    }
    async function handleDownload(row) {
        const id = new Date().valueOf() + row.name
        const notification = ElNotification({
            title: '',
            icon: Download,
            dangerouslyUseHTMLString: true,
            message: `<span id="${id}">0%</span> <span title="${row.name}">${row.name}</span>`,
            showClose: false,
            customClass: 'download-notification',
            duration: 0,
            position: 'bottom-right'
        });
        try {
            const blob = await DownloadDocApi(row.documentId, (e) => {
                const el = document.getElementById(id)
                if(el) el.innerHTML = Math.round((e.loaded / e.total) * 100) + '%'
            })
            await downloadBlob(blob, row.name)
        } catch (error) {
            ElMessage.error(t('download_noFile') as string)
        }
        setTimeout(()=> {
            notification.close()
        }, 3000)
    }
    function getMimeType(type) {
        return ExtensionMimeTypeMap[type]
    }
// #endregion
// #region module: ResponsiveFilterRef
    const ResponsiveFilterRef = ref()
    async function getFilter() {
        const data = await GetTemplatePageConditionsApi()
        ResponsiveFilterRef.value.init(data)
    }
    function handleFilterFormChange(formModel) {
        state.extraParams = formModel
        handlePaginationChange(1)
    }
// #endregion
onMounted(() => {
    getFilter()
})
</script>

<style lang="scss" scoped>
.pageContainer{
  height: 100%;
  overflow: auto;
  padding: calc( var(--app-padding) * 2);
}
:deep(.tableHeader) {
    margin-bottom: 10px;
    & > .el-button {
        margin: unset;
    }
}
</style>
