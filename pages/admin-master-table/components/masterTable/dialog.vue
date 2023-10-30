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
    setting: {
        extraParams: [
            { type: "date", label: "Created_At" },
            { type: "string", label: "id" },
            { type: "date", label: "Last_Update" },
            { type: "string", label: "Modify_By" }
        ]
    },
    edit: false
})
const FromRendererRef = ref()
const formJson = getJsonApi('admin/masterTable.json')
const router = useRouter()
async function handleSubmit () {
    const data = await FromRendererRef.value.vFormRenderRef.getFormData()
    state.loading = true
    const _data = {
        name: data.name,
        access: data.access.join(',')
    }
    try {
        const res = await CreateDashboardApi(_data)
        router.push(`/data-dashboard/${res.id}`)
        state.visible = false
    } catch (error) {
        state.loading = false
    }
    state.loading = false
}
function handleOpen() {
    state.visible = true
    setTimeout(async () => {
        await FromRendererRef.value.vFormRenderRef.setFormData(state.setting)
        state.loading = false
    })
}
defineExpose({ handleOpen })
</script>
<style lang="scss" scoped>

</style>
