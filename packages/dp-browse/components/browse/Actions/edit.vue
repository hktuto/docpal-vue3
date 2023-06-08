<template>
   <div>
        <el-tooltip content="edit">
            <!-- <div class="actionIconContainer" @click="openDialog(doc)"> -->
                <!-- <el-icon >
                    <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ea893728=""><path fill="currentColor" d="M832 512a32 32 0 1 1 64 0v352a32 32 0 0 1-32 32H160a32 32 0 0 1-32-32V160a32 32 0 0 1 32-32h352a32 32 0 0 1 0 64H192v640h640V512z"></path><path fill="currentColor" d="m469.952 554.24 52.8-7.552L847.104 222.4a32 32 0 1 0-45.248-45.248L477.44 501.44l-7.552 52.8zm422.4-422.4a96 96 0 0 1 0 135.808l-331.84 331.84a32 32 0 0 1-18.112 9.088L436.8 623.68a32 32 0 0 1-36.224-36.224l15.104-105.6a32 32 0 0 1 9.024-18.112l331.904-331.84a96 96 0 0 1 135.744 0z"></path></svg>
                </el-icon> -->
            <!-- </div> -->
            <SvgIcon src="/icons/file/edit.svg" round content="edit"
                @click="openDialog(doc)"></SvgIcon> 
        </el-tooltip>
        <el-dialog v-model="dialogOpened" append-to-body :title="$t('filePopover_rename')" class="scroll-dialog">
            <el-form ref="formRef" :model="form" label-width="120px" label-position="top" @submit.native.prevent>
                <el-form-item :label="$t('name')" prop="name"
                    :rules="[ { required: true, message: 'Please input email address', trigger: 'change'}]">
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
import { patchDocumentApi } from 'dp-api'
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
  loading: false
})
const { t} = useI18n() 
function openDialog(doc){
    state.doc = doc
    form.value.name = doc.name
    form.value.id = doc.id
    form.value.path = doc.path
    dialogOpened.value = true
}
async function handleSave(){
    state.loading = true
    try {
        // check if the name is exist in the folder
        const { isDuplicate } = await duplicateNameFilter(getParentPath(state.doc.path), [form.value]);

        if(isDuplicate && form.value.name !== props.doc.name){
            ElMessage({
                message: t('dpTip_duplicateFileName') as string,
                type: 'error'
            })
            state.loading = false
            return
        }
        await patchDocumentApi({
            idOrPath: form.value.id,
            name: form.value.name,
            properties: {},
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
</script>