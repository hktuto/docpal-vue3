<template>
<el-dialog v-model="state.visible" :title="$t('user_editUser')"
    :close-on-click-modal="false"
    >
    <FromRenderer ref="FromRendererRef" :form-json="formJson" />
    <template #footer>
        <el-button :loading="state.loading" @click="handleSubmit">{{$t('common_submit')}}</el-button>
    </template>
</el-dialog>
</template>
<script lang="ts" setup>
import { Select, CloseBold } from '@element-plus/icons-vue'
import { getJsonApi, PatchUserApi } from 'dp-api'
const props = defineProps<{
    user: object,
}>()
const emits = defineEmits([
    'refresh'
])
const state = reactive({
    loading: false,
    visible: false,
})
const FromRendererRef = ref()
const formJson = getJsonApi('admin/adminUserEditForm.json')
async function handleSubmit () {
    const data = await FromRendererRef.value.vFormRenderRef.getFormData()
    state.loading = true
    try {
        await PatchUserApi({ ...props.user, properties: null, ...data })
        state.visible = false
        FromRendererRef.value.vFormRenderRef.resetForm()
        emits('refresh')
    } catch (error) {
        
    }
    state.loading = false
}
function handleOpen() {
    state.visible = true
    setTimeout(() => {
        FromRendererRef.value.vFormRenderRef.setFormData(props.user)
    })
}
onMounted(async() => {
})
defineExpose({ handleOpen })
</script>
<style lang="scss" scoped>

</style>
