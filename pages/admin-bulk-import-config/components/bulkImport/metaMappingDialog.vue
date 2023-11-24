<template>
<el-dialog v-model="state.visible" :title="state.isEdit ? $t('docType_editDisplayMeta') : $t('docType_addDisplayMeta')"
    :close-on-click-modal="false"
    >
    <FromRenderer ref="FromRendererRef" :form-json="formJson" />
    <template #footer>
        <el-button :loading="state.loading" @click="handleSubmit()">{{$t('common_submit')}}</el-button>
    </template>
</el-dialog>
</template>
<script lang="ts" setup>
import { getJsonApi, SaveMetadataMappingApi, getDocTypeListApi } from 'dp-api'
const props = defineProps<{
    metaMapping: object,
}>()
const emits = defineEmits([
    'refresh'
])
const route = useRoute()
const user = useUser();
const state = reactive({
    loading: false,
    visible: false,
    docType: {},
    allDocTypeList: [],
    isEdit: false
})
const FromRendererRef = ref()
const formJson = getJsonApi('admin/adminMetaMapping.json')
async function handleSubmit () {
    const data = await FromRendererRef.value.vFormRenderRef.getFormData()
    state.loading = true
    try {
        const param = {
            name: state.docType.name,
            metaDataMapper: {
                ...props.metaMapping.metaDataMapper,
                [data.metaData]: data.label
            }
        }
        await SaveMetadataMappingApi({documentType: [param]})
        state.visible = false
        FromRendererRef.value.vFormRenderRef.resetForm()
        emits('refresh')
    } catch (error) {
    }
    state.loading = false
}
function handleOpen(exitList, data) {
    state.visible = true
    setTimeout(() => {
        FromRendererRef.value.vFormRenderRef.resetForm()
        handleOptions(exitList)
        if (!!data) {
            data.isEdit = true
            FromRendererRef.value.vFormRenderRef.setFormData(data)
            state.isEdit = true
        } else {
            state.isEdit = false
        }
    })
}
async function handleOptions (exitList) {
    const idRef = FromRendererRef.value.vFormRenderRef.getWidgetRef('metaData')
    const options = listFilter()
    idRef.loadOptions(options)
    function listFilter() {
        return state.docType.keywords.reduce((prev, item) => {
            const index = exitList.findIndex(exitItem => exitItem.metaData === item.name)
            if (index === -1) {
                item.value = item.name
                item.label = $t(item.name)
                prev.push(item)
            }
            return prev
        }, []);
    }
}
onMounted(async() => {
    state.allDocTypeList = await getDocTypeListApi()
    state.docType = state.allDocTypeList.find(item => item.name === route.params.id)
})
defineExpose({ handleOpen })
</script>
<style lang="scss" scoped>

</style>
