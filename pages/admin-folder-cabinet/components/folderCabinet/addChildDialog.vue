<template>
<el-dialog v-model="state.visible" :title="$t('folderCabinet.create')"
    :close-on-click-modal="false"
    >
    <FromRenderer ref="FromRendererRef" :form-json="formJson" />
    <template #footer>
        <el-button type="primary" :loading="state.loading" @click="handleSubmit">{{$t('common_submit')}}</el-button>
    </template>
</el-dialog>
</template>
<script lang="ts" setup>
import { getJsonApi, CreateCabinetTemplateApi, PatchCabinetTemplateApi } from 'dp-api'
const emits = defineEmits([
    'update'
])
const state = reactive({
    loading: false,
    visible: false,
    setting: null
})
const FromRendererRef = ref()
const formJson = getJsonApi('admin/folderCabinetChild.json')

async function handleSubmit() {
    const data = await FromRendererRef.value.vFormRenderRef.getFormData()
    try {
        const params = {
            ...data,
        }
        if(params.folder) delete params.multiple
        else delete params.allow
        state.loading = true
        if (params.isEdit) {
            params.id = state.setting.id
            delete params.documentType
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
function handleOpen(setting) {
    state.visible = true
    state.setting = setting
    
    setTimeout(async () => {
        if(setting.isEdit) {
            await FromRendererRef.value.vFormRenderRef.setFormData(setting)
        } else {
            await FromRendererRef.value.vFormRenderRef.resetForm()
        }
    })
}

defineExpose({ handleOpen })
</script>
<style lang="scss" scoped>

</style>
