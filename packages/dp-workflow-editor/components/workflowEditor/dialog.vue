<template>
<el-dialog v-model="state.visible" :title="state.setting.operation === 'ADD' ? $t('hp.addHold') : $t('hp.removeHold')"
    :close-on-click-modal="false"
    >
    <el-form ref="ruleFormRef" :model="state.form" label-position="top"
        class="demo-ruleForm" status-icon
    >
        <el-form-item label="Activity name" prop="name"
            :rule="[{ required: true, message: 'Please input Activity name', trigger: 'blur' }]">
            <el-input v-model="state.form.name" />
        </el-form-item>
        <el-form-item label="Resources" prop="resource">
            <el-radio-group v-model="state.form.template">
                <el-radio label="Sponsorship" />
                <el-radio label="Venue" />
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
import { CreateUserApi } from 'dp-api'
const emits = defineEmits([
    'submit', 'remove'
])
const state = reactive({
    loading: false,
    visible: false,
    setting: {},
    form: {}
})
const FromRendererRef = ref()
async function handleSubmit () {
    const data = await FromRendererRef.value.vFormRenderRef.getFormData()
    state.loading = true
    try {
        emits('submit', {
            holdPolicyId: data.id,
            holdApprovalId: data.approvedBy,
            applyReason: data.reason
        }, () => {
            state.visible = false
            state.loading = false
        })
    } catch (error) {
        state.loading = false
    }
    
}
function handleOpen(setting) {
    state.visible = true
}

onMounted(async() => {
})
defineExpose({ handleOpen })
</script>
<style lang="scss" scoped>

</style>
