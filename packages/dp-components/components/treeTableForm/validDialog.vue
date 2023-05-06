<template>
<el-dialog v-model="state.visible" :title="$t('dataVerificationResult')" class="scroll-dialog scroll-dialog-valid">
    <div style="height: 50vh">
        <el-table :data="state.errorList" height="100%">
            <el-table-column prop="field" label="field" width="180"/>
            <el-table-column prop="message" label="message" />
        </el-table>
    </div>
</el-dialog>
</template>
<script lang="ts" setup>
const state = reactive({
    visible: false,
    errorList: []
})
async function handleOpen(errorData) {
    state.visible = true
    state.errorList = Object.keys(errorData).reduce((prev, key) => {
        errorData[key].forEach(item => {
            prev.push(item)
        })
        return prev
    }, [])
}
defineExpose({ handleOpen })
</script>
<style lang="scss" scope>
.scroll-dialog-valid {
    width: 300px!important;
}
</style>
