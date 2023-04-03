<template>
    <NuxtLayout class="fit-height withPadding" backPath="/fileRequest">
        <div class="container">
            <div class="left-top-left">
                <el-select v-model="documentType" filterable default-first-option >
                    <el-option v-for="item in fileTypes" :key="item.name" :value="item.name" :label="item.name"></el-option>
                </el-select>
                <el-button @click="applyToSelect('documentType', documentType)">{{$t('dpButtom_apply')}}</el-button>
            </div>
            <div class="left-top-right">
                <el-button @click="handleSubmit">{{$t('submit')}}</el-button>
            </div>
            <div class="left-bottom">
                <Table :columns="tableSetting.columns"
                        :table-data="tableData"
                        :options="options"
                        v-loading="loading"
                        @row-dblclick="handleDblclick"
                        @expand-change="handleExpand"
                        @selection-change="handleSelectionChange">
                    <template #expand="{ row }">
                        <div class="row-expand">
                            <div class="row-expand-top">
                                <span class="color__danger">*</span>
                                {{$t('dpDocument_fileName')}}
                            </div>
                            <el-input class="row-expand-bottom-left" type="text" v-model="row.name" />
                            <div class="row-expand-bottom-right"></div>
                        </div>
                        <div v-for="(item, index) in row.metaList" :key="item.metaData+index" class="row-expand">
                            <template v-if="item.display">
                                <div class="row-expand-top">
                                    <span class="color__danger" v-if="item.isRequire">*</span>
                                    {{item.metaData}}
                                </div>
                                <template v-if="item.dataType === 'date'">
                                    <el-date-picker v-model="item.value"
                                            type="datetime"
                                            :placeholder="$t('dpTip_datePicker')"
                                            :default-time="defaultTime"
                                            value-format="YYYY-MM-DDTHH:mm:ss.000Z"
                                            class="row-expand-bottom-left"
                                            style="width: 100%"></el-date-picker>
                                </template>
                                <template v-else-if="!!item.directoryEntries">
                                    <el-cascader v-model="item.value"
                                            :options="item.directoryEntries"
                                            :props="{ checkStrictly: item.hasChild, value: 'id', label: 'id' }"
                                            clearable filterable popper-class="pc-cascader"
                                            class="row-expand-bottom-left"
                                            style="width: 100%"></el-cascader>
                                </template>
                                <template v-else>
                                    <el-input  class="row-expand-bottom-left" type="text" v-model="item.value"
                                        :maxlength="item.length" show-word-limit/>
                                </template>
                                <el-button class="row-expand-bottom-right" @click="applyToSelect(item.metaData,item.value, item.documentType)">{{$t('dpButtom_apply')}}</el-button>
                            </template>
                        </div>
                    </template>
                    <template #documentType="{ row }">
                        <el-select v-model="row.documentType" filterable default-first-option
                            @change="handleDocTypeChange(row)">
                            <el-option v-for="item in fileTypes" :key="item.name" :value="item.name" :label="item.name"></el-option>
                        </el-select>
                    </template>
                    <template #approve="{ row }">
                        <el-checkbox v-model="row.approved"></el-checkbox>
                    </template>
                </Table>
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
import { useI18n } from "vue-i18n";
import { ElMessage, ElMessageBox } from 'element-plus'
import { RefreshLeft, Delete } from '@element-plus/icons-vue'
import { 
    WorkflowAttachmentDownloadApi,
    getFormPropsApi, 
    workflowAttachmentInfoGetApi, 
    getDocTypeListApi,
    metaValidationRuleGetApi,
    workflowFormSubmitApi,
    WorkflowAttachmentPreviewApi,
    TABLE, defaultTableSetting } from 'dp-api'
