<template>
<el-dialog v-model="state.visible" :title="$t('dashboard.documentSizeSetting')"
    class="scroll-dialog"
    append-to-body 
    :close-on-click-modal="false"
    @close="handleClose"
    >
    <FromRenderer ref="FromRendererRef" :form-json="formJson" >
        <template v-slot:chartIcon>
            <el-form-item label="icon">
                <SvgIconSelector v-model:src="state.icon" />
            </el-form-item>
        </template>
    </FromRenderer>
    <template #footer>
        <div class="footer-grid">
            <el-button type="danger" @click="handleDelete">{{$t('common_delete')}}</el-button>
            <el-button type="primary" :loading="state.loading" @click="handleSubmit">{{$t('common_submit')}}</el-button>
        </div>
    </template>
</el-dialog>
</template>
<script lang="ts" setup>
import { getJsonApi } from 'dp-api'
const emits = defineEmits([
    'refresh', 'delete'
])
const state = reactive({
    loading: false,
    visible: false,
    setting: {},
    icon: ''
})
const FromRendererRef = ref()
const formJson = getJsonApi('dashboard/countSetting.json')
async function handleSubmit () {
    const data = await FromRendererRef.value.vFormRenderRef.getFormData()
    state.loading = true
    try {
        emits('refresh', structuredClone(toRaw(data)))
    } catch (error) {
        state.loading = false
    }
    state.visible = false
    state.loading = false
}
function handleOpen(setting) {
    state.visible = true
    setTimeout(async () => {
        state.setting = setting
        await FromRendererRef.value.vFormRenderRef.setFormData(setting)
        state.loading = false
    })
}
function handleDelete() {
    emits('delete')
    state.visible = false
}
defineExpose({ handleOpen })
</script>
<style lang="scss" scoped>

</style>
