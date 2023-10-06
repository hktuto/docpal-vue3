<template>
<el-dialog v-model="state.visible" :title="state.edit ? $t('emailTemplate.editLayout') : $t('emailTemplate.addLayout')"
    :close-on-click-modal="false"
    @close="handleClose"
    class="scroll-dialog"
    >
    <FromRenderer ref="FromRendererRef" :form-json="formJson" />
    <template #footer>
        <div class="footer-grid">
            <!-- Please use [[emailContent]] as content container. -->
            <div>{{$t('tip.emailLayout')}}</div>
            <el-button type="info" @click="handleInit">{{$t('emailTemplate.initLayout')}}</el-button>
            <el-button type="primary" :loading="state.loading" @click="handleSubmit">{{$t('common_submit')}}</el-button>
        </div>
    </template>
</el-dialog>
</template>
<script lang="ts" setup>
import { ElMessageBox } from 'element-plus'
import { Select, CloseBold } from '@element-plus/icons-vue'
import { getJsonApi, CreateEmailLayoutApi, UpdateEmailLayoutApi } from 'dp-api'
const emits = defineEmits([
    'refresh'
])
const state = reactive({
    loading: false,
    visible: false,
    edit: false,
    setting: {},
    initLayout: '<!DOCTYPEhtml>\n<html>\n<title>WCLEmailTemplate</title>\n<head></head>\n<body>\n<h1>WCLEmailTemplateLogo.</h1>\n[[emailContent]]\n</body>\n</html>'
})
const FromRendererRef = ref()
const formJson = getJsonApi('admin/emailLayout.json')
async function handleSubmit () {
    const data = await FromRendererRef.value.vFormRenderRef.getFormData()
    state.loading = true
    try {
        if(state.edit) {
            data.id = state.setting.id
            await UpdateEmailLayoutApi(data)
        } else {
            await CreateEmailLayoutApi(data)
        }
        emits('refresh')
        state.visible = false
    } catch (error) {
        state.loading = false
    }
    state.loading = false
}
function handleClose() {
    FromRendererRef.value.vFormRenderRef.resetForm()
    const layoutRef = FromRendererRef.value.vFormRenderRef.getWidgetRef('layoutContent')
    layoutRef.setValue(state.initLayout)
}
function handleOpen(setting) {
    state.visible = true
    state.edit = !!setting
    setTimeout(async () => {
        state.setting = setting
        await FromRendererRef.value.vFormRenderRef.setFormData(setting)
        state.loading = false
    })
}
async function handleInit () {
    const layoutRef = FromRendererRef.value.vFormRenderRef.getWidgetRef('layoutContent')
    const layoutContent = layoutRef.getValue()
    let action = 'confirm'
    if (layoutContent) action = await ElMessageBox.confirm(`${$t('msg_confirmWhetherToInit')}`)
    if (action !== 'confirm') return
    layoutRef.setValue(state.initLayout)
}
onMounted(async() => {
})
defineExpose({ handleOpen })
</script>
<style lang="scss" scoped>
.footer-grid {
    display: grid;
    grid-template-columns: 1fr min-content min-content;
    text-align: left;
}
</style>
