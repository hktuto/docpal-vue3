<template>
<el-dialog v-model="state.visible" :title="state.title"
    :close-on-click-modal="false" append-to-body
    >
    <FromRenderer ref="FromRendererRef" :form-json="formJson" />
    <template #footer>
        <el-button type="primary" :loading="state.loading" @click="handleSubmit">{{$t('common_submit')}}</el-button>
    </template>
</el-dialog>
</template>
<script lang="ts" setup>
import { getJsonApi, CreateCabinetTemplateApi, PatchCabinetTemplateApi, PatchGroupApi } from 'dp-api'
const emits = defineEmits([
    'update'
])
const state = reactive({
    loading: false,
    visible: false,
    setting: null,
    isFolder: false,
    title: $t('folderCabinet.addFolder')
})
const FromRendererRef = ref()
const formJson = getJsonApi('admin/folderCabinetChild.json')

async function handleSubmit() {
    try {
        const data = await FromRendererRef.value.vFormRenderRef.getFormData()
        const params = {
            ...data,
        }
        if(params.folder) delete params.multiple
        else delete params.allow
        state.loading = true
        if (params.isEdit) {
            params.id = state.setting.id
            await PatchCabinetTemplateApi(params)
        } else {
            params.parentId = state.setting.id
            await CreateCabinetTemplateApi(params)
        }
        FromRendererRef.value.vFormRenderRef.resetForm()
        state.visible = false
        emits('update')
    } catch (error) {
    }
    state.loading = false
}
function handleOpen(setting, children, isFolder) {
    state.visible = true
    state.setting = setting
    state.isFolder = isFolder
    setTimeout(async () => {
        if(children) {
            const interval = setInterval(() => {
                const documentTypeRef = FromRendererRef.value.vFormRenderRef.getWidgetRef('documentType')
                const listName = isFolder ? 'folderList' : 'fileList'
                const options = FromRendererRef.value.vFormRenderRef.optionData[listName] 
                if(options.length !== 0) {
                    clearInterval(interval)
                    options.forEach(oItem => { 
                        const index = children.findIndex(cItem => cItem.documentType === oItem.value)
                        oItem.disabled = index !== -1
                    });
                    documentTypeRef.loadOptions(options)
                }
            }, 1000)
        }
        if(setting.isEdit) {
            await FromRendererRef.value.vFormRenderRef.resetForm()
            await FromRendererRef.value.vFormRenderRef.setFormData(setting)
            state.title = isFolder ? $t('folderCabinet.editFolder') : $t('folderCabinet.editFile')
        } else {
            await FromRendererRef.value.vFormRenderRef.resetForm()
            await FromRendererRef.value.vFormRenderRef.setFormData({ folder: isFolder })
            state.title = isFolder ? $t('folderCabinet.addFolder') : $t('folderCabinet.addFile')
        }
    })
}

defineExpose({ handleOpen })
</script>
<style lang="scss" scoped>

</style>
