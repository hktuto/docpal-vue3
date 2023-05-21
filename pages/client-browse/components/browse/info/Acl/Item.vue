<template>
    <el-tag  :class="['userRightItem',{ cursorPointer: ace.type === 'local' && AllowTo({feature:'ManageRecord', userPermission: permission.permission}), [ace.type]:true }]" effect="dark"
              :closable="ace.type === 'local' && AllowTo({feature:'ManageRecord', userPermission: permission.permission})" 
              @close="handleRemove(ace)"
              @click="handleEdit(ace)">
              {{ ace.userId }}
    </el-tag>
</template>

<script lang="ts" setup>
import { AllowTo } from '~/utils/permissionHelper';
const props = defineProps<{ace:{userId: string, type:string},permission:any }>();
const emit = defineEmits(['handleRemove', 'handleEdit']);
function handleEdit(item:any) {
    if (item.type === 'local' && AllowTo({feature:'ManageRecord', userPermission: props.permission.permission})) {
        emit('handleEdit', item);
    }
}
function handleRemove(item:any) {
    if (item.type === 'local' && AllowTo({feature:'ManageRecord', userPermission: props.permission.permission})) {
        emit('handleRemove', item);
    }
}
</script>

<style scoped lang="scss">
.el-tag{
    &.inherited{
        --el-tag-bg-color: var(--color-grey-400);
        --el-tag-border-color: var(--color-grey-400);
    }
}
</style>