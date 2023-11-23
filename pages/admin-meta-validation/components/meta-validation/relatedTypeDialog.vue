<template>
<el-dialog v-model="state.visible" :title="state.isEdit ? $t('docType_editRelatedMeta') : $t('docType_addRelatedMeta')"
    :close-on-click-modal="false"
    >
    <FromRenderer ref="FromRendererRef" :form-json="formJson" />
    <template #footer>
        <el-button :loading="state.loading" @click="handleSubmit()">{{$t('common_submit')}}</el-button>
    </template>
</el-dialog>
</template>
<script lang="ts" setup>
import { getJsonApi, CreateMetadataRelatedApi, UpdateMetadataRelatedApi, getDocTypeListApi } from 'dp-api'
const props = defineProps<{
    docType: object,
}>()
const emits = defineEmits([
    'refresh'
])
const route = useRoute()
const user = useUser();
const state = reactive({
    loading: false,
    visible: false,
    allDocTypeList: [],
    isEdit: false,
    setting: {}
})
const FromRendererRef = ref()
const formJson = getJsonApi('admin/adminMetaRelated.json')
async function handleSubmit () {
    const data = await FromRendererRef.value.vFormRenderRef.getFormData()
    state.loading = true
    delete data.isEdit
    try {
        if(state.isEdit) {
            await UpdateMetadataRelatedApi({...data, rootDocumentType: props.docType.name, id: state.setting.id })
        } else {
            await CreateMetadataRelatedApi({ ...data, rootDocumentType: props.docType.name })
        }
        state.visible = false
        FromRendererRef.value.vFormRenderRef.resetForm()
        emits('refresh')
    } catch (error) {
    }
    state.loading = false
}
function handleOpen(exitList, data) {
    if(!exitList) exitList = []
    state.visible = true
    setTimeout(() => {
        FromRendererRef.value.vFormRenderRef.resetForm()
        handleOptions(exitList)
        if (!!data) {
            FromRendererRef.value.vFormRenderRef.setFormData({...data, isEdit: true})
            state.isEdit = true
            state.setting = data
        } else {
            state.isEdit = false
            state.setting = {}
        }
    })
}
async function handleOptions (exitList) {
    const idRef = FromRendererRef.value.vFormRenderRef.getWidgetRef('documentType')
    FromRendererRef.value.vFormRenderRef.optionData.allTypeList = state.allDocTypeList
    const options = listFilter()
    idRef.loadOptions(options)
    function listFilter() {
        return state.allDocTypeList.reduce((prev, item) => {
            const index = exitList.findIndex(exitItem => exitItem.type === item.name)
            if (index === -1) {
                item.value = item.name
                item.label = item.name
                prev.push(item)
            }
            return prev
        }, []);
    }
}
onMounted(async() => {
    state.allDocTypeList = await getDocTypeListApi()
})
defineExpose({ handleOpen })
</script>
<style lang="scss" scoped>

</style>
