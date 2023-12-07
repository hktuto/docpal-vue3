<template>
    <el-dialog class="scroll-dialog" v-model="state.dialogOpened" append-to-body 
                :close-on-click-modal="false">
        <template #title>
            <strong class="primaryTitle">{{ $t('filePopover_uploadFile') }}</strong>
            {{ 'in ' + state.setting.documentPath }}
        </template>
        <BrowseActionsReplaceUpload v-model="state.fileList" :limit="1"></BrowseActionsReplaceUpload>
        <MetaRenderForm ref="MetaFormRef"></MetaRenderForm>
        <template #footer>
            <el-button :loading="state.loading" type="primary" @click="handleSubmit">{{$t('submit')}}</el-button>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { CreateDocumentApi } from 'dp-api'

const emits = defineEmits(['success'])
const state = reactive({
    loading: false,
    dialogOpened: false,
    setting: {},
    fileList: []
})
const MetaFormRef = ref()
function handleOpen(setting:any){
    state.dialogOpened = true
    state.setting = deepCopy(setting) 
    state.fileList = []
    nextTick(async() => {
        await MetaFormRef.value.init(state.setting.documentType)
    })
}
async function handleSubmit () {
    try {
        const metaFormData = await MetaFormRef.value.getData()
        if(!metaFormData) return
        if(!state.fileList || state.fileList.length === 0) {
            throw new Error("msg_fileFetchFailed");
        }
        const file = state.fileList[0]
        state.loading = true
        const { isDuplicate } = await duplicateNameFilter(state.setting.documentPath, [{ name: file.name }]);
        if(isDuplicate){
            throw new Error("dpTip_duplicateFileName");
        }
        const document = {
            name: file.name,
            idOrPath: state.setting.documentPath + '/' + file.name,
            properties: metaFormData,
            type: state.setting.documentType,
        }
    
        const formData = new FormData()
        formData.append('files', file.raw)
        formData.append('document', JSON.stringify(document))
        const res = await CreateDocumentApi(formData)
        emits('success', document)
        state.dialogOpened = false
        state.loading = false
    } catch (error) {
        if(error.message) {
            ElMessage({
                message: $t(error.message) as string,
                type: 'error'
            })
        }
        state.loading = false
    }
    state.loading = false
}
onMounted(() => {
})
defineExpose({ handleOpen })
</script>