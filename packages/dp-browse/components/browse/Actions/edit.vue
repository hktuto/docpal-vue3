<template>
   <div>
     <BrowseActionsButton id="editActionButton" :label="$t('tip.editDocDetail')" @click="openDialog">
        <el-tooltip :content="$t('tip.editDocDetail')">
            <SvgIcon src="/icons/file/edit.svg" round :label="$t('tip.editDocDetail')"
                ></SvgIcon> 
        </el-tooltip>
     </BrowseActionsButton>
        <el-dialog v-model="dialogOpened" append-to-body :title="$t('tip.editDocDetail')" class="scroll-dialog">
            <el-form ref="formRef" :model="form" label-width="120px" label-position="top" @submit.native.prevent>
                <el-form-item :label="$t('name')" prop="name"
                    :rules="[ { required: true, message: $t('form_common_requird'), trigger: 'change'}]">
                    <el-input v-model="form.name" clearable />
                </el-form-item>
            </el-form>
            
            <MetaRenderForm ref="MetaFormRef" :mode="state.MetaRenderMode"></MetaRenderForm>
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
async function openDialog(){
    state.doc = props.doc
    form.value.name = props.doc.name
    form.value.id = props.doc.id
    form.value.path = props.doc.path
    dialogOpened.value = true
    nextTick(async() => {
        const analysis = await GetDocumentAiAnalyzeApi(state.doc.id)
        state.MetaRenderMode = analysis.aiId ? 'ai-edit' : 'normal'
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
        const metaFormData = await MetaFormRef.value.getData()
        if(!metaFormData) {
            state.loading = false
            return
        }
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
            properties: metaFormData,
        })
        dialogOpened.value = false
        emits('success', state.doc)
    } catch (error) {
        
    }
    state.loading = false
}
onMounted(async() => {
    useEventListener(document, 'docActionRename', (event) => openDialog(event.detail))  
})
defineExpose({ openDialog })
</script>