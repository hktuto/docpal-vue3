<template>
<el-dialog v-model="state.visible" :title="$t('folderCabinet.newItem')"
    :close-on-click-modal="false"
    >
    <main>
        <div>
            <div>
                <div class="row-expand-top">
                    <span class="color__danger">*</span>
                    {{$t('name')}}
                </div>
                <el-input  class="row-expand-bottom-left" type="text" v-model="state.rootFolder.name"/>
            </div>
            <div v-for="(item, index) in state.rootFolder.metaList" :key="item.metaData+index" class="row-expand">
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
                </template>
            </div>
        </div>
        <FolderCabinetUploadTree ref="FolderCabinetUploadTreeRef"
             :treeData="state.cabinetTemplate.children"></FolderCabinetUploadTree>
    </main>
    <template #footer>
        <el-button :loading="state.loading" @click="handleSubmit">{{$t('common_submit')}}</el-button>
    </template>
</el-dialog>
</template>
<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { metaValidationRuleGetApi, GetCabinetTemplateApi } from 'dp-api'
const emits = defineEmits([
    'refresh'
])
const state = reactive({
    loading: false,
    visible: false,
    rootFolder: {
        metaList: []
    },
    cabinetTemplate: {}
})
const FolderCabinetUploadTreeRef = ref()
async function handleSubmit () {
    // if (!validateForm(state.rootFolder)) return
    FolderCabinetUploadTreeRef.value.checkData()
    FolderCabinetUploadTreeRef.value.getData()
    // const data = await FromRendererRef.value.vFormRenderRef.getFormData()
    state.loading = true
    try {
        // await CreateUserApi(data)
        // state.visible = false
        // FromRendererRef.value.vFormRenderRef.resetForm()
        // emits('refresh')
    } catch (error) {
        
    }
    state.loading = false
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
    console.log(setting);
    state.rootFolder.metaList = await metaValidationRuleGetApi(setting.documentType)
    state.cabinetTemplate = await GetCabinetTemplateApi(setting.id)
    initTreeDataRelativePath(state.cabinetTemplate.children)
}
function initTreeDataRelativePath (children, relativePath: string = '') {
    children.forEach(item => {
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
.row-expand {
    &-top {
        padding: var(--app-padding) 0;
    }
}
</style>
