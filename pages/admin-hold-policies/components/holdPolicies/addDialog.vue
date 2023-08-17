<template>
<el-dialog 
    class="scroll-dialog"
    v-model="state.visible" :title="state.isEdit ? $t('holdPolicies.edit') : $t('holdPolicies.create')"
    :close-on-click-modal="false" append-to-body
    >
    <FromRenderer ref="FromRendererRef" :form-json="formJson">
    </FromRenderer>
    <template #footer>
        <el-button type="primary" :loading="state.loading" @click="handleSubmit">{{$t('common_submit')}}</el-button>
    </template>
</el-dialog>
</template>
<script lang="ts" setup>
import { getJsonApi, CreateHoldPolicyApi, UpdateHoldPolicyApi } from 'dp-api'
const emits = defineEmits([
    'update'
])
const state = reactive({
    loading: false,
    visible: false,
    setting: {},
    isEdit: false
})
const router = useRouter()
const form = reactive({
    labelRule: []
})
const FromRendererRef = ref()
const formJson = getJsonApi('admin/holdPolicies.json')
async function handleSubmit() {
    const data = await FromRendererRef.value.vFormRenderRef.getFormData()
    if(!data) return
    const params = {
        ...state.setting,
        ...data
    }
    try {
        state.loading = true
        if(state.isEdit) await UpdateHoldPolicyApi(params)
        else await CreateHoldPolicyApi(params)
        
        state.visible = false
        emits('update')
    } catch (error) {
    }
    state.loading = false
}
async function handleOpen(setting) {
    state.visible = true
    setTimeout(async() => {
        await FromRendererRef.value.vFormRenderRef.resetForm()
        if(setting && setting.isEdit) {
            state.isEdit = true
            state.setting = setting
            await FromRendererRef.value.vFormRenderRef.setFormData({...state.setting})
            state.loading = false
        } else {
            state.isEdit = false
            state.setting = {}
        }
    })
}

defineExpose({ handleOpen })
</script>
<style lang="scss" scoped>

</style>
