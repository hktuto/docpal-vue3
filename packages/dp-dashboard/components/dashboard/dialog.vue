<template>
<el-dialog v-model="state.visible" :title="$t('dashboard.documentSizeSetting')"
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
import { getJsonApi, CreateDashboardApi, UpdateDashboardApi } from 'dp-api'
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
        console.log('errror', state.edit,data);
        if(state.edit) {
            const res = await UpdateDashboardApi({
                ...state.setting,
                ..._data
            })
            emits('refresh')
        }
        else {
            const res = await CreateDashboardApi(_data)
            router.push(`/ddashboardDesigner/${res.id}`)
        }
        state.visible = false
    } catch (error) {
        state.loading = false
    }
    state.loading = false
}
function handleOpen(setting?) {
    state.visible = true
    if(!setting) return
    setTimeout(async () => {
        state.edit = setting.edit = true
        state.setting = setting
        if(setting.access) setting.access = setting.access.split(',')
        else setting.access = []
        await FromRendererRef.value.vFormRenderRef.setFormData({
            ...setting
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
