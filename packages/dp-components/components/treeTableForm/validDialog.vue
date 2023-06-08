<template>
<el-dialog class="scroll-dialog scroll-dialog-valid" v-model="state.visible" :title="$t('dataVerificationResult')" 
    append-to-body	>
    <div style="height: 50vh">
        <el-table :data="state.errorList" height="100%">
            <el-table-column prop="field" label="field" width="180"/>
            <el-table-column prop="message" label="message" />
        </el-table>
    </div>
</el-dialog>
</template>
<script lang="ts" setup>
import { ElMessage } from 'element-plus'
const state = reactive({
    visible: false,
    errorList: []
})
async function handleOpen(errorData) {
    
    state.errorList = Object.keys(errorData).reduce((prev, key) => {
        errorData[key].forEach(item => {
            prev.push(item)
        })
        return prev
    }, [])
    if(state.errorList.length === 0) {
        ElMessage.success($i18n.t('Data verification passed'))
    } else {
        state.visible = true
    }
}
defineExpose({ handleOpen })
</script>
<style lang="scss" scope>
.scroll-dialog-valid {
    width: 300px!important;
}
</style>
