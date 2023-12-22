<template>
<el-dialog v-model="state.visible" :title="$t('docType_createDocumentType')"
    :close-on-click-modal="false"
    >
    <FromRenderer ref="FromRendererRef" :form-json="formJson" />
    <template #footer>
        <el-button :loading="state.loading" @click="handleSubmit()">{{$t('common_submit')}}</el-button>
    </template>
</el-dialog>
</template>
<script lang="ts" setup>
import { getJsonApi, AddMetaSettingApi, getDocTypeListApi } from 'dp-api'
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
    allDocTypeList: [],
})
const FromRendererRef = ref()
const formJson = getJsonApi('admin/adminAddConfigMeta.json')
async function handleSubmit () {
    const data = await FromRendererRef.value.vFormRenderRef.getFormData()
    state.loading = true
    try {
        const param = {
            documentType: data.type,
            isFolder: getIsFolder(data.type)
        }
        await AddMetaSettingApi(param)
        FromRendererRef.value.vFormRenderRef.resetForm()
        emits('refresh')
        state.visible = false
    } catch (error) {
    }
    state.loading = false
}
function getIsFolder (type: string) {
    try {
        const data = state.allDocTypeList.find(item => item.name === type)
        return data.isFolder
    } catch (error) {
        return false
    }
}
function handleOpen(exitList) {
    state.visible = true
    setTimeout(() => {
        FromRendererRef.value.vFormRenderRef.resetForm()
        handleOptions(exitList)
    })
}
async function handleOptions (exitList) {
    const idRef = FromRendererRef.value.vFormRenderRef.getWidgetRef('type')
    const options = listFilter()
    idRef.loadOptions(options)
    function listFilter() {
        return state.allDocTypeList.reduce((prev, item) => {
            const index = exitList.findIndex(exitItem => exitItem.documentType === item.name)
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
})
defineExpose({ handleOpen })
</script>
<style lang="scss" scoped>

</style>
