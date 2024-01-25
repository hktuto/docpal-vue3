<template>
   <div>
        <el-dialog v-model="dialogOpened" append-to-body :title="$t('filePopover_rename')" class="scroll-dialog">
            <el-form ref="formRef" :model="form" label-width="120px" label-position="top" @submit.native.prevent>
                <el-form-item :label="$t('name')" prop="name"
                    :rules="[ { required: true, message: $t('form_common_requird'), trigger: 'change'}]">
                    <el-input v-model="form.name" clearable />
                </el-form-item>
            </el-form>
            
            <template #footer>
                <el-button :loading="state.loading"  @click="handleSave"
                    @keyup.enter="handleSave">{{$t('common_save')}}</el-button>
            </template>
        </el-dialog>
        <!-- -->
  </div>
</template>

<script lang="ts" setup>
import { useEventListener } from '@vueuse/core'
import { patchDocumentApi, GetDocumentAiAnalyzeApi } from 'dp-api'
import {ElMessage} from 'element-plus'
const props = defineProps<{
    doc: any,
    parentPath: string
}>()
const emits = defineEmits(['success'])

const { allowFeature } = useLayout()
const dialogOpened = ref(false)
const formRef = ref()
const form = ref({
    name: '',
    idOrPath: ''
})
const state = reactive({
    doc: {},
    loading: false,
    MetaRenderMode: 'ai-edit'
})
const MetaFormRef = ref()
async function openDialog(detail:any){
    state.doc = detail
    form.value.name = detail.name
    form.value.id = detail.id
    form.value.path = detail.path
    dialogOpened.value = true
    nextTick(async() => {
        const analysis = await GetDocumentAiAnalyzeApi(state.doc.id)
        state.MetaRenderMode = allowFeature('AI_CLASSIFICATION') && analysis.aiId ? 'ai-edit' : 'normal'
        await MetaFormRef.value.init(props.doc.type, {
            aiAnalysis: analysis.metaDatas,
            aiDocId: analysis.aiId
        })
        MetaFormRef.value.setData(props.doc.properties)
    })
}
async function handleSave(){
    state.loading = true
    try {
        
        // check if the name is exist in the folder
        const { isDuplicate } = await duplicateNameFilter(getParentPath(state.doc.path), [form.value]);

        if(isDuplicate && form.value.name !== props.doc.name){
            ElMessage({
                message: $t('dpTip_duplicateFileName') as string,
                type: 'error'
            })
            state.loading = false
            return
        }
        await patchDocumentApi({
            idOrPath: form.value.id,
            name: form.value.name,
        })
        dialogOpened.value = false
        emits('success', state.doc)
    } catch (error) {
        
    }
    state.loading = false
}
useEventListener(document, 'docActionRename', (event) => openDialog(event.detail))  

defineExpose({ openDialog })
</script>