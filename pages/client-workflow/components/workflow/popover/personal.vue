<template>
<el-dropdown v-if="allowFeature('GENERATE_TEMPLATE') || allowFeature('BULK_IMPORT')" @command="handleCommand">
    <el-button type="primary" class="el-icon--left">
        {{$t('workflow_personalWorkflow')}}<el-icon class="el-icon--right"><arrow-down /></el-icon>
    </el-button>
    <template #dropdown>
        <el-dropdown-menu>
            <template v-for="item in state.menuList">
                <el-dropdown-item v-if="item.show" :key="item.id"
                    :command="item.id">{{$t(item.label)}}</el-dropdown-item>
            </template>
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
const { allowFeature } = useLayout()
const state = reactive({
    menuList: [
        { id: 'template', label: 'workflow_GenerateDocument', show: allowFeature('GENERATE_TEMPLATE') },
        // { id: 'bulkImport', label: 'workflow_bulkImport', show: allowFeature('BULK_IMPORT') } // hide request by crystal
    ]
})
const BulkImportDialogRef = ref()
const TemplateDialogRef = ref()
function handleCommand(command) {
    switch (command) {
        case 'template':
            dpLog({TemplateDialogRef});
            TemplateDialogRef.value.handleOpen()
            break;
        case 'bulkImport':
            dpLog({BulkImportDialogRef});

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