const { t } = useI18n();
const route = useRoute()
const state = reactive({
    curReaderType: '',
    documentType: '',
    fileTypes: [],
    errorFileNum: 0,
    loading: false,
    defaultTime: new Date(2000, 1, 1, 23, 59, 59),
    options: {
        expandedRowKeys: [],
        rowKey: 'id'
    },
    selectedRow: [],
    detail: {
        email: '',
        documentId: '',
        submittedDate: ''
    }
})
// #region module: table
    const tableKey = TABLE.CLIENT_FILE_REQUEST_AUDIT
    const tableSetting = defaultTableSetting[tableKey]
    const tableData = ref([])
    async function getData () {
        let result = []
        state.loading = true
        const response = await getFormPropsApi({ taskId: route.params.id })
        const index = response.findIndex(item => item.id === 'files')
        if (index !== -1) tableData.value = await revertUploadFile( response[index].value)
        if(tableData.value.length > 0) handleDblclick(tableData.value[0])
        state.loading = false
        getRQDetail(['email','documentId', 'submittedDate'], response)
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
        const fileMetaList = await metaListGet('File')
        state.errorFileNum = 0
        response.forEach((item) => {
          if(!!item) {
            result.push({
              id: item.contentId,
              name: item.name,
              initName: item.name,
              approved: true,
              documentType: 'File' ,
              metaList: deepCopy(fileMetaList),
            })
          }
          else state.errorFileNum++
        })
        return result
    }
    function refreshTable () {
      tableData.value = tableData.value.reduce((prev, doc) => {
        prev.push({...doc, metaList: deepCopy(doc.metaList)})
        return prev
      }, [])
    }
    async function metaListGet(documentType: string) {
        const res = await metaValidationRuleGetApi(documentType)
        if(!res) return []
        res.forEach(item => {
            if (item.directoryEntries) {
                item.directoryEntries = handleChildOptions(item.directoryEntries)
                item.value = []
            }
            else item.value = ''
        })
        return res
    }
    function handleChildOptions (list = []) {
        const result = []
        const keyNodes = {}

        const nodeList = list.map(node => {
            const clone = { ...node }
            keyNodes[clone.id] = clone;
            return clone;
        })
        nodeList.forEach(node => {
            const parentItem = keyNodes[node.properties.parent];
            if (parentItem) {
                parentItem.hasChild = true
                if (!parentItem.children) parentItem.children = []
                parentItem.children.push(node)
            }
            else result.push(node)
        })
        return result
    }
    async function handleSubmit () {
        if(!validateForm()) return
        if (await checkDuplicate()) return
        handleSubmitData(getParams())
    }
    async function handleSubmitData (propertiesJson) {
        loading.value = true
        const param = {
            taskId: route.params.id,
            properties: {
                approved: propertiesJson
            }
        }
        const res = await workflowFormSubmitApi(param)
        loading.value = false
        if (!!res) router.push('/fileRequest')
    }
    function getParams () {
        const result = {}
        tableData.value.forEach(item => {
            if (!item.approved) return
            const metas = item.metaList.reduce((prev,metaItem) => {
                if(metaItem.value) prev[metaItem.metaData] = metaItem.value
                return prev
            }, {})
            result[item.id] = {
                approved: item.approved,
                documentType: item.documentType,
                properties: { ...metas, 'dc:title': getFileName(item.name) }
            }
        })
        return JSON.stringify(result)
        function getFileName(name) {
            const result = '[' + formatDate(state.detail.submittedDate, 'YYYYMMDD-HHmm')+ ' ' + state.detail.email + ']' + name
            return result
        }
      }
    function validateForm () {
        let msg = ''
        for (const item of tableData.value) {
            if (!item.name) msg += `${item.initName}: ${t('common_canNotEmpty')}<br/>`
            if(!item.metaList || item.metaList.length === 0) return msg.length === 0
            item.metaList.forEach(metaItem => {
                if (!metaItem.display) return
                if (metaItem.isRequire && !metaItem.value) msg += `${item.initName}[${metaItem.metaData}]: ${t('common_canNotEmpty')}<br/>`
            })
        }
        if (msg.length > 0) {
            ElMessageBox.alert(msg, t('dpTip_warning'), {
                dangerouslyUseHTMLString: true,
                confirmButtonText: t('dpButtom_confirm'),
            })
        }
        
        return msg.length === 0
      }
