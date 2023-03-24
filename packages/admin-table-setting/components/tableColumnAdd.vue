<template>
<el-dialog v-model="dialogVisible" :title="$t('addColumn')">
    <TableColumnEdit ref="TableColumnEditRef" :typeList="typeList"></TableColumnEdit>
    <template #footer>
        <el-button @click="dialogVisible = false">{{$t('cancel')}}</el-button>
        <el-button @click="handleAdd">{{$t('add')}}</el-button>
    </template>
</el-dialog>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'
const props = defineProps<{
    typeList: Array
}>()
const TableColumnEditRef = ref()
const dialogVisible = ref(false)
function handleOpen() {
    dialogVisible.value = true
    TableColumnEditRef.value.initForm()
}
const emit = defineEmits(['add'])
function handleAdd () {
    const form = TableColumnEditRef.value.getForm()
    emit('add', deepCopy(form))
    dialogVisible.value = false
}
defineExpose({ handleOpen })
</script>

<style scoped lang="scss">
</style>
