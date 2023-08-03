<template>
    <el-tag  :class="['userRightItem',{ [ace.type]:true }]" effect="dark"
              :closable="false" >
              {{ ace.userId }}
    </el-tag>
</template>

<script lang="ts" setup>
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