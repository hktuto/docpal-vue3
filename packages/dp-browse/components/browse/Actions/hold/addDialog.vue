<template>
<el-dialog v-model="state.visible" :title="$t('user_newUser')"
    :close-on-click-modal="false"
    >
    <FromRenderer ref="FromRendererRef" :form-json="formJson" />
    <template #footer>
        <el-button :loading="state.loading" @click="handleSubmit">{{$t('common_submit')}}</el-button>
    </template>
</el-dialog>
</template>
<script lang="ts" setup>
import { Select, CloseBold } from '@element-plus/icons-vue'
import { getJsonApi, CreateUserApi } from 'dp-api'
const emits = defineEmits([
    'submit', 'remove'
])
const state = reactive({
    loading: false,
    visible: false,
    setting: {}
})
const FromRendererRef = ref()
const formJson = getJsonApi('client/updateHold.json')
async function handleSubmit () {
    const data = await FromRendererRef.value.vFormRenderRef.getFormData()
    state.loading = true
    try {
        if(state.setting.operation === 'A') {
            emits('submit', {
                holdPolicyId: data.id,
                holdApprovalId: data.approvedBy,
                applyReason: data.reason
            }, () => state.visible = false)
        } else {
            emits('remove', {
                id: data.id,
                removeReason: data.reason
            }, () => state.visible = false)
        }
    } catch (error) {
        
    }
    state.loading = false
}
function handleOpen(setting) {
    state.visible = true
    setTimeout(async () => {
        state.setting = setting
        await FromRendererRef.value.vFormRenderRef.resetForm()
        await FromRendererRef.value.vFormRenderRef.setFormData(setting)
        state.loading = false
    })
}

onMounted(async() => {
})
defineExpose({ handleOpen })
</script>
<style lang="scss" scoped>

</style>
