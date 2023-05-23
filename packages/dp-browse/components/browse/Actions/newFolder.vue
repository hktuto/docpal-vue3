<template>
    <!-- <div class="actionIconContainer" @click="iconClickHandler(doc)"> -->
    <div>
        <SvgIcon src="/icons/file/newFolder.svg"  
            content="new folder"
            round
            @click="iconClickHandler(doc)"></SvgIcon>
        <!-- <el-tooltip content="new folder">
            <el-icon >
                <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ea893728=""><path fill="currentColor" d="M128 192v640h768V320H485.76L357.504 192H128zm-32-64h287.872l128.384 128H928a32 32 0 0 1 32 32v576a32 32 0 0 1-32 32H96a32 32 0 0 1-32-32V160a32 32 0 0 1 32-32zm384 416V416h64v128h128v64H544v128h-64V608H352v-64h128z"></path></svg>
            </el-icon>
        </el-tooltip> -->
        <el-dialog v-model="dialogOpened" append-to-body 
                    :close-on-click-modal="false">
            <template #title>
                <strong class="primaryTitle">{{ $t('filePopover_newFolder') }}</strong>
                {{ 'in ' + state.docPath }}
            </template>
            <FromRenderer :ref="(el) => FromRendererRef = el" :form-json="formJson" />
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

async function handleSubmit () {
    console.log("handleSubmit")
    state.loading = true
    try {
        const timestamp = new Date().valueOf()
        const data = await FromRendererRef.value.vFormRenderRef.getFormData()
        const params = {
            ...data,
            idOrPath: `${state.docPath}/new Folder${timestamp}`,
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
        console.log(error)
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
</script>