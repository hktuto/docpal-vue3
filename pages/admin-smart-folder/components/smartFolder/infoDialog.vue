<template>
<el-dialog v-model="state.visible" :title="state.title"
    class="scroll-dialog"
    append-to-body 
    :close-on-click-modal="false"
    @close="handleClose"
    >
    <FromRenderer ref="FromRendererRef" :form-json="formJson" />
    <template #footer>
        <div class="footer-grid">
            <el-button type="primary" :loading="state.loading" @click="handleSubmit">{{$t('common_submit')}}</el-button>
        </div>
    </template>
</el-dialog>
</template>
<script lang="ts" setup>
import { getJsonApi,UpdatePreSearchApi, deepCopy } from 'dp-api'
const emits = defineEmits([
    'refresh'
])
const state = reactive({
    loading: false,
    visible: false,
    setting: {},
    edit: false,
    title: $t('common_add')
})
const FromRendererRef = ref()
const formJson = getJsonApi('admin/smartFolderInfo.json')
const router = useRouter()
async function handleSubmit () {
    const data = await FromRendererRef.value.vFormRenderRef.getFormData()
    state.loading = true
    const _data = {
        name: data.name,
        bind: data.access.join(',')
    }
    try {
        const res = await UpdatePreSearchApi({
            ...state.setting,
            ..._data
        })
        emits('refresh')
        state.visible = false
    } catch (error) {
        state.loading = false
    }
    state.loading = false
}
function handleOpen(setting?) {
    state.visible = true
    state.edit = false
    state.loading = false
    if(!setting) {
        setTimeout(async () => {
            state.setting = {}
            state.title = $t('common_add')
            FromRendererRef.value.vFormRenderRef.resetForm()
        })
        return
    }
    setTimeout(async () => {
        const _setting = deepCopy(setting)
        state.title = _setting.name
        state.setting = _setting
        if(_setting.bind) _setting.access = _setting.bind.split(',')
        else _setting.access = []
        await FromRendererRef.value.vFormRenderRef.setFormData({
            ..._setting
        })
    })
}
defineExpose({ handleOpen })
</script>
<style lang="scss" scoped>

</style>