// #endregion
// #region module: table 辅助,数据改变后,table会重新渲染导致关闭展开行
    function handleExpand (row: any, expandRows: any) {
        const result = expandRows.reduce((prev, item) => {
            prev.push(item.id)
            return prev
        }, [])
        state.options.expandedRowKeys = result
    }
// #endregion

// #region module: applyToSelect
    function handleSelectionChange (rows) {
        state.selectedRow = rows
    }
    async function handleDocTypeChange (row) {
        const metaList =  await metaListGet(row.documentType)
        row.metaList = deepCopy(metaList)
    }
    function applyToSelect (key:string, value:string, docType?:string) {
        state.loading = true
        if (key === 'documentType') {
            state.selectedRow.forEach(async(item) => {
                const metaList =  await metaListGet(value)
                item.documentType = value
                item.metaList = deepCopy(metaList)
            })
        } else {
            tableData.value.forEach((item) => {
                if (item.documentType === docType) {
                    const index = item.metaList.findIndex(metaItem => metaItem.metaData === key)
                    if (index !== -1) item.metaList[index].value = value
                }
            })
        }
        setTimeout(() => {state.loading = false}, 500)
    }
// #endregion
// #region module: checkDuplicate
    async function checkDuplicate () {
        return false
    }
// #endregion
const previewFile = reactive({
    blob: null,
    name: '',
    id: '',
    loading: false,
    downloadLoading: false
})
async function handleDblclick (row) {
    previewFile.loading = true
    try {
        previewFile.blob = await WorkflowAttachmentPreviewApi(row.id)
    } catch (error) {
        
    }
    previewFile.loading = false
    previewFile.id = row.id
    previewFile.name = row.initName
}
async function handleDownload (file) {
    file.downloadLoading = true
    const blob = await WorkflowAttachmentDownloadApi(file.id)
    setTimeout(() => { 
        file.downloadLoading = false
        downloadBlob(blob, file.name || file.title, blob.type)
    }, 500)
}
const { documentType, fileTypes, loading, defaultTime, options } = toRefs(state)
onMounted(async () => {
    getData()
    const res = await getDocTypeListApi()
    state.fileTypes = res.filter((item) => !item.isFolder)
    
})
</script>

<style lang="scss" scoped>
.container {
    height: 100%;
    display: grid;
    grid-template-columns: 1fr min-content 1fr;
    grid-template-rows: min-content 1fr;
    grid-column-gap: var(--app-padding);
    grid-row-gap: var(--app-padding);
    .left-top-left { grid-area: 1 / 1 / 2 / 2; display: flex; align-items: center; }
    .left-top-right { grid-area: 1 / 2 / 2 / 3; }
    .left-bottom { grid-area: 2 / 1 / 3 / 3;     overflow: hidden; }
    .right { grid-area: 1 / 3 / 3 / 4; }
}
.row-expand {
    padding: 0 var(--app-padding) 0 calc(var(--app-padding) * 5);
    display: grid;
    grid-template-columns: 1fr min-content;
    grid-template-rows: min-content min-content;
    grid-column-gap: var(--app-padding);
    &-top {
        padding: var(--app-padding) 0;
        grid-area: 1 / 1 / 2 / 3;
    }
    &-bottom-left { grid-area: 2 / 1 / 3 / 2; }
    &-bottom-right {
        grid-area: 2 / 2 / 3 / 3;
        min-width: 1px;
    }
}
.right :deep(.el-card__body){
    display: grid;
    grid-template-rows: min-content 1fr;
    gap: var(--app-padding);
}
</style>