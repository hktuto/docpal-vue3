<template>
<el-dialog v-model="state.visible" :title="$t('dashboard.setting')"
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
import { getJsonApi, CreateDashboardApi, UpdateDashboardApi, deepCopy } from 'dp-api'
const emits = defineEmits([
    'refresh', 'delete'
])
const state = reactive({
    loading: false,
    visible: false,
    setting: {},
    edit: false
})
const FromRendererRef = ref()
const formJson = getJsonApi('dashboard/edit.json')
const router = useRouter()
async function handleSubmit () {
    const data = await FromRendererRef.value.vFormRenderRef.getFormData()
    state.loading = true
    const _data = {
        name: data.name,
        access: data.access.join(',')
    }
    try {
        if(state.edit) {
            const res = await UpdateDashboardApi({
                ...state.setting,
                ..._data
            })
            emits('refresh')
        }
        else {
            const res = await CreateDashboardApi(_data)
            router.push(`/data-dashboard/${res.id}`)
        }
        state.visible = false
    } catch (error) {
        state.loading = false
    }
    state.loading = false
}
function handleOpen(setting?) {
    state.visible = true
    state.edit = false
    if(!setting) {
        setTimeout(async () => {
            FromRendererRef.value.vFormRenderRef.resetForm()
        })
        return
    }
    setTimeout(async () => {
        const _setting = deepCopy(setting)
        state.edit = _setting.edit = true
        state.setting = _setting
        if(_setting.access) _setting.access = _setting.access.split(',')
        else _setting.access = []
        await FromRendererRef.value.vFormRenderRef.setFormData({
            ..._setting
        })
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
