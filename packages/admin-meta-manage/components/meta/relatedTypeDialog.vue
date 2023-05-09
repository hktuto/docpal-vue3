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
import { getJsonApi, SetRelatedTypeApi, getDocTypeListApi } from 'dp-api'
const props = defineProps<{
    group: object,
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
const formJson = getJsonApi('adminMetaRelated.json')
async function handleSubmit () {
    const data = await FromRendererRef.value.vFormRenderRef.getFormData()
    state.loading = true
    await SetRelatedTypeApi(data, state.docType.name)
    state.loading = false
    state.visible = false
    FromRendererRef.value.vFormRenderRef.resetForm()
    emits('refresh')
}
function handleOpen(exitList, data) {
    state.visible = true
    setTimeout(() => {
        FromRendererRef.value.vFormRenderRef.resetForm()
        handleOptions(exitList)
        if (!!data) {
            FromRendererRef.value.vFormRenderRef.setFormData({...data, isEdit: true})
            state.isEdit = true
        } else {
            state.isEdit = false
        }
    })
}
async function handleOptions (exitList) {
    const idRef = FromRendererRef.value.vFormRenderRef.getWidgetRef('type')
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
    state.docType = state.allDocTypeList.find(item => item.name === route.params.id)
})
defineExpose({ handleOpen })
</script>
<style lang="scss" scoped>

</style>
