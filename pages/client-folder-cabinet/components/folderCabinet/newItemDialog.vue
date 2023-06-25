<template>
<el-dialog v-model="state.visible" :title="$t('folderCabinet.newItem')"
    :close-on-click-modal="false"
    >
    <main>
        <div>
            <div>
                <div class="row-item-top">
                    <span class="color__danger">*</span>
                    {{$t('name')}}
                </div>
                <el-input  class="row-item-bottom-left" type="text" v-model="state.rootFolder.name"/>
            </div>
            <div v-for="(item, index) in state.rootFolder.metaList" :key="item.metaData+index" class="row-item">
                <template v-if="item.display">
                    <div class="row-item-top">
                        <span class="color__danger" v-if="item.isRequire">*</span>
                        {{item.metaData}}
                    </div>
                    <template v-if="item.dataType === 'date'">
                        <el-date-picker v-model="item.value"
                                type="datetime"
                                :placeholder="$t('dpTip_datePicker')"
                                :default-time="defaultTime"
                                value-format="YYYY-MM-DDTHH:mm:ss.000Z"
                                class="row-item-bottom-left"
                                style="width: 100%"></el-date-picker>
                    </template>
                    <template v-else-if="!!item.directoryEntries">
                        <el-cascader v-model="item.value"
                                :options="item.directoryEntries"
                                :props="{ checkStrictly: item.hasChild, value: 'id', label: 'id' }"
                                clearable filterable popper-class="pc-cascader"
                                class="row-item-bottom-left"
                                style="width: 100%"></el-cascader>
                    </template>
                    <template v-else>
                        <el-input  class="row-item-bottom-left" type="text" v-model="item.value"
                            :maxlength="item.length" show-word-limit/>
                    </template>
                </template>
            </div>
        </div>
        <FolderCabinetUploadTree ref="FolderCabinetUploadTreeRef"
             :treeData="state.treeData"
             v-loading="state.treeLoading"></FolderCabinetUploadTree>
    </main>
    <template #footer>
        <el-button :loading="state.loading" @click="handleSubmit">{{$t('common_submit')}}</el-button>
    </template>
</el-dialog>
</template>
<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
    metaValidationRuleGetApi, 
    GetCabinetTemplateApi,
    GetDocDetail,
    CreateFoldersApi,
    CreateDocumentApi } from 'dp-api'
const emits = defineEmits([
    'refresh'
])
const state = reactive({
    loading: false,
    treeLoading: false,
    visible: false,
    rootFolder: {
        name: '',
        metaList: []
    },
    cabinetTemplate: {},
    treeData: [],
    rootDetail: {}
})
const FolderCabinetUploadTreeRef = ref()
async function handleSubmit () {
    if (!validateForm(state.rootFolder)) return
    state.loading = true
    try {
        const idOrPath = `${state.cabinetTemplate.rootPath}/${state.rootFolder.name}`
        // 上传最上层数据
        await CreateFoldersApi({
            name: state.rootFolder.name,
            type: state.cabinetTemplate.documentType,
            idOrPath,
            properties: getProperties(state.rootFolder.metaList)
        })
        const uploadList = FolderCabinetUploadTreeRef.value.getData()
        
        for (let index = 0; index < uploadList.length; index++) {
            const params = uploadList[index];
            if(params.document) {
                params.document.idOrPath = `${idOrPath}${params.document.idOrPath}/${params.document.name}`
                const formData = new FormData()
                formData.append('files', params.files)
                formData.append('document', JSON.stringify(params.document))
                await CreateDocumentApi(formData)
            } else {
                params.idOrPath = `${idOrPath}${params.idOrPath}/${params.name}`
                await CreateFoldersApi(params)
            }
        }
        state.visible = false
        setTimeout(()=> {
            emits('refresh')
        }, 500)
    } catch (error) {
        
    }
    state.loading = false
}
function getProperties(metaList) {
    return metaList.reduce((prev, item) => {
        prev[item.metaData] = item.value
        return prev
    }, {})
}
function validateForm (rootFolder) {
    let msg = ''
    if (!rootFolder.metaList) return
    if (!rootFolder.name)  msg += `[${$i18n.t('name')}]: ${$i18n.t('common_canNotEmpty')}<br/>`
    rootFolder.metaList.forEach(metaItem => {
        if (!metaItem.display) return
        if (metaItem.isRequire && !metaItem.value) msg += `[${metaItem.metaData}]: ${$i18n.t('common_canNotEmpty')}<br/>`
    })
  
    if (msg.length > 0) {
        ElMessageBox.confirm(msg, $i18n.t('dpTip_warning'), {
            dangerouslyUseHTMLString: true,
            confirmButtonText: $i18n.t('dpButtom_confirm'),
        })
    }
  
  return msg.length === 0
}
async function handleOpen(setting) {
    state.visible = true
    getMetaList(setting)
    state.treeLoading = true
    try {
        state.cabinetTemplate = await GetCabinetTemplateApi(setting.id)
        initTreeDataRelativePath(state.cabinetTemplate.children)
        state.treeData = state.cabinetTemplate.children

        const rootDetail = await GetDocDetail(state.cabinetTemplate.rootId, false)
        state.cabinetTemplate.rootPath = rootDetail.path
    } catch (error) {
        
    }
    state.treeLoading = false
}
async function getMetaList (setting) {
    state.rootFolder.name = ''
    state.rootFolder.metaList = []
    state.rootFolder.metaList = await metaValidationRuleGetApi(setting.documentType)
}
function initTreeDataRelativePath (children, relativePath: string = '') {
    children.forEach(item => {
        item.isLack = false
        item.relativePath = relativePath
        if (item.children) initTreeDataRelativePath(item.children, relativePath + '/' + item.label)
        else item.children = []
    })
}
onMounted(async() => {
})
defineExpose({ handleOpen })
</script>
<style lang="scss" scoped>
main {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--app-padding);
}
.row-item {
    &-top {
        padding: var(--app-padding) 0;
    }
}
</style>
