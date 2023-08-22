<template>
<el-dialog 
    class="scroll-dialog retention-add-dialog"
    v-model="state.visible" :title="$t('holdPolicies.create')"
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
import { getJsonApi, CreateRetentionApi } from 'dp-api'
const emits = defineEmits([
    'update'
])
const state = reactive({
    loading: false,
    visible: false,
    setting: {},
})
const router = useRouter()
const form = reactive({
    labelRule: []
})
const FromRendererRef = ref()
const formJson = getJsonApi('admin/retention.json')
async function handleSubmit() {
    const data = await FromRendererRef.value.vFormRenderRef.getFormData()
    if(!data) return
    const params = {
        ...state.setting,
        ...data,
        actionType: data.actionType ? 'D' : 'A'
    }
    try {
        state.loading = true
        await CreateRetentionApi(params)
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
        state.setting = {}
    })
}

defineExpose({ handleOpen })
</script>
<style lang="scss">
.retention-add-dialog {
    min-width: 900px;
}
</style>
