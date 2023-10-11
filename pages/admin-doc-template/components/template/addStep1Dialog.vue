<template>
<el-dialog 
    class="scroll-dialog"
    v-model="state.visible" :title="state.isEdit ? $t('template.editInfo') : $t('template.create')"
    :close-on-click-modal="false" append-to-body
    >
    <FromRenderer ref="FromRendererRef" :form-json="formJson">
    </FromRenderer>
    <template #footer>
        <!-- <el-button @click="createFile('Excel', 'test')"></el-button> -->
        <el-button type="primary" :loading="state.loading" @click="handleSubmit">{{$t('common_submit')}}</el-button>
    </template>
</el-dialog>
<TemplateAddStep2Dialog ref="TemplateAddStep2DialogRef"/>
</template>
<script lang="ts" setup>
import { getJsonApi, CreateTemplateInfoApi, UpdateTemplateInfoApi } from 'dp-api'
const emits = defineEmits([
    'update'
])
const state = reactive({
    loading: false,
    visible: false,
    setting: {},
    isEdit: false
})
const router = useRouter()
const form = reactive({
    labelRule: []
})
const FromRendererRef = ref()
const formJson = getJsonApi('admin/templateAddStep1.json')
const TemplateAddStep2DialogRef = ref()
async function handleSubmit() {
    const formData = await FromRendererRef.value.vFormRenderRef.getFormData()
    if(!formData) return
    try {
        state.loading = true
        if(state.isEdit) {
            await UpdateTemplateInfoApi({
                name: formData.name,
                description: formData.description,
                id: state.setting.id,
                fileType: state.setting.fileType
            })
        }
        else {
            const file = await createFile(formData.type, formData.name)
            const params = new FormData()
            params.append('file', file)
            params.append('name', formData.name)
            params.append('fileType', formData.type)
            params.append('description', formData.description)
            const templateInfo = await CreateTemplateInfoApi(params)
            console.log(templateInfo);
            TemplateAddStep2DialogRef.value.handleOpen(templateInfo)
        }
        state.visible = false
        emits('update')
    } catch (error) {
    }
    state.loading = false
}

async function handleOpen(setting?) {
    state.visible = true
    setTimeout(async() => {
        await FromRendererRef.value.vFormRenderRef.resetForm()
        if(setting && setting.isEdit) {
            state.isEdit = true
            state.setting = setting
            await FromRendererRef.value.vFormRenderRef.setFormData({...state.setting})
            state.loading = false
        } else {
            state.isEdit = false
            state.setting = {}
        }
    })
}
async function createFile(fileType: 'Word' | 'Excel' | 'PPT' | 'PDF', name: string) {
    const path = `/docTemplate/template${ExtensionMap[fileType]}`
    const file = await fetch(path)
    const fileArrayBuffer = await file.arrayBuffer()
    return new File([fileArrayBuffer], `${name}${ExtensionMap[fileType]}`,{type: ExtensionMimeTypeMap[fileType]})
}
defineExpose({ handleOpen })
</script>
<style lang="scss" scoped>

</style>
