<template>
<el-dialog v-model="state.visible" class="scroll-dialog replace-dialog" :title="$t('replaceFile')"
    :close-on-click-modal="false" append-to-body
    >
    <el-form ref="formRef" :model="form"  label-position="top" @submit.native.prevent>
        <el-form-item :label="$t('common_file')" prop="targetFile"
                :rules="[{ required: true, message: $t('form_common_requird')}]">
                <BrowseActionsReplaceUpload v-model="form.fileList" :limit="1"></BrowseActionsReplaceUpload>
        </el-form-item>
        <el-checkbox v-model="form.openAiAnalyzeMetadata">{{ $t('ai.checkAI') }}</el-checkbox>
        <el-form-item :label="$t('filePopover_OCRLanguages')" prop="targetFile">
            <el-select v-model="form.languages" :multiple-limit="2" multiple placeholder="N/A">
                <el-option  v-for="l in availableLanguage"
                        :key="l" :value="l" :label="$t(`languages.${l}`)"></el-option>
            </el-select>
        </el-form-item>
    </el-form>
    <template #footer>
        <el-button style="width: 100%" type="primary" :loading="state.loading" @click="handleConfirm">{{$t('common_submit')}}</el-button>
    </template>
</el-dialog>
</template>
<script lang="ts" setup>
import { getOcrSupportedLanguage, ReplaceFileAiDocumentApi } from 'dp-api'
const emits = defineEmits([
    'update'
])
const state = reactive({
    loading: false,
    visible: false,
    doc: {}
})
const form = ref<any>({
    fileList: [],
    languages: ['eng'],
    openAiAnalyzeMetadata: true
})
const formRef = ref()
const availableLanguage = ref()

async function handleConfirm () {
    return
    if (form.value.fileList.length === 0) {
        state.visible = false
        return
    }
    const d = {
        idOrPath: state.doc.id,
        languages: form.value.languages
    }
    const formData = new FormData()
    formData.append('file', form.value.fileList[0].blob)
    formData.append('document', JSON.stringify(d))
    formData.append('openAiAnalyzeMetadata', form.value.openAiAnalyzeMetadata)
    state.loading = true
    try {
        const res = await ReplaceFileAiDocumentApi(formData)
        state.visible = false
        form.value = {
            fileList: [],
            languages: []
        }
        emits('update')
    } catch (error) {
        
    }
    state.loading = false
}
function handleOpen(doc) {
    state.visible = true
    state.doc = doc
}
onMounted(async() => {
    availableLanguage.value = await getOcrSupportedLanguage()
})
defineExpose({ handleOpen })
</script>
<style lang="scss">
.replace-dialog {
    width: 400px!important;
}
.upload-demo {
    width: 100%
}
</style>
