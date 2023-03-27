<template>
<el-dropdown @command="handleCommand">
    <el-button type="primary" class="mg-r">
        {{$t('workflow_personalWorkflow')}}<el-icon class="el-icon--right"><arrow-down /></el-icon>
    </el-button>
    <template #dropdown>
        <el-dropdown-menu>
            <el-dropdown-item v-for="item in state.menuList" :key="item.id"
                :command="item.id">{{$t(item.label)}}</el-dropdown-item>
        </el-dropdown-menu>
    </template>
</el-dropdown>
<WorkflowPopoverTemplate ref="TemplateDialogRef" />
<WorkflowPopoverBulkImport ref="BulkImportDialogRef" />
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'
import {  } from 'dp-api'
import Template from './template.vue'
import BulkImport from './bulkImport.vue'
const emits = defineEmits([]);
const state = reactive({
    menuList: [
        { id: 'template', label: 'workflow_GenerateDocument' },
        { id: 'bulkImport', label: 'workflow_bulkImport' }
    ]
})
const BulkImportDialogRef = ref()
const TemplateDialogRef = ref()
function handleCommand(command) {
    switch (command) {
        case 'template':
            console.log({TemplateDialogRef});
            TemplateDialogRef.value.handleOpen()
            break;
        case 'bulkImport':
            console.log({BulkImportDialogRef});
            
            BulkImportDialogRef.value.handleOpen()
            break;
        default:
            break;
    }
}
</script>
<style lang="scss" scoped>
.mg-r {
    margin-right: var(--app-padding);
}
</style>
