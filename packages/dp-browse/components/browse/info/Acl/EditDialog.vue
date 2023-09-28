<template>
    <el-dialog 
        v-model="state.dialogVisible"
        :close-on-click-modal="false"
        append-to-body>
        <template #title>
            {{$t(state.title)}}
        </template>
        <FromRenderer ref="FromRendererRef" :form-json="formJson"/>
        <template #footer>
            <el-button :loading="state.loading" @click="handleSubmit">{{$t('common_submit')}}</el-button>
        </template>
</el-dialog>
</template>

<script lang="ts" setup>
import { useEventListener } from '@vueuse/core'
import { getJsonApi, CreateInternalShareApi } from 'dp-api'
const emit = defineEmits(['handleUpdate', 'handleAdd'])
const state = reactive({
    loading: false,
    isEdit: false,
    dialogVisible: false,
    internalShare: false,
    doc: {},
    title: 'dpDocument_acl_addLocal'
})
const FromRendererRef = ref()

const formJson = getJsonApi('client/AclForm.json')
async function handleSubmit () {
    const data = await FromRendererRef.value.vFormRenderRef.getFormData()
    if (!data) return
    state.loading = true;
    const result = { ...data }

    if (result.time === 'permanent') {
        delete result.startDate
        delete result.endDate
    } else {
        result.startDate = result.dateRange[0]
        result.endDate = result.dateRange[1]
    }
    delete result.internalShare
    delete result.isEdit
    delete result.dateRange
    delete result.time
    if (state.internalShare) {
        result.isSendEmail = result.isSendEmail.length > 0 ? true : false
        result.documentIds = [state.doc.id]
        createInternalShare(result, handleCloseDialog)
    }
    else if (state.isEdit) {
        emit('handleUpdate', result, handleCloseDialog)
    } 
    else {
        emit('handleSubmit', result, handleCloseDialog)
    }
}
const handleCloseDialog = (closeDialog: boolean = true) => {
    state.dialogVisible = !closeDialog
    console.log(state.dialogVisible, 'state.dialogVisible');
    
    state.loading = false
    if (closeDialog) FromRendererRef.value.vFormRenderRef.resetForm()
}
function handleOpen (docDetail, isEdit: boolean = false, internalShare: boolean = false) {
    state.doc = docDetail
    state.dialogVisible = true
    state.isEdit = isEdit
    state.title = state.isEdit ? 'dpDocument_acl_editLocal' : 'dpDocument_acl_addLocal'
    state.internalShare = internalShare
    let params 
    if (isEdit) {
        params = {...docDetail, 
            isEdit: true,
            isPermanent: !docDetail.startDate && !docDetail.endDate,
            dateRange: (docDetail.startDate && docDetail.endDate) ? [docDetail.startDate, docDetail.endDate] : null
        }
    } else {
        params = { permission: docDetail.permission || ""}
    }
    params.internalShare = internalShare
    nextTick(() => {
        FromRendererRef.value.vFormRenderRef.setFormData(params)
    })
}
// #region module: internal share 
    function handleInternalShare (docDetail) {
        handleOpen({
            ...docDetail,
            permission: 'ReadWrite'
        }, false, true)
        state.title = 'filePopover_internalShare'
    }
    async function createInternalShare(formData, cb) {
        try {
            await CreateInternalShareApi(formData)
            cb()
        } catch (error) {
            cb(false)
        }
    }
// #endregion

defineExpose({
    handleOpen
})
onMounted(async() => {
    useEventListener(document, 'docActionInternalShare', (event) => handleInternalShare(event.detail))  
})
</script>

<style lang="scss" scoped>
.el-select, .el-radio-group, .el-date-editor.el-input{
    width: 100%
}
:deep .el-dialog__body {
    padding: 0 20px 30px;
}
:deep .el-date-editor {
    width: 100%;
    .el-range-separator {
        width: 2rem;
    }
}
</style>