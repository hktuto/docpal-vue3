<template>
    <NuxtLayout class="fit-height withPadding" backPath="/fileRequest" >
        <div class="pageContainer" v-loading="state.submitLoading || state.loading">
            <div class="left-top">
                <div class="flex-x-between">
                    <el-select v-model="state.applyDocumentType" filterable default-first-option >
                        <el-option v-for="item in state.fileTypes" :key="item.name" :value="item.name" :label="item.name"></el-option>
                    </el-select>
                    <el-button class="el-icon--right" @click="applyToSelect('documentType', state.applyDocumentType)">{{$t('dpButtom_apply')}}</el-button>
                </div>
            </div>
            <div class="left-bottom">
                <el-checkbox v-model="state.checkAll" @change="handleCheckAll">{{$t('button.selectAll')}}</el-checkbox>
                <el-tree
                    ref="treeRef"
                    :data="state.tableData"
                    show-checkbox
                    node-key="id"
                    default-expand-all
                    highlight-current	
                    :current-node-key="state.selectedRow.id"
                    :expand-on-click-node="false"
                    :props="{ class: customNodeClass }"
                    @node-click="handleDblclick"
                    @check-change="handleCheckChange"
                    >
                    <template #default="{ node, data }">
                        <div class="flex-x-between tree-item">
                            <div class="tree-item--title ellipsis" :title="data.name">
                                {{data.name}}
                            </div>
                            <div class="tree-item--right">
                                <div class="tree-item--documentType ellipsis" :title="data.documentType">{{data.documentType}}</div>
                                <el-icon v-if="data.approved" color="#529b2e"><CircleCheckFilled /></el-icon>
                                <el-icon v-else color="#c45656"><WarnTriangleFilled /></el-icon>
                            </div>
                        </div>
                    </template>
                </el-tree>
            </div>
            <div class="middle-top flex-x-between">
                <el-button :loading="state.submitLoading" @click="handleSubmit">{{$t('submit')}}</el-button>
            </div>
            <div class="middle-bottom">
                <el-form ref="formRef" :model="state.selectedRow" label-position="top">
                    <el-form-item :label="$t('dpDocument_fileName')" prop="name"
                        :rules="[{ required: true, message: $t('form_common_requird')}]">
                        <el-input v-model="state.selectedRow.name" />
                    </el-form-item>
                    <el-form-item :label="$t('dpTool_approve')" prop="approved">
                        <el-switch v-model="state.selectedRow.approved" />
                    </el-form-item>
                    <el-form-item :label="$t('dpDocument_fileType')" prop="documentType">
                        <el-select v-model="state.selectedRow.documentType" filterable default-first-option
                            @change="handleDocTypeChange(state.selectedRow)">
                            <el-option v-for="item in fileTypes" :key="item.name" :value="item.name" :label="item.name"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <MetaRenderForm ref="MetaFormRef" mode="fileRequest" 
                    @formChange="handleMetaChange"
                    @handleApply="handleApply"></MetaRenderForm>
            </div>
            <el-card class="right">
                <div class="flex-x-between">
                    <div>{{previewFile.name}}</div>
                    <el-button :icon="Download" :loading="previewFile.downloadLoading" @click="handleDownload(previewFile)">{{$t('download')}}</el-button>
                </div>
                <Reader ref="ReaderRef" v-bind="previewFile"></Reader>
            </el-card>
        </div>
    </NuxtLayout>
</template>
<script lang="ts" setup>
import { CircleCheckFilled, WarnTriangleFilled } from '@element-plus/icons-vue'
import {
    WorkflowAttachmentDownloadApi,
    getFormPropsApi,
    workflowAttachmentInfoGetApi,
    getDocTypeListApi,
    workflowFormSubmitApi,
    WorkflowAttachmentPreviewApi,
} from 'dp-api'
const route = useRoute()
const router = useRouter()
const state = reactive({
    applyDocumentType: '',
    fileTypes: [],
    errorFileNum: 0,
    loading: false,
    submitLoading: false,
    selectedRow: {},
    selectedRows: [],
    detail: {
        email: '',
        documentId: '',
        submittedDate: ''
    },
    checkAll: false,
    tableData: [],
})
const MetaFormRef = ref({})
// #region module: 1. table and init
    async function getData () {
        state.loading = true
        try {
            const response = await getFormPropsApi({ taskId: route.params.id })
            const index = response.findIndex(item => item.id === 'files')
            if (index !== -1) state.tableData = await revertUploadFile( response[index].value)
            if(state.tableData.length > 0) handleDblclick(state.tableData[0])
            // 从properties获取email,documentId,submittedDate
            getRQDetail(['email','documentId', 'submittedDate'], response)
        } catch (error) {}
        state.loading = false
    }
    function getRQDetail (keys: any[], propsArr: any[]) {
        keys.forEach(key => {
            const index = propsArr.findIndex(item => item.id === key)
            state.detail[key] = propsArr[index].value
        })
    }
    async function revertUploadFile (fileIds: string) {
        const pList = []
        const result = []
        if(!fileIds) return result
        const ids:string[] = fileIds.split(',')
        for (const item of ids) {
            const pItem = workflowAttachmentInfoGetApi(item)
            pList.push(pItem)
        }
        const response = await Promise.all(pList)
        state.errorFileNum = 0
        response.forEach((item) => {
            if(!!item) {
                result.push({
                    id: item.contentId,
                    name: item.name,
                    initName: item.name,
                    approved: true,
                    documentType: 'File' ,
                })
            }
            else state.errorFileNum++
        })
        return result
    }
