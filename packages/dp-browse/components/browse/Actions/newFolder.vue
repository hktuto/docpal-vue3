<template>
    <div>
        <SvgIcon src="/icons/file/newFolder.svg"  
            content="new folder"
            round
            @click="iconClickHandler(doc)"></SvgIcon>
        <el-dialog class="scroll-dialog" v-model="dialogOpened" append-to-body 
                    :close-on-click-modal="false">
            <template #title>
                <strong class="primaryTitle">{{ $t('filePopover_newFolder') }}</strong>
                {{ 'in /' + state.doc.name }}
            </template>
            <FromRenderer :ref="(el) => FromRendererRef = el" :form-json="formJson" 
                @formChange="formChange"/>
            <MetaEditForm ref="MetaFormRef"></MetaEditForm>
            <template #footer>
                <el-button :loading="state.loading" type="primary" @click="handleSubmit">{{$t('submit')}}</el-button>
            </template>
        </el-dialog>
    </div>
    
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { useEventListener } from '@vueuse/core'
import { CreateFoldersApi, getJsonApi } from 'dp-api'
const dialogOpened = ref(false)
const { t } = useI18n()
const props = defineProps<{
    doc: any,
    selected: any[]
}>()
const emits = defineEmits(['success'])
const state = reactive({
    loading: false,
    docPath: '',
    doc: {}
})
const FromRendererRef = ref()
const MetaFormRef = ref()
function iconClickHandler(doc:any){
    dialogOpened.value = true
    state.docPath = doc.path 
    state.doc = doc
    // open upload dialog
    setTimeout(() => {
        handleReset()
    })
    
}
const formJson = getJsonApi('fileNewFolder.json')
function formChange ({fieldName,newValue,oldValue,formModel}) {
    if(fieldName[0] === 'type') MetaFormRef.value.initMeta(fieldName[1])
}
async function handleSubmit () {
    try {
        const timestamp = new Date().valueOf()
        const metaFormData = MetaFormRef.value.getData()
        if(!metaFormData) return
        const data = await FromRendererRef.value.vFormRenderRef.getFormData()
        const parentPath = state.docPath === '/' ? '' : state.docPath
        state.loading = true
        const params = {
            ...data,
            properties: metaFormData,
            idOrPath: `${parentPath}/new Folder${timestamp}`,
        }
        
        const { isDuplicate } = await duplicateNameFilter(state.doc.path, [data]);
        if(isDuplicate){
            throw new Error("dpTip_duplicateFileName");
        }
        const res = await CreateFoldersApi(params)
        dialogOpened.value = false
        emits('success', state.doc)
        state.loading = false
    } catch (error) {
        if(error.message === 'dpTip_duplicateFileName') {
            ElMessage({
                message: t(error.message) as string,
                type: 'error'
            })
        }
        state.loading = false
    }
    
}
function handleReset() {
    if(FromRendererRef.value.vFormRenderRef) {
        FromRendererRef.value.vFormRenderRef.resetForm()
        const typeRef = FromRendererRef.value.vFormRenderRef.getWidgetRef('type')
        typeRef.setValue('Folder')
    }
    
}
onMounted(() => {
    useEventListener(document, 'docActionAddFolder', (event) => iconClickHandler(event.detail))  
})
defineExpose({ iconClickHandler })
</script>