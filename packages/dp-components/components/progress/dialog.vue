<template>
<el-dialog v-model="state.dialogVisible" class="progress-dialog" :title="options.title"
    append-to-body :close-on-click-modal="false">
    <Progress v-bind="props" @close="handleClose"></Progress>
</el-dialog>
</template>

<script lang="ts" setup>
const props = defineProps<{
    options: progressType
}>()
const state = reactive({
    dialogVisible: false
})
function handleOpen() {
    state.dialogVisible = true 
}
function handleClose() {
    state.dialogVisible = false 
}
defineExpose({ handleOpen })
</script>

<style lang="scss">
.progress-dialog {
    width: 200px!important;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
    margin: unset;
    .el-dialog__body {
        text-align: center;
    }
}
</style>