<template>
<el-dialog v-model="state.visible" :title="$t('workflowEditor.add')"
    :close-on-click-modal="false"
    >
    <el-form ref="formRef" :model="state.form" label-position="top"
        class="demo-ruleForm" status-icon
    >
        <el-form-item :label="$t('dpTable_label')" prop="name"
            :rules="[{ required: true, message: $t('render.hint.fieldRequired'), trigger: 'blur' }]">
            <el-input v-model="state.form.name" />
        </el-form-item>
        <el-form-item :label="$t('workflowEditor.template')" prop="template">
            <el-radio-group v-model="state.form.template">
                <el-radio v-for="item in state.templateList" :key="item.id" :label="item.id">
                    <div class="workflow-template-step">
                        <SvgIcon class="workflow-template-step-icon" :src="item.icon" @click="toggleColor" />
                        <h3 class="workflow-template-step-label">{{item.name}}</h3>
                        <tip class="workflow-template-step-tip">{{$t(item.tip)}}</tip>
                    </div>
                </el-radio>
            </el-radio-group>
        </el-form-item>
    </el-form>
    <template #footer>
        <el-button :loading="state.loading" @click="handleSubmit">{{$t('common_submit')}}</el-button>
    </template>
</el-dialog>
</template>
<script lang="ts" setup>
import { Select, CloseBold } from '@element-plus/icons-vue'
import { UploadWorkflowApi } from 'dp-api'
const emits = defineEmits([
    'refresh'
])
const state = reactive({
    loading: false,
    visible: false,
    setting: {},
    form: {
        name: '',
        template: 'Single'
    },
    templateList: [
        { id: 'Single', name: 'Single Step', icon: '/icons/workflow/singleStepIcon.svg', tip: 'singleStepTip'},
        { id: 'Multiple', name: 'Multiple Step', icon: '/icons/workflow/multipleStepIcon.svg', tip: 'multipleStepTip'}
    ]
})
const formRef = ref()
async function handleSubmit () {
    const valid = await formRef.value.validate()
    if(!valid) return
    state.loading = true
    try {
        const formData = new FormData()
        formData.append('name', state.form.name)
        formData.append('file', await getXMLFile(state.form.template))
        await UploadWorkflowApi(formData)
        state.visible = false
        emits('refresh')
    } catch (error) {
        state.loading = false
    }
    state.loading = false
}
async function getXMLFile(template: string) {
    const singleFile = "/bpmn/single.xml";
    const multipleFile = "/bpmn/multiple.xml";
    const templatePath = template === 'Single' ? singleFile : multipleFile
    const response = await fetch(templatePath);
    const blob = await response.blob()
    return blob;
}
function handleOpen(setting) {
    state.visible = true
    state.loading = false
    nextTick(() => {
        formRef.value.resetFields()
    })
}
onMounted(async() => {
})
defineExpose({ handleOpen })
</script>
<style lang="scss" scoped>
:deep(.el-radio-group) {
    display: flex;
    align-items: start;
    flex-wrap: wrap;
    font-size: 0;
    flex-direction: column;
    gap: calc(var(--app-padding) * 2);
}
.workflow-template-step {
    display: grid;
    grid-template-columns: min-content, 1fr;
    grid-template-rows: repeat(2, min-content);
    grid-column-gap: 0px;
    grid-row-gap: 0px;
    gap: var(--app-input-padding);
    &-icon { 
        grid-area: 1 / 1 / 3 / 2; 
    }
    &-label { 
        height: 20px;
        margin: unset;
        grid-area: 1 / 2 / 2 / 3; }
    &-tip { 
        height: 20px;
        padding: unset;
        grid-area: 2 / 2 / 3 / 3; }
}
</style>