// #endregion
// #region module: 4. handleSubmit
    const formRef = ref()
    async function handleSubmit () {
        const valid =  await formRef.value.validate()
        const metaValid = await MetaFormRef.value.checkMetaValidate(state.tableData)
        if (!valid || !metaValid) return
        state.submitLoading = true
        try {
            const param = {
                taskId: route.params.id,
                properties: {
                    approved: getParams()
                }
            }
            const res = await workflowFormSubmitApi(param)
            if (!!res) router.push('/fileRequest')
        } catch (error) { }
        state.submitLoading = false
    }
    function getParams () {
        const result = {}
        state.tableData.forEach(item => {
            if (!item.approved) return
            result[item.id] = {
                approved: item.approved,
                documentType: item.documentType,
                properties: { ...item.properties, 'dc:title': getFileName(item.name) }
            }
            console.log('getParams', '???');
        })
        return JSON.stringify(result)

    }
    function getFileName(name) {
        const result = '[' + formatDate(state.detail.submittedDate, 'YYYYMMDD-HHmm')+ ' ' + state.detail.email + ']' + name
        return result
    }
// #endregion

// #region module: 3.1 applyToSelect change
    async function handleDocTypeChange (row) {
        if(MetaFormRef) await MetaFormRef.value.init(row.documentType)
    }
    function handleMetaChange(data) {
        if(!state.loading) state.selectedRow.properties = deepCopy(data.formModel)
    }
    const treeRef = ref()
    function applyToSelect (key:string, value:string, docType?:string) {
        state.selectedRows = treeRef.value.getCheckedNodes()
        state.loading = true
        if (key === 'documentType') {
            state.selectedRows.forEach(async(item) => {
                item.documentType = value
                item.properties = { }
                console.log('applyToSelect', '???');
                
            })
        }
        handleDocTypeChange(state.selectedRow)
        setTimeout(() => {state.loading = false}, 500)
    }
    function handleApply(formModel) {
        state.tableData.forEach(item => {
            if(item.documentType === state.selectedRow.documentType) {
                if(!item.properties) item.properties = {}
                item.properties[formModel.name] = formModel.value
                 console.log('handleApply', '???');
            }
        })
        console.log(state.tableData);
        
    }
// #endregion
// #region module: 2. previewFile
    const previewFile = reactive({
        blob: null,
        name: '',
        id: '',
        loading: false,
        downloadLoading: false,
        options: {
            readOnly: true
        }
    })
    async function handleDblclick (row) {
        getPreview()
        state.loading = true
        state.selectedRow = row
        await handleDocTypeChange(row)
        if(state.selectedRow.properties) await MetaFormRef.value.setData(state.selectedRow.properties)
        setTimeout(() => { state.loading = false }, 1000)
        
        async function getPreview() {
            previewFile.loading = true
            try {
                previewFile.name = row.initName
                previewFile.blob = await WorkflowAttachmentPreviewApi(row.id)
            } catch (error) { }
            previewFile.loading = false
            previewFile.id = row.id
        }
    }
    async function handleDownload (file) {
        file.downloadLoading = true
        const blob = await WorkflowAttachmentDownloadApi(file.id)
        file.downloadLoading = false
        downloadBlob(blob, file.name || file.title, blob.type)
    }
// #endregion
// #region module: 3.2 handleCheckChange
    function handleCheckAll (value: boolean) {
        if(value) treeRef.value.setCheckedKeys(state.tableData.map(item => item.id))
        else treeRef.value.setCheckedKeys([])
    }
    function handleCheckChange() {
        state.selectedRows = treeRef.value.getCheckedNodes()
        if(state.selectedRows.length === state.tableData.length) state.checkAll = true
        else state.checkAll = false
    }
// #endregion
onMounted(async () => {
    getData()
    const res = await getDocTypeListApi()
    state.fileTypes = res.filter((item) => !item.isFolder)
})
</script>
<style lang="scss" scoped>
.pageContainer {
    height: 100%;
    overflow: hidden;
    display: grid;
    grid-template-columns: 300px 1fr 1fr;
    grid-template-rows: min-content 1fr;
    gap: var(--app-padding);
    .left-top { grid-area: 1 / 1 / 2 / 2; }
    .left-bottom {  grid-area: 2 / 1 / 3 / 2;  overflow: auto; }
    .middle-top {  grid-area: 1 / 2 / 2 / 3; padding: 0 12px; }
    .middle-bottom { grid-area: 2 / 2 / 3 / 3; overflow: auto; }
    .right { grid-area: 1 / 3 / 3 / 4; }
}
.tree-item {
    width: 100%;
    &--title {  max-width: 120px; }
    &--right {
        display: flex;
        align-items: center;
        gap: var(--app-input-padding);
    }
    &--documentType { max-width: 100px; }
}
.right :deep(.el-card__body){
    display: grid;
    grid-template-rows: min-content 1fr;
    gap: var(--app-padding);
    height: 100%;
}
:deep(.el-row) { margin: unset !important; }
.el-form { padding: 0 12px; }
</style>
