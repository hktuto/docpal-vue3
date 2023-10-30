<template>
<el-dialog v-model="state.visible" :title="$t('dashboard.setting')"
    class="scroll-dialog"
    append-to-body 
    :close-on-click-modal="false"
    @close="handleClose"
    >
    <FromVariablesRenderer ref="FromVariablesRendererRef"/>
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
    setting: [
        { type: "date", name: "Created_At" },
        { type: "string", name: "id" },
        { type: "date", name: "Last_Update" },
        { type: "string", name: "Modify_By" }
    ],
    edit: false
})
const router = useRouter()
async function handleSubmit () {
    state.loading = true
    const data = await FromVariablesRendererRef.value.getData()
    console.log(data)
    try {
        // const res = await CreateDashboardApi(_data)
        // router.push(`/data-dashboard/${res.id}`)
        state.visible = false
    } catch (error) {
        state.loading = false
    }
    state.loading = false
}
const FromVariablesRendererRef = ref()
function handleOpen() {
    state.visible = true
    setTimeout(async () => {
        FromVariablesRendererRef.value.createJson(state.setting)
    })
}
defineExpose({ handleOpen })
</script>
<style lang="scss" scoped>

</style>

