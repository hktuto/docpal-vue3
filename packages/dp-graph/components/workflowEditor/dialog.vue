<template>
<el-dialog v-model="state.visible" :title="$t('workflowEditor.add')"
    :close-on-click-modal="false"
    >
    <el-form ref="formRef" :model="state.form" label-position="top"
        class="demo-ruleForm" status-icon
    >
        <el-form-item :label="$t('workflowEditor.name')" prop="name">
            <el-input v-model="state.form.name" :placeholder="$t('workflowEditor.name')" />
        </el-form-item>
        <el-form-item :label="$t('workflowEditor.template')" prop="template">
            <el-radio-group v-model="state.form.template">
                <el-radio v-for="item in workflowTemplateList" :key="item.id" :label="item.id">
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
import {workflowTemplateList} from '../../utils/workflowTemplate'
const router = useRouter()

const state = reactive({
    visible: false,
    form: {
        template: 'Single',
        name:''
    }
})
const formRef = ref()
async function handleSubmit () {
  // TODO : validate form
    if(!state.form.name) return;
    router.push(`/workflowEditor/new?template=${state.form.template}&name=${state.form.name}`)
}

function handleOpen(setting) {
    state.visible = true
    state.loading = false
}
onMounted(async() => {
})
defineExpose({ handleOpen })
</script>
<style lang="scss" scoped>
:deep(.el-radio-group) {
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
    font-size: 0;
    flex-direction: column;
    gap: calc(var(--app-padding) * 2);
}
.el-radio {
    height: unset;
}
.workflow-template-step {
    display: grid;
    grid-template-columns: min-content, 1fr;
    grid-template-rows: repeat(2, min-content);
    grid-column-gap: var(--app-padding);
    grid-row-gap: var(--app-input-padding);
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
